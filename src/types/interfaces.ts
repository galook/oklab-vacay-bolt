export interface Property {
    name: string;
    propertyId: string;
    description: string;
}

export interface Config {
    env: string;
    port: number | string;
    embeddings: {
        model: string;
        maxTokens: number;
        vectordb_path: string;
        collection_name: string;
        propertiesAmountPerBatch: number;
    };
    azure: {
        endpoint?: string;
        key?: string;
        version?: string;
        instance?: string;
    };
    files: {
        descriptions: string;
    };
}