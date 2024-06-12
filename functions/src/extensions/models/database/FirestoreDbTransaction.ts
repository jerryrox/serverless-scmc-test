import { Transaction } from "firebase-admin/firestore";
import FirestoreDbDocument from "./FirestoreDbDocument";
import FirestoreDbDocSnapshot from "./FirestoreDbDocSnapshot";
import { DbDocSnapshot, DbDocument, DbTransaction } from "common";

export default class FirestoreDbTransaction extends DbTransaction {
    constructor(
        public tx: Transaction,
    ) {
        super();
    }

    async commit(): Promise<void> {}

    async abort(): Promise<void> {}

    async get(document: DbDocument): Promise<DbDocSnapshot> {
        const doc = document as FirestoreDbDocument;
        const snapshot = await this.tx.get(doc.document);
        return new FirestoreDbDocSnapshot(
            snapshot,
            doc,
        );
    }

    async set(document: DbDocument, data: any): Promise<void> {
        const doc = document as FirestoreDbDocument;
        this.tx.set(doc.document, data);
    }

    async update(document: DbDocument, data: any): Promise<void> {
        const doc = document as FirestoreDbDocument;
        this.tx.update(doc.document, data);
    }

    async delete(document: DbDocument): Promise<void> {
        const doc = document as FirestoreDbDocument;
        this.tx.delete(doc.document);
    }
}