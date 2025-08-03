import dotenv from 'dotenv';
import { Config } from '../types/interfaces';

dotenv.config();

export const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    embeddings: {
        model: process.env.EMBEDDING_MODEL || 'text-embedding-3-large',
        vectordb_path: process.env.VECTORDB_PATH || './chroma_db',
        collection_name: process.env.VECTORDB_COLLECTION_NAME || 'oklab_vacay_bolt',
        maxTokens: parseInt(process.env.EMBEDDING_MAX_TOKENS || '8192', 10),
        propertiesAmountPerBatch: parseInt(process.env.PROPERTIES_AMOUNT_PER_BATCH || '100', 10),
    },
    azure: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        key: process.env.AZURE_OPENAI_API_KEY,
        version: process.env.OPENAI_API_VERSION,
        instance: process.env.AZURE_OPENAI_INSTANCE
    },
    files: {
        descriptions: process.env.DESCRIPTION_FILE || './data/description.json',
    }
}



