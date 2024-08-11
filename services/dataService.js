const path = require("path");
const fs = require("fs");
const dataFile = path.join(__dirname, "data.json");

const readData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFile, "utf-8", (error, data) => {
            if (error) {
                reject(error);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (data) {
                    reject(data);
                }
            }
        });
    });
};

const writeData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFile, JSON.stringify(data, null, 4), "utf-8", (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

module.exports = { readData, writeData };