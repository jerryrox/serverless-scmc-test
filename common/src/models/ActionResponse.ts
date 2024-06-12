export default class ActionResponse<T = any> {

    constructor(
        public isSuccess: boolean,
        public message: string,
        public error: any,
        public value?: T,
    ) {
    }

    static success<T>(value: T): ActionResponse<T> {
        return new ActionResponse<T>(true, "", null, value);
    }

    static fail<T>(message: string, error: any): ActionResponse<T> {
        return new ActionResponse<T>(false, message, error);
    }
}