import { gemini } from "../config/gemini.js";
import { client } from "../config/elasticdb.js";


const index_name = 'product';
async function embeddingDescription(description){
    const vector = await gemini.models.embedContent({
        model: 'gemini-embedding-2',
        contents: description,
        config: {
            outputDimensionality: 768,
        }
    });

    return vector.embeddings[0].values;
}


async function insertProduct(product_name, seller, image, category, description, price, quantity, stock){
    const vector = await embeddingDescription(description);
    const product = await client.index({
        index: index_name,
        document: {
            product_name: product_name,
            category: category,
            price: price,
            quantity: quantity,
            seller_info: {
                'seller_email': seller,
            },
            description: description,
            in_stock: stock,
            product_image: image,
            description_vector: vector,
        }
    });
    return product._id;
}

export { insertProduct };
