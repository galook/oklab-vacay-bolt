import { VectorStore } from "./embeddings";
import { config } from "./config";
import { parseFile } from "./files/parser";
import { Property } from "./types/interfaces";

const vectorStore = new VectorStore({
    azure: {
        endpoint: config.azure.endpoint,
        key: config.azure.key,
        version: config.azure.version,
        instance: config.azure.instance,
    },
    embeddings: {
        model: config.embeddings.model,
        maxTokens: config.embeddings.maxTokens,
        vectordb_path: config.embeddings.vectordb_path,
        collection_name: config.embeddings.collection_name,
    },
});

const addPropertiesToVectorStoreByBatches = async (properties: Property[], batchSize: number) => {
    // add properties 100 at a time
    if (properties.length > batchSize) {
        for (let i = 0; i < properties.length; i += batchSize) {
            const batch = properties.slice(i, i + batchSize);
            await vectorStore.addProperties(batch);
            console.log(`Added batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(properties.length / 100)}`);
        }
    } else {
        await vectorStore.addProperties(properties);
        console.log("Added all properties to the vector store.");
    }
}

/**
 * Checks whether vectorstore works as expected
 * @returns void
 */
const main = async (): Promise<void> => {
    const propertyData = await parseFile(config.files.descriptions);
    if (!propertyData || propertyData.length === 0) {
        console.error("No properties found in the description file.");
        return;
    }
    console.log("Properties loaded:", propertyData.length);
    // Ensure each property has a name, if not, assign a default name
    propertyData.forEach((property: any) => {
        property.name = property.name || "Unknown" + Math.random().toString(36).substring(2, 5);
    });

    console.log("Properties adding to vector store...");
    await addPropertiesToVectorStoreByBatches(propertyData, config.embeddings.propertiesAmountPerBatch);
    console.log("Documents added to the vector store.");

    const results = await vectorStore.similaritySearch("big pool");
    console.log("Similarity search results:", results);
}



main();
