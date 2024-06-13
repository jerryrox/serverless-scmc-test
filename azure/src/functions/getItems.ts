import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { GetItems } from "common";
import CosmosDbProvider from "../extensions/models/database/CosmosDbProvider";

export async function getItems(request: HttpRequest): Promise<HttpResponseInit> {
    const name = request.query.get("name");
    const offset = request.query.get("offset");
    const limit = request.query.get("limit");

    const action = new GetItems(
        new CosmosDbProvider(),
        {
            name,
            offset: offset ? parseInt(offset) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        }
    );
    const response = await action.run();

    return { jsonBody: response };
}

app.http("getItems", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: getItems,
});
