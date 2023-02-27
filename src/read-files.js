const { exec } = require("child_process");
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

function getFilesFromLastCommit(directoryPath, exclusions) {
    // get current git branch
    var branch = execSync('git branch --show-current').toString().trim();
    logger.debug(`git branch: ${branch}`);
    if (branch === ""){
        logger.debug("Branch is empty, returning all files in path");
        return getFilesFromDirectory(directoryPath, exclusions)
    }
    var commit = execSync('git log -1 --format=%H').toString().trim();
    logger.debug(`git commit: ${commit}`);
    var fetch = execSync(`git fetch -q --no-tags --no-recurse-submodules --depth=2 origin +${commit}:refs/remotes/origin/${branch}`);
    logger.debug(`git fetch: +${commit}:refs/remotes/origin/${branch}\n${fetch.toString().trim()}`);
    var output = execSync('git show --format= --name-only --diff-filter=d');
    logger.debug(`git show: \n${output.toString().trim()}`);
    var outputstring = output.toString().trim()
    var includedFiles = []
    if (outputstring) {
        var files = outputstring.split("\n");
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
    }
    return includedFiles;
}

module.exports = { getFilesFromDirectory, getFilesFromLastCommit };
