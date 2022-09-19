const core = require('@actions/core');
const github = require('@actions/github');
const glob = require("glob")

const EXCLUSIONS = [".git", "node_modules"];

function getFilesFromDirectory(directoryPath) {

    // `exclude-from-scan` input defined in action metadata file
    const excludeFromScan = core.getInput('exclude-from-scan');
    //const excludeFromScan = "**/*.ps1,**/*.mp4";
    core.debug(`Excluding file patterns : ${excludeFromScan}`);
    
    var exclusions = EXCLUSIONS.concat(excludeFromScan.split(','));
    core.debug(directoryPath);
    
    var filesArray = glob.sync(`${directoryPath}/**/*`, { "nodir": true, "ignore": exclusions });

    core.debug(filesArray);
    return filesArray;
}

module.exports = getFilesFromDirectory;