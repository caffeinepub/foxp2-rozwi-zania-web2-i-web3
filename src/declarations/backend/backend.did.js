export const idlFactory = ({ IDL }) => {
  const Product = IDL.Record({ 'id' : IDL.Text });
  const RodoContent = IDL.Record({
    'de' : IDL.Text,
    'en' : IDL.Text,
    'pl' : IDL.Text,
  });
  const Translation = IDL.Record({
    'de' : IDL.Text,
    'en' : IDL.Text,
    'pl' : IDL.Text,
  });
  const Web3Card = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'imagePath' : IDL.Text,
    'link' : IDL.Text,
    'buttonTitle' : IDL.Text,
    'description' : IDL.Text,
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const ShoppingItem = IDL.Record({
    'productName' : IDL.Text,
    'currency' : IDL.Text,
    'quantity' : IDL.Nat,
    'priceInCents' : IDL.Nat,
    'productDescription' : IDL.Text,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const ContactMessage = IDL.Record({
    'email' : IDL.Text,
    'message' : IDL.Text,
    'timestamp' : IDL.Int,
    'phone' : IDL.Opt(IDL.Text),
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const StripeSessionStatus = IDL.Variant({
    'completed' : IDL.Record({
      'userPrincipal' : IDL.Opt(IDL.Text),
      'response' : IDL.Text,
    }),
    'failed' : IDL.Record({ 'error' : IDL.Text }),
  });
  const Web3CardTranslation = IDL.Record({
    'de' : Web3Card,
    'en' : Web3Card,
    'pl' : Web3Card,
  });
  const StripeConfiguration = IDL.Record({
    'allowedCountries' : IDL.Vec(IDL.Text),
    'secretKey' : IDL.Text,
  });
  const http_header = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const http_request_result = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(http_header),
  });
  const TransformationInput = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : http_request_result,
  });
  const TransformationOutput = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(http_header),
  });
  return IDL.Service({
    'addProduct' : IDL.Func([Product], [], []),
    'addRodoContent' : IDL.Func([IDL.Text, RodoContent], [], []),
    'addTranslation' : IDL.Func([IDL.Text, Translation], [], []),
    'addWeb3Card' : IDL.Func([Web3Card], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'createCheckoutSession' : IDL.Func(
        [IDL.Vec(ShoppingItem), IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'deleteContactMessage' : IDL.Func([IDL.Text], [], []),
    'deleteProduct' : IDL.Func([IDL.Text], [], []),
    'deleteRodoContent' : IDL.Func([IDL.Text], [], []),
    'deleteTranslation' : IDL.Func([IDL.Text], [], []),
    'deleteWeb3Card' : IDL.Func([IDL.Text], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getAllRodoContents' : IDL.Func([], [IDL.Vec(RodoContent)], ['query']),
    'getAllTranslations' : IDL.Func([], [IDL.Vec(Translation)], ['query']),
    'getCallerPrincipalAndAdminStatus' : IDL.Func(
        [],
        [IDL.Principal, IDL.Bool],
        ['query'],
      ),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getContactMessages' : IDL.Func([], [IDL.Vec(ContactMessage)], ['query']),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getProducts' : IDL.Func([], [IDL.Vec(Product)], ['query']),
    'getRodoContent' : IDL.Func([IDL.Text], [IDL.Opt(RodoContent)], ['query']),
    'getStripeSessionStatus' : IDL.Func([IDL.Text], [StripeSessionStatus], []),
    'getTranslation' : IDL.Func([IDL.Text], [IDL.Opt(Translation)], ['query']),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'getWeb3CardTranslationPreview' : IDL.Func(
        [Web3Card],
        [Web3CardTranslation],
        ['query'],
      ),
    'getWeb3Cards' : IDL.Func([], [IDL.Vec(Web3Card)], ['query']),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isStripeConfigured' : IDL.Func([], [IDL.Bool], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'setStripeConfiguration' : IDL.Func([StripeConfiguration], [], []),
    'submitContactMessage' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [IDL.Bool],
        [],
      ),
    'transform' : IDL.Func(
        [TransformationInput],
        [TransformationOutput],
        ['query'],
      ),
    'updateProduct' : IDL.Func([Product], [], []),
    'updateRodoContent' : IDL.Func([IDL.Text, RodoContent], [], []),
    'updateTranslation' : IDL.Func([IDL.Text, Translation], [], []),
    'updateWeb3Card' : IDL.Func([Web3Card], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
