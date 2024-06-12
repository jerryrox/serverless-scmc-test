import ActionResponse from "../models/ActionResponse";
import IItem from "../models/IItem";
import ItemConverter from "../models/ItemConverter";
import DbProvider from "../models/database/DbProvider";
import BaseAction from "./BaseAction";
import { v4 } from "uuid";

export default class AddItem extends BaseAction<IItem> {
    constructor(
        public dbProvider: DbProvider,
        public item: IItem,
    ) {
        super();
    }

    protected async runInternal(): Promise<ActionResponse<IItem>> {
        const converter = this.dbProvider.adjustConverter(new ItemConverter());

        const doc = this.dbProvider.doc(v4(), "items");
        await doc.set(converter.toPlain(this.item));

        return ActionResponse.success(this.item);
    }
}