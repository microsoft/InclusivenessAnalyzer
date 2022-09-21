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

    // check coherene of base directory
    coherentDirectoryPath = directoryPath.trim().replace(/\\/g,"/")
    if (coherentDirectoryPath.charAt(coherentDirectoryPath.length - 1) !== "/") {
        coherentDirectoryPath += "/"
    }
    logger.debug(`Base directory: ${coherentDirectoryPath}`);

    // get files
    var filesArray = glob.sync(`${coherentDirectoryPath}**/*`, { nodir: true, ignore: exclusions, absolute: true });

    // make all path relative
    var processPath = process.cwd().replace(/\\/g,"/");
    var regex = new RegExp(`^${processPath}/`,'')
    for (var i=0; i<filesArray.length; i++) {
        filesArray[i] = filesArray[i].replace(regex, "");
    }    
    
    return filesArray;
}

module.exports = getFilesFromDirectory;