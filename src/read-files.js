const fs = require('fs');
const path = require('path');

const EXCLUSIONS = [".git", "node_modules"];

function isExcluded(file) {
    var exclude = false;

    EXCLUSIONS.forEach(exclusion => {
        if (file.endsWith(exclusion))
            exclude = true;
    });

    return exclude;
}

function getFilesFromDirectory(directoryPath) {

    var filesArray = [];
    if (!isExcluded(directoryPath)) {
        const filesInDirectory = fs.readdirSync(directoryPath);

        filesInDirectory.map((file) => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                getFilesFromDirectory(filePath).map((rfile)=> { filesArray.push(rfile) });
            } else {
                // For testing purposes - avoids breaking the workflow
                if (!filePath.endsWith("data.json"))
                    filesArray.push(filePath);
            }
        })

    }

    return filesArray;
}

module.exports = getFilesFromDirectory;