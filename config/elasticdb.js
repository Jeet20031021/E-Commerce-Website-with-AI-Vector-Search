import { Client } from "@elastic/elasticsearch";
import "dotenv/config";

const cilent = new Client(process.env.ELASTIC_DB_URL);

export { cilent };