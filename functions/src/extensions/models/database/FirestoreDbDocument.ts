import { DocumentReference, Firestore } from "firebase-admin/firestore";
import FirestoreDbDocSnapshot from "./FirestoreDbDocSnapshot";
import { DbDocSnapshot, DbDocument } from "common";

export default class FirestoreDbDocument extends DbDocument {
    readonly document: DocumentReference;
    
    constructor(
        public readonly firestore: Firestore,
        id: string,
        collection: string,
    ) {
        super(id, collection);
        this.document = this.firestore.doc(`${collection}/${id}`);
    }

    async get(): Promise<DbDocSnapshot> {
        const snapshot = await this.document.get();
        return new FirestoreDbDocSnapshot(
            snapshot,
            this,
        );
    }

    async set(data: any): Promise<void> {
        await this.document.set(data);
    }

    async update(data: any): Promise<void> {
        await this.document.update(data);
    }

    async delete(): Promise<void> {
        await this.document.delete();
    }
}