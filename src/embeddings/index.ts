import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Property } from "../types/interfaces";

export const DEFAULT_SIMILARITY_SEARCH_K = 30
export class VectorStore extends MemoryVectorStore {
    constructor(config: {
        azure: {
            endpoint?: string;
            key?: string;
            version?: string;
            instance?: string;
        },
        embeddings: {
            model?: string;
            maxTokens?: number;
            vectordb_path?: string;
            collection_name?: string;
        };

    }) {
        if (!config.azure.endpoint || !config.azure.key || !config.azure.version) {
            throw new Error("Azure OpenAI configuration is incomplete. Please provide endpoint, key, and version.");
        }
        if (!config.embeddings.model) {
            throw new Error("Embedding model is not specified in the configuration.");
        }
        if (!config.embeddings.vectordb_path) {
            throw new Error("VectorDB path is not specified in the configuration.");
        }
        if (!config.embeddings.collection_name) {
            throw new Error("VectorDB collection name is not specified in the configuration.");
        }
        
        const embeddings = new AzureOpenAIEmbeddings({
            azureOpenAIApiKey: config.azure.key,         
            azureOpenAIApiVersion: config.azure.version,                 
            azureOpenAIApiDeploymentName: config.embeddings.model,
            azureOpenAIApiInstanceName: config.azure.instance
        });
        super(embeddings);
    }

    public async addProperties(properties: Property[]) {
        const documents = properties.map(property => ({
            id: property.propertyId,
            pageContent: property.description,
            metadata: { name: property.name }
        }));
        await this.addDocuments(documents);
    }

    public async searchProperties(query: string, k: number = DEFAULT_SIMILARITY_SEARCH_K): Promise<Property[]> {
        const results = await super.similaritySearch(query, k);
        return results.map(result => ({
            propertyId: result.id || "",
            description: result.pageContent || "",
            name: result.metadata.name || ""
        }));
    }
}
