const glob = require("glob");
var minimatch = require("minimatch")
const { REPL_MODE_STRICT } = require("repl");

const logger = require("./platform/logger");

const execSync = require("child_process").execSync;

function getFilesFromDirectory(directoryPath, exclusions) {

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

function getFilesFromLastCommit(exclusions) {
    var output = execSync('git log --format= --name-only --diff-filter=AM -n 1');
    var files = output.toString().trim().split("\n");
    var includedFiles = []
    files.forEach(filename => {
        var skip = false;
        exclusions.forEach(pattern => {
            if (minimatch(filename,pattern)) {
                skip = true;
                return;
            }
        });
        if (skip) 
            return;
        includedFiles.push(filename);
    });
    return includedFiles;
}

module.exports = { getFilesFromDirectory, getFilesFromLastCommit };