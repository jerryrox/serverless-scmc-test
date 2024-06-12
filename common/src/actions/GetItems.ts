import ActionResponse from "../models/ActionResponse";
import IItem from "../models/IItem";
import ItemConverter from "../models/ItemConverter";
import DbProvider from "../models/database/DbProvider";
import BaseAction from "./BaseAction";

export default class GetItems extends BaseAction<IItem[]> {
    constructor(
        public dbProvider: DbProvider,
        public options?: {
            name?: string;
            offset?: number;
            limit?: number;
        },
    ) {
        super();
    }

    protected async runInternal(): Promise<ActionResponse<IItem[]>> {
        let query = this.dbProvider.query("items");
        if (this.options?.name !== undefined) {
            query = query.where("name", "==", this.options.name);
        }
        if (this.options?.offset !== undefined) {
            query = query.offset(this.options.offset);
        }
        if (this.options?.limit !== undefined) {
            query = query.limit(this.options.limit);
        }
        const docs = await query.get();

        const converter = this.dbProvider.adjustConverter(new ItemConverter());
        
        return ActionResponse.success(docs.map(doc => doc.convert(converter)));
    }
}