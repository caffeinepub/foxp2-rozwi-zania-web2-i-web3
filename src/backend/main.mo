import OrderedMap "mo:base/OrderedMap";
import BlobStorage "blob-storage/Mixin";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import Debug "mo:base/Debug";
import Registry "blob-storage/registry";



persistent actor FoxP2Backend {

  public type ContactMessage = {
    firstName : Text;
    lastName : Text;
    email : Text;
    phone : ?Text;
    message : Text;
    timestamp : Int;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var contactMessages = textMap.empty<ContactMessage>();

  public func submitContactMessage(firstName : Text, lastName : Text, email : Text, phone : ?Text, message : Text) : async Bool {
    if (Text.size(message) > 250) {
      return false;
    };

    let timestamp = Time.now();
    let messageId = Text.concat(email, Int.toText(timestamp));

    let contactMessage : ContactMessage = {
      firstName;
      lastName;
      email;
      phone;
      message;
      timestamp;
    };

    contactMessages := textMap.put(contactMessages, messageId, contactMessage);
    true;
  };

  public query func getContactMessages() : async [ContactMessage] {
    var messagesList = List.nil<ContactMessage>();
    for ((_, message) in textMap.entries(contactMessages)) {
      messagesList := List.push(message, messagesList);
    };
    List.toArray(messagesList);
  };

  public func deleteContactMessage(messageId : Text) : async () {
    contactMessages := textMap.delete(contactMessages, messageId);
  };

  // Authorization and User Management
  let accessControlState = AccessControl.initState();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Stripe Integration
  public type Product = {
    id : Text;
  };

  var products = textMap.empty<Product>();

  public query func getProducts() : async [Product] {
    Iter.toArray(textMap.vals(products));
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add products");
    };
    products := textMap.put(products, product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update products");
    };
    products := textMap.put(products, product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete products");
    };
    products := textMap.delete(products, productId);
  };

  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // New function to get caller's principal and admin status
  public query ({ caller }) func getCallerPrincipalAndAdminStatus() : async (Principal, Bool) {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    (caller, isAdmin);
  };

  // Web3 Card Management
  public type Web3Card = {
    id : Text;
    imagePath : Text;
    title : Text;
    description : Text;
    buttonTitle : Text;
    link : Text;
  };

  var web3Cards = textMap.empty<Web3Card>();

  public query func getWeb3Cards() : async [Web3Card] {
    Iter.toArray(textMap.vals(web3Cards));
  };

  public shared ({ caller }) func addWeb3Card(card : Web3Card) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add Web3 cards");
    };
    web3Cards := textMap.put(web3Cards, card.id, card);
  };

  public shared ({ caller }) func updateWeb3Card(card : Web3Card) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update Web3 cards");
    };
    web3Cards := textMap.put(web3Cards, card.id, card);
  };

  public shared ({ caller }) func deleteWeb3Card(cardId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete Web3 cards");
    };
    web3Cards := textMap.delete(web3Cards, cardId);
  };

  // File Reference Management
  let registry = Registry.new();

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can register file references");
    };
    Registry.add(registry, path, hash);
  };

  public query func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can drop file references");
    };
    Registry.remove(registry, path);
  };

  // Translation Management
  public type Translation = {
    pl : Text;
    en : Text;
    de : Text;
  };

  var translations = textMap.empty<Translation>();

  public query func getTranslation(key : Text) : async ?Translation {
    textMap.get(translations, key);
  };

  public shared ({ caller }) func addTranslation(key : Text, translation : Translation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add translations");
    };
    translations := textMap.put(translations, key, translation);
  };

  public shared ({ caller }) func updateTranslation(key : Text, translation : Translation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update translations");
    };
    translations := textMap.put(translations, key, translation);
  };

  public shared ({ caller }) func deleteTranslation(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete translations");
    };
    translations := textMap.delete(translations, key);
  };

  public query func getAllTranslations() : async [Translation] {
    Iter.toArray(textMap.vals(translations));
  };

  // Translation Preview for Web3 Cards
  public type Web3CardTranslation = {
    pl : Web3Card;
    en : Web3Card;
    de : Web3Card;
  };

  public query func getWeb3CardTranslationPreview(card : Web3Card) : async Web3CardTranslation {
    let enCard : Web3Card = {
      card with
      title = Text.concat(card.title, " (EN)");
      description = Text.concat(card.description, " (EN)");
      buttonTitle = Text.concat(card.buttonTitle, " (EN)");
    };

    let deCard : Web3Card = {
      card with
      title = Text.concat(card.title, " (DE)");
      description = Text.concat(card.description, " (DE)");
      buttonTitle = Text.concat(card.buttonTitle, " (DE)");
    };

    {
      pl = card;
      en = enCard;
      de = deCard;
    };
  };

  // RODO Content Management
  public type RodoContent = {
    pl : Text;
    en : Text;
    de : Text;
  };

  var rodoContents = textMap.empty<RodoContent>();

  public query func getRodoContent(key : Text) : async ?RodoContent {
    textMap.get(rodoContents, key);
  };

  public shared ({ caller }) func addRodoContent(key : Text, content : RodoContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add RODO content");
    };
    rodoContents := textMap.put(rodoContents, key, content);
  };

  public shared ({ caller }) func updateRodoContent(key : Text, content : RodoContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update RODO content");
    };
    rodoContents := textMap.put(rodoContents, key, content);
  };

  public shared ({ caller }) func deleteRodoContent(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete RODO content");
    };
    rodoContents := textMap.delete(rodoContents, key);
  };

  public query func getAllRodoContents() : async [RodoContent] {
    Iter.toArray(textMap.vals(rodoContents));
  };

  include BlobStorage(registry);
};

