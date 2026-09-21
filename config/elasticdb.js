import { Client } from "@elastic/elasticsearch";
import "dotenv/config";

const client = new Client({
    node: process.env.ELASTIC_DB_URL
});

export { client };