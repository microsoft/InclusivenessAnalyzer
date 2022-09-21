const glob = require("glob");

const logger = require("./logger");
const params = require("./params");

const EXCLUSIONS = [".git", "node_modules"];

function getFilesFromDirectory(directoryPath) {

    // `exclude-from-scan` input defined in action metadata file
    const excludeFromScan = params.read('excludeFromScan');
    //const excludeFromScan = "**/*.ps1,**/*.mp4";
    logger.info(`Excluding file patterns : ${excludeFromScan}`);
    
    var exclusions = EXCLUSIONS.concat(excludeFromScan.split(','));
    logger.debug(directoryPath);
    
    var filesArray = glob.sync(`${directoryPath}/**/*`, { "nodir": true, "ignore": exclusions });

    //logger.debug(filesArray);
    return filesArray;
}

module.exports = getFilesFromDirectory;