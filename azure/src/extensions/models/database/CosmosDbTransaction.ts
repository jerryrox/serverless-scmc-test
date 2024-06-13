import { DbDocSnapshot, DbDocument, DbTransaction } from "common";
import { Container, OperationInput } from "@azure/cosmos";
import CosmosDbDocument from "./CosmosDbDocument";

class BatchGroup {
    readonly operations: OperationInput[] = [];

    constructor(
        public readonly container: Container,
    ) {
    }
}

export default class CosmosDbTransaction extends DbTransaction {
    readonly batchGroups: Record<string, BatchGroup> = {};

    constructor() {
        super();
    }

    async commit(): Promise<void> {

    }

    async abort(): Promise<void> {
    }

    get(document: DbDocument): Promise<DbDocSnapshot> {
        return document.get();
    }

    async set(document: DbDocument, data: any): Promise<void> {
        const doc = document as CosmosDbDocument;
        const group = this.getBatchGroup(doc.item.container);
        group.operations.push({
            operationType: "Upsert",
            resourceBody: data,
        });
    }

    async update(document: DbDocument, data: any): Promise<void> {
        const doc = document as CosmosDbDocument;
        const group = this.getBatchGroup(doc.item.container);
        group.operations.push({
            id: document.id,
            operationType: "Replace",
            resourceBody: data,
        });
    }

    async delete(document: DbDocument): Promise<void> {
        const doc = document as CosmosDbDocument;
        const group = this.getBatchGroup(doc.item.container);
        group.operations.push({
            id: document.id,
            operationType: "Delete",
        });
    }

    private getBatchGroup(container: Container): BatchGroup {
        const containerId = container.id;
        let batchGroup = this.batchGroups[containerId];
        if (batchGroup === undefined) {
            batchGroup = new BatchGroup(container);
            this.batchGroups[containerId] = batchGroup;
        }
        return batchGroup;
    }
}