import DbDocSnapshot from "./DbDocSnapshot";
import DbDocument from "./DbDocument";

export default abstract class DbTransaction {

    abstract commit(): Promise<void>;

    abstract abort(): Promise<void>;

    abstract get(document: DbDocument): Promise<DbDocSnapshot>;

    abstract set(document: DbDocument, data: any): Promise<void>;

    abstract update(document: DbDocument, data: any): Promise<void>;

    abstract delete(document: DbDocument): Promise<void>;
}