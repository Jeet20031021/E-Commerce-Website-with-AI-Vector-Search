import { Redis } from "ioredis";
import "dotenv/config";

const redis = new Redis(processe.env.REDIS_URL);

export { redis };