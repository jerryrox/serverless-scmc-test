import { onRequest } from "firebase-functions/v2/https";
import FirestoreDbProvider from "./extensions/models/database/FirestoreDbProvider";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { AddItem, DeleteItems, GetItems } from "common";

initializeApp({
    projectId: "scmc-test",
});

export const getItems = onRequest(async (request, response) => {
    const {
        name,
        offset,
        limit,
    } = request.query;

    const action = new GetItems(
        new FirestoreDbProvider(getFirestore()),
        {
            name: name === undefined ? undefined : name as string,
            offset: offset === undefined ? undefined : parseInt(offset as string),
            limit: limit === undefined ? undefined : parseInt(limit as string),
        }
    );
    const result = await action.run();

    response.send(JSON.stringify(result));
});

export const addItem = onRequest(async (request, response) => {
    const {
        name,
        price,
    } = request.body;

    const action = new AddItem(
        new FirestoreDbProvider(getFirestore()),
        {
            id: "",
            name: name as string,
            price: parseFloat(price as string),
            createdAt: new Date(),
        }
    );
    const result = await action.run();

    response.send(JSON.stringify({
        body: request.body,
        result,
    }));
});

export const deleteItems = onRequest(async (request, response) => {
    const {
        ids,
    } = request.body;

    const action = new DeleteItems(
        new FirestoreDbProvider(getFirestore()),
        ids as string[],
    );
    const result = await action.run();

    response.send(JSON.stringify(result));
});