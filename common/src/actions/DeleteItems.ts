import ActionResponse from "../models/ActionResponse";
import DbProvider from "../models/database/DbProvider";
import BaseAction from "./BaseAction";

export default class DeleteItems extends BaseAction<string[]> {
    constructor(
        public dbProvider: DbProvider,
        public ids: string[],
    ) {
        super();
    }

    protected async runInternal(): Promise<ActionResponse<string[]>> {
        this.dbProvider.transaction(async (tx) => {
            for(const id of this.ids) {
                await tx.delete(this.dbProvider.doc(id, "items"));
            }
        });

        return ActionResponse.success(this.ids);
    }
}