import ActionResponse from "../models/ActionResponse";

export default abstract class BaseAction<T = any> {
    
    async run(): Promise<ActionResponse<T>> {
        try {
            return await this.runInternal();
        }
        catch (e: any) {
            console.error(e);
            return ActionResponse.fail<T>(`An error occurred while running the action: ${e}`, e);
        }
    }

    protected abstract runInternal(): Promise<ActionResponse<T>>;
}