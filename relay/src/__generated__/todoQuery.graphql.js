/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type todoQueryVariables = {|
  id: string
|};
export type todoQueryResponse = {|
  +todo: {|
    +id: ?string,
    +title: ?string,
    +body: ?string,
    +isCompleted: ?boolean,
  |}
|};
export type todoQuery = {|
  variables: todoQueryVariables,
  response: todoQueryResponse,
|};
*/


/*
query todoQuery(
  $id: ID!
) {
  todo(id: $id) {
    id
    title
    body
    isCompleted
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Todo",
    "kind": "LinkedField",
    "name": "todo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "body",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isCompleted",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "todoQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "todoQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "938610947fe11c1eb69d9a24fd3b8489",
    "id": null,
    "metadata": {},
    "name": "todoQuery",
    "operationKind": "query",
    "text": "query todoQuery(\n  $id: ID!\n) {\n  todo(id: $id) {\n    id\n    title\n    body\n    isCompleted\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7aea0923fb90164c608e62d960869b65';

module.exports = node;
