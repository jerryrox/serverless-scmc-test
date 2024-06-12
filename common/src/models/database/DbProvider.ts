import { ModelConverter } from "jrx-ts";
import DbDocument from "./DbDocument";
import DbQuery from "./DbQuery";
import DbTransaction from "./DbTransaction";

export default abstract class DbProvider {

    abstract doc(id: string, collection: string): DbDocument;

    abstract query(collection: string): DbQuery;

    abstract transaction(handler: ((tx: DbTransaction) => Promise<void>)): Promise<void>;

    adjustConverter<T extends ModelConverter<any>>(converter: T): T {
        // Override this method to adjust some functions within the converter.
        return converter;
    }
}