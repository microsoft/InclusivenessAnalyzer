const core = require('@actions/core');
const github = require('@actions/github');

function info(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.notice(message);
    else
        core.notice(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function warn(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.warning(message);
    else
        core.warning(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function debug(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.debug(message);
    else
        core.debug(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function error(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.error(message);
    else
        core.error(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function fail(message) {
    core.setFailed(message);
}

module.exports = { info, warn, debug, fail };