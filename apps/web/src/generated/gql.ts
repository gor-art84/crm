/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query Hello {\n        hello\n    }\n": typeof types.HelloDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n        id\n        email\n        role\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n": typeof types.MeDocument,
    "\n  query GetUsers {\n    users {\n      id\n      email\n      firstName\n      middleName\n      lastName\n      role\n      isActive\n    }\n  }\n": typeof types.GetUsersDocument,
};
const documents: Documents = {
    "\n    query Hello {\n        hello\n    }\n": types.HelloDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n        id\n        email\n        role\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n": types.MeDocument,
    "\n  query GetUsers {\n    users {\n      id\n      email\n      firstName\n      middleName\n      lastName\n      role\n      isActive\n    }\n  }\n": types.GetUsersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Hello {\n        hello\n    }\n"): (typeof documents)["\n    query Hello {\n        hello\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n        id\n        email\n        role\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n        id\n        email\n        role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUsers {\n    users {\n      id\n      email\n      firstName\n      middleName\n      lastName\n      role\n      isActive\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      email\n      firstName\n      middleName\n      lastName\n      role\n      isActive\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;