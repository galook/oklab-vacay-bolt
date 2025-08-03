import { VectorStore } from "./embeddings";
import { config } from "./config";

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
    await vectorStore.addDocuments([
        {
            id: "1",
            pageContent: "This is a sample document for embedding.",
            metadata: { category: "sample" },
        },
        {
            id: "2",
            pageContent: "Another document to test the vector store.",
            metadata: { category: "test" },
        },
    ]);
    console.log("Documents added to the vector store.");
    const results = await vectorStore.similaritySearch("embedding", 3);
    console.log("Similarity search results:", results);
}

main();
