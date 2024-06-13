import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { AddItem } from "common";
import CosmosDbProvider from "../extensions/models/database/CosmosDbProvider";

export async function addItem(request: HttpRequest): Promise<HttpResponseInit> {
    const body = await request.formData();
    const name = body.get("name").toString();
    const price = body.get("price").toString();

    const action = new AddItem(
        new CosmosDbProvider(),
        {
            id: "",
            name,
            price: price ? parseFloat(price) : undefined,
            createdAt: new Date(),
        }
    );
    const result = await action.run();

    return { jsonBody: result };
}

app.http("addItem", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: addItem,
});
