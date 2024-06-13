import { Database, Item } from "@azure/cosmos";
import { DbDocSnapshot, DbDocument } from "common";
import CosmosDbDocSnapshot from "./CosmosDbDocSnapshot";

export default class CosmosDbDocument extends DbDocument {
    readonly item: Item;

    constructor(
        public readonly db: Database,
        id: string,
        collection: string,
    ) {
        super(id, collection);
        this.item = db.container(collection).item(id);
    }

    async get(): Promise<DbDocSnapshot> {
        const response = await this.item.read();
        return new CosmosDbDocSnapshot(
            response,
            this,
        );
    }

    async set(data: any): Promise<void> {
        await this.item.container.items.upsert(data);
    }

    async update(data: any): Promise<void> {
        await this.item.replace(data);
    }

    async delete(): Promise<void> {
        await this.item.delete();
    }
}