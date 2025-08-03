import { VectorStore } from "./embeddings";
import { config } from "./config";
import { parseFile } from "./files/parser";

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



async function main() {
    // Verify the vector store is initialized correctly
    const propertyData = await parseFile(config.files.descriptions);
    if (!propertyData || propertyData.length === 0) {
        console.error("No properties found in the description file.");
        return;
    }
    console.log("Properties loaded:", propertyData.length);
    propertyData.forEach(property => {
        property.name = property.name || "Unknown" + Math.random().toString(36).substring(2, 5);
    });
    console.log("Properties adding to vector store...");
    // add properties 100 at a time
    if (propertyData.length > 100) {
        for (let i = 0; i < propertyData.length; i += 40000) {
            const batch = propertyData.slice(i, i + 100);
            await vectorStore.addProperties(batch);
            console.log(`Added batch ${Math.floor(i / 100) + 1} of ${Math.ceil(propertyData.length / 100)}`);
        }
    } else {
        await vectorStore.addProperties(propertyData);
        console.log("Added all properties to the vector store.");
    }
    console.log("Documents added to the vector store.");
    const results = await vectorStore.similaritySearch("big pool", 3);
    console.log("Similarity search results:", results);
}

main();
