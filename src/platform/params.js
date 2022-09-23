const core = require('@actions/core');
const github = require('@actions/github');

function read(name) {
    return core.getInput(name);
}

function readBoolean(name) {
    return core.getBooleanInput(name);
}

function getWorkingDirectory(){
    return process.env.GITHUB_WORKSPACE;
}

module.exports = { read, readBoolean, getWorkingDirectory };