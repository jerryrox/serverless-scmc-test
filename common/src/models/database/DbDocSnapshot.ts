import { ModelConverter } from "jrx-ts";
import DbDocument from "./DbDocument";

export default abstract class DbDocSnapshot {
    get id(): string {
        return this.document.id;
    }

    abstract get exists(): boolean;

    abstract get data(): any;
    
    constructor(
        public readonly document: DbDocument,
    ) {
    }

    convert<T extends Object>(converter: ModelConverter<T>): T {
        return converter.toModel(this.id, this.data);
    }
}