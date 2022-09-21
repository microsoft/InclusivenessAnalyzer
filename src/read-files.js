const glob = require("glob");

const logger = require("./logger");
const params = require("./params");

const EXCLUSIONS = [".git", "node_modules"];

function getFilesFromDirectory(directoryPath) {

    var exclusions = EXCLUSIONS;

    // `exclude-from-scan` input defined in action metadata file
    const excludeFromScan = params.read('excludeFromScan');
    //const excludeFromScan = "**/*.ps1,**/*.mp4";
    if (excludeFromScan !== '') {
        exclusions = exclusions.concat(excludeFromScan.split(','));
        logger.info(`Excluding file patterns : ${exclusions}`);
    }

    logger.debug(`Base directory: ${directoryPath}`);
    
    var filesArray = glob.sync(`${directoryPath}/**/*`, { nodir: true, ignore: exclusions });

    //logger.debug(filesArray);
    return filesArray;
}

module.exports = getFilesFromDirectory;