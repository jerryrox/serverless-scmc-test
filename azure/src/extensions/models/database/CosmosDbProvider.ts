import { CosmosClient, Database } from "@azure/cosmos";
import { DbDocument, DbProvider, DbQuery, DbTransaction } from "common";
import { config } from "dotenv";
import CosmosDbTransaction from "./CosmosDbTransaction";
import CosmosDbQuery from "./CosmosDbQuery";
import CosmosDbDocument from "./CosmosDbDocument";

config();

const cosmosUri = process.env.COSMOS_URI;
const cosmosKey = process.env.COSMOS_KEY;

const client = new CosmosClient({
    endpoint: cosmosUri,
    key: cosmosKey,
});

export default class CosmosDbProvider extends DbProvider {
    readonly database: Database;

    private didInit = false;

    constructor() {
        super();
        this.database = client.database("scmc-test");
    }

    doc(id: string, collection: string): DbDocument {
        return new CosmosDbDocument(this.database, id, collection);
    }

    query(collection: string): DbQuery {
        return new CosmosDbQuery(this.database, collection);
    }

    async transaction(handler: (tx: DbTransaction) => Promise<void>): Promise<void> {
        await handler(new CosmosDbTransaction());
    }
}