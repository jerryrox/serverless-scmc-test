import { DbDocSnapshot } from "common";
import FirestoreDbDocument from "./FirestoreDbDocument";
import { DocumentSnapshot } from "firebase-admin/firestore";

export default class FirestoreDbDocSnapshot extends DbDocSnapshot {
    get exists(): boolean {
        return this.snapshot.exists;
    }

    get data(): any {
        return this.snapshot.data();
    }

    constructor(
        public readonly snapshot: DocumentSnapshot,
        public readonly document: FirestoreDbDocument,
    ) {
        super(document);
    }
}