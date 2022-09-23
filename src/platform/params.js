const core = require('@actions/core');

function read(name) {
    return core.getInput(name);
}

function readBoolean(name) {
    try {
        return core.getBooleanInput(name);
    }
    catch {
        return defaultValue;
    }
}

function getWorkingDirectory(){
    return process.env.GITHUB_WORKSPACE;
}

module.exports = { read, readBoolean, getWorkingDirectory };