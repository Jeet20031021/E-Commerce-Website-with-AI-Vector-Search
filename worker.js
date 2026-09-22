import { Worker } from "bullmq";
import { connection } from "./config/queue.js";
import { insertProduct } from "./jobs/productCreate.js";


const worker = new Worker("product_index_queue", async (job) => {
    await insertProduct(
        job.data.productName,
        job.data.seller,
        job.data.image_url,
        job.data.category,
        job.data.description,
        job.data.price,
        job.data.quantity,
        job.data.stock,
    );
},{
    connection: connection,
    concurrency: 10,
});

worker.on('active', (job) => {
    console.log(`${job.id} is processing`);
});
worker.on('completed', (job) => {
    console.log(`${job.id} is completed successfully!`);
});

worker.on('failed', (job) => {
    console.log(`${job.id} is failed`);
});