import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    maxRetriesPerRequest: null,
});
const queue = new Queue(
    'product_index_queue',
    {
        connection: connection,
    }
);

export { connection, queue };