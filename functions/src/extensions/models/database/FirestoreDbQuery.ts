import { Firestore, Query } from "firebase-admin/firestore";
import FirestoreDbDocSnapshot from "./FirestoreDbDocSnapshot";
import FirestoreDbDocument from "./FirestoreDbDocument";
import { DbDocSnapshot, DbQuery, DbWhereType } from "common";

export default class FirestoreDbQuery extends DbQuery {
    query: Query;

    constructor(
        public readonly firestore: Firestore,
        collection: string,
    ) {
        super(collection);
        this.query = firestore.collection(collection);
    }

    where(field: string, type: DbWhereType, value: any): DbQuery {
        this.query = this.query.where(field, type, value);
        return this;
    }

    orderBy(field: string, descending: boolean): DbQuery {
        this.query = this.query.orderBy(field, descending ? "desc" : "asc");
        return this;
    }

    limit(limit: number): DbQuery {
        this.query = this.query.limit(limit);
        return this;
    }

    offset(offset: number): DbQuery {
        this.query = this.query.offset(offset);
        return this;
    }

    async get(): Promise<DbDocSnapshot[]> {
        const querySnapshot = await this.query.get();
        return querySnapshot.docs.map((doc) => new FirestoreDbDocSnapshot(
            doc,
            new FirestoreDbDocument(
                this.firestore,
                doc.id,
                this.collection,
            ),
        ));
    }
}