import { Firestore, Timestamp } from "firebase-admin/firestore";
import FirestoreDbQuery from "./FirestoreDbQuery";
import FirestoreDbDocument from "./FirestoreDbDocument";
import { ModelConverter } from "jrx-ts";
import FirestoreDbTransaction from "./FirestoreDbTransaction";
import { DbDocument, DbProvider, DbQuery, DbTransaction } from "common";

export default class FirestoreDbProvider extends DbProvider {
    readonly firestore: Firestore;

    constructor(firestore: Firestore) {
        super();
        this.firestore = firestore;
    }

    doc(id: string, collection: string): DbDocument {
        return new FirestoreDbDocument(this.firestore, id, collection);
    }

    query(collection: string): DbQuery {
        return new FirestoreDbQuery(this.firestore, collection);
    }

    async transaction(handler: (tx: DbTransaction) => Promise<void>): Promise<void> {
        await this.firestore.runTransaction(async (tx) => {
            const transaction = new FirestoreDbTransaction(tx);
            await handler(transaction);
        });
    }

    adjustConverter<T extends ModelConverter<any>>(converter: T): T {
        converter.encodeDate = (date: Date) => {
            return Timestamp.fromDate(date);
        };

        const originalDecodeDate = converter.decodeDate;
        converter.decodeDate = (date: any) => {
            if (date instanceof Timestamp) {
                return date.toDate();
            }
            return originalDecodeDate(date);
        };

        return converter;
    }
}