import * as fs from 'fs';

export const parseFile = (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading file at ${filePath}: ${err.message}`);
            } else {
                let jsonData: any;
                try {
                    jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (parseError) {
                    reject(`Error parsing JSON from file at ${filePath}: ${parseError.message}`);
                }
            }
        });
    });
}

