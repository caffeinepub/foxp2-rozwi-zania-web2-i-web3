import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
}
export interface Web3CardTranslation {
    de: Web3Card;
    en: Web3Card;
    pl: Web3Card;
}
export interface Translation {
    de: string;
    en: string;
    pl: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface Web3Card {
    id: string;
    title: string;
    imagePath: string;
    link: string;
    buttonTitle: string;
    description: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface RodoContent {
    de: string;
    en: string;
    pl: string;
}
export interface ContactMessage {
    email: string;
    message: string;
    timestamp: bigint;
    phone?: string;
    lastName: string;
    firstName: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addRodoContent(key: string, content: RodoContent): Promise<void>;
    addTranslation(key: string, translation: Translation): Promise<void>;
    addWeb3Card(card: Web3Card): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteContactMessage(messageId: string): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    deleteRodoContent(key: string): Promise<void>;
    deleteTranslation(key: string): Promise<void>;
    deleteWeb3Card(cardId: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    getAllRodoContents(): Promise<Array<RodoContent>>;
    getAllTranslations(): Promise<Array<Translation>>;
    getCallerPrincipalAndAdminStatus(): Promise<[Principal, boolean]>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getFileReference(path: string): Promise<FileReference>;
    getProducts(): Promise<Array<Product>>;
    getRodoContent(key: string): Promise<RodoContent | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTranslation(key: string): Promise<Translation | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeb3CardTranslationPreview(card: Web3Card): Promise<Web3CardTranslation>;
    getWeb3Cards(): Promise<Array<Web3Card>>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerFileReference(path: string, hash: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactMessage(firstName: string, lastName: string, email: string, phone: string | null, message: string): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateProduct(product: Product): Promise<void>;
    updateRodoContent(key: string, content: RodoContent): Promise<void>;
    updateTranslation(key: string, translation: Translation): Promise<void>;
    updateWeb3Card(card: Web3Card): Promise<void>;
}