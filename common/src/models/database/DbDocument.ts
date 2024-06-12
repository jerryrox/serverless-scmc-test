import DbDocSnapshot from "./DbDocSnapshot";

export default abstract class DbDocument {
    
    constructor(
        public readonly id: string,
        public readonly collection: string,
    ) {
    }

    abstract get(): Promise<DbDocSnapshot>;

    abstract set(data: any): Promise<void>;

    abstract update(data: any): Promise<void>;

    abstract delete(): Promise<void>;
}