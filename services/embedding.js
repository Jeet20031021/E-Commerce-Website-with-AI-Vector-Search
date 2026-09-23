import { gemini } from "../config/gemini.js";
import "dotenv/config";

async function embedding(query){
    const embed = await gemini.models.embedContent({
        model: 'gemini-embedding-2',
        contents: query,
        config: {
            outputDimensionality: 768,
        }
    });
    return embed.embeddings[0].values;
}

export { embedding };