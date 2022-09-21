const core = require('@actions/core');
const github = require('@actions/github');

function read(name) {
    return core.getInput(name);
}

module.exports = { read };