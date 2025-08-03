import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { version } from "os";

const DEFAULT_SIMILARITY_SEARCH_K = 30
export class VectorStore extends MemoryVectorStore {
    constructor(config: {
        azure: {
            endpoint?: string;
            key?: string;
            version?: string;
            instance?: string; // Optional, for Azure OpenAI instance name
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
}
