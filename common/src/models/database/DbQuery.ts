import DbDocSnapshot from "./DbDocSnapshot";
import DbWhereType from "./DbWhereType";

export default abstract class DbQuery {
    constructor(
        public readonly collection: string,
    ) {
    }
    
    abstract where(field: string, type: DbWhereType, value: any): DbQuery;

    abstract orderBy(field: string, descending: boolean): DbQuery;

    abstract limit(limit: number): DbQuery;

    abstract offset(offset: number): DbQuery;

    abstract get(): Promise<DbDocSnapshot[]>;
}