import { Container, Database } from "@azure/cosmos";
import { DbDocSnapshot, DbQuery, DbWhereType } from "common";
import CosmosDbDocSnapshot from "./CosmosDbDocSnapshot";
import CosmosDbDocument from "./CosmosDbDocument";

interface IWhere {
    field: string;
    qualifier: string;
    value: any;
}

// Such a bad wrapper but it's a demo. Whatever 🤷‍♂️
export default class CosmosDbQuery extends DbQuery {
    readonly container: Container;
    readonly wheres: IWhere[] = [];
    order: {
        field: string;
        descending: boolean;
    } | undefined;
    pagination: {
        limit?: number;
        offset?: number;
    } = {};

    constructor(
        public readonly database: Database,
        container: string,
    ) {
        super(container);
        this.container = database.container(container);
    }

    where(field: string, type: DbWhereType, value: any): DbQuery {
        this.wheres.push({
            field: `${this.container.id}.${field}`,
            qualifier: this.getQualifier(type),
            value: typeof (value) === "string" ? `"${value}"` : value,
        });
        return this;
    }

    orderBy(field: string, descending: boolean): DbQuery {
        this.order = {
            field: `${this.container.id}.${field}`,
            descending,
        };
        return this;
    }

    limit(limit: number): DbQuery {
        this.pagination.limit = limit;
        return this;
    }

    offset(offset: number): DbQuery {
        this.pagination.offset = offset;
        return this;
    }

    async get(): Promise<DbDocSnapshot[]> {
        const response = await this.container.items.query({
            query: this.buildSql(),
        }).fetchAll();
        return response.resources.map((d) => {
            const doc = new CosmosDbDocument(
                this.database,
                d.id,
                this.container.id,
            );
            return new CosmosDbDocSnapshot(
                {
                    item: this.container.item(d.id),
                    resource: d,
                    statusCode: 200,
                } as any,
                doc,
            );
        });
    }

    private buildSql() {
        let sql = `SELECT * FROM ${this.container.id}`;
        if (this.wheres.length) {
            sql += ` WHERE ${this.wheres.map((w) => `${w.field} ${w.qualifier} ${w.value}`).join(" AND ")}`;
        }
        if (this.order) {
            sql += ` ORDER BY ${this.order.field} ${this.order.descending ? "DESC" : "ASC"}`;
        }
        if (this.pagination.limit) {
            sql += ` LIMIT ${this.pagination.limit}`;
        }
        if (this.pagination.offset) {
            sql += ` OFFSET ${this.pagination.offset}`;
        }
        return sql;
    }

    private getQualifier(type: DbWhereType): string {
        switch (type) {
            case "==":
                return "=";
            case "<":
                return "<";
            case "<=":
                return "<=";
            case ">":
                return ">";
            case ">=":
                return ">=";
            case "!=":
                return "!=";
        }
    }
}