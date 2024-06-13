import { DbDocSnapshot } from "common";
import CosmosDbDocument from "./CosmosDbDocument";
import { ItemResponse } from "@azure/cosmos";

export default class CosmosDbDocSnapshot extends DbDocSnapshot {
    get exists(): boolean {
        return this.itemResponse.statusCode === 200;
    }

    get data(): any {
        return this.itemResponse.resource;
    }

    constructor(
        public readonly itemResponse: ItemResponse<any>,
        public readonly document: CosmosDbDocument,
    ) {
        super(document);
    }
}