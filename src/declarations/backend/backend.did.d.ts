import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ContactMessage {
  'email' : string,
  'message' : string,
  'timestamp' : bigint,
  'phone' : [] | [string],
  'lastName' : string,
  'firstName' : string,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface Product { 'id' : string }
export interface RodoContent { 'de' : string, 'en' : string, 'pl' : string }
export interface ShoppingItem {
  'productName' : string,
  'currency' : string,
  'quantity' : bigint,
  'priceInCents' : bigint,
  'productDescription' : string,
}
export interface StripeConfiguration {
  'allowedCountries' : Array<string>,
  'secretKey' : string,
}
export type StripeSessionStatus = {
    'completed' : { 'userPrincipal' : [] | [string], 'response' : string }
  } |
  { 'failed' : { 'error' : string } };
export interface TransformationInput {
  'context' : Uint8Array | number[],
  'response' : http_request_result,
}
export interface TransformationOutput {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<http_header>,
}
export interface Translation { 'de' : string, 'en' : string, 'pl' : string }
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface Web3Card {
  'id' : string,
  'title' : string,
  'imagePath' : string,
  'link' : string,
  'buttonTitle' : string,
  'description' : string,
}
export interface Web3CardTranslation {
  'de' : Web3Card,
  'en' : Web3Card,
  'pl' : Web3Card,
}
export interface http_header { 'value' : string, 'name' : string }
export interface http_request_result {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<http_header>,
}
export interface _SERVICE {
  'addProduct' : ActorMethod<[Product], undefined>,
  'addRodoContent' : ActorMethod<[string, RodoContent], undefined>,
  'addTranslation' : ActorMethod<[string, Translation], undefined>,
  'addWeb3Card' : ActorMethod<[Web3Card], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'createCheckoutSession' : ActorMethod<
    [Array<ShoppingItem>, string, string],
    string
  >,
  'deleteContactMessage' : ActorMethod<[string], undefined>,
  'deleteProduct' : ActorMethod<[string], undefined>,
  'deleteRodoContent' : ActorMethod<[string], undefined>,
  'deleteTranslation' : ActorMethod<[string], undefined>,
  'deleteWeb3Card' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'getAllRodoContents' : ActorMethod<[], Array<RodoContent>>,
  'getAllTranslations' : ActorMethod<[], Array<Translation>>,
  'getCallerPrincipalAndAdminStatus' : ActorMethod<[], [Principal, boolean]>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getContactMessages' : ActorMethod<[], Array<ContactMessage>>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getProducts' : ActorMethod<[], Array<Product>>,
  'getRodoContent' : ActorMethod<[string], [] | [RodoContent]>,
  'getStripeSessionStatus' : ActorMethod<[string], StripeSessionStatus>,
  'getTranslation' : ActorMethod<[string], [] | [Translation]>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'getWeb3CardTranslationPreview' : ActorMethod<
    [Web3Card],
    Web3CardTranslation
  >,
  'getWeb3Cards' : ActorMethod<[], Array<Web3Card>>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'isStripeConfigured' : ActorMethod<[], boolean>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'setStripeConfiguration' : ActorMethod<[StripeConfiguration], undefined>,
  'submitContactMessage' : ActorMethod<
    [string, string, string, [] | [string], string],
    boolean
  >,
  'transform' : ActorMethod<[TransformationInput], TransformationOutput>,
  'updateProduct' : ActorMethod<[Product], undefined>,
  'updateRodoContent' : ActorMethod<[string, RodoContent], undefined>,
  'updateTranslation' : ActorMethod<[string, Translation], undefined>,
  'updateWeb3Card' : ActorMethod<[Web3Card], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
