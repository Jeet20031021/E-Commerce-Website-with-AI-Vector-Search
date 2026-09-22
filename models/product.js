import { client } from "../config/elasticdb.js";


async function createProductDB(){
    const index_name = 'products';
    try{
        if(!await client.indices.exists({index: index_name})){
        await client.indices.create({
            index: index_name, 
            mappings: {
                properties: {
                    product_name: {
                        type: 'text',
                        fields: {
                            keyword: {
                                type: 'keyword',
                                ignore_above: 256
                            },
                        }
                    },
                    description: {
                        type: 'text',
                    },
                    category: {
                        type: 'keyword',
                    },
                    price: {
                        type: 'double',
                    },
                    sellers_info: {
                        type: 'object',
                    },
                    in_stock: {
                        type: 'boolean',
                    },
                    quantity: {
                        type: 'integer',
                    },
                    description_vector: {
                        type: 'dense_vector',
                        similarity: 'cosine',
                        index: true,
                        dims: 768
                    }
                }
            }
        });

        console.log('Products db is created');
    }
    else{
        console.log('Products db is already created!');
    }
    }
    catch(err){
        console.log(`${err.message}`);
    }

}


export { createProductDB };