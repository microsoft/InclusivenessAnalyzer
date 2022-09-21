const isBinaryFileSync = require('isbinaryfile').isBinaryFileSync;
const fs = require('fs');
const core = require('@actions/core');

function checkFileForTerms(file, expression, terms) {
    var passed = true;

    // build the regular expression
    var regex = expression;
    var r = new RegExp(regex,"ig");

    if (!isBinaryFileSync(file)){
        var content = fs.readFileSync(file, 'utf-8').toString().split("\n");
        content.forEach((line, index) => {
            var matches = line.matchAll(r);
            if(matches) {
                passed = false;

                for (const match of matches) {
                    // get alternatives (need to normalize the match to remove the spaces and aditional chars)
                    var alternatives = '';
                    const re = /\w+/g;
                    var normalized = match[0].match(re);
                    var details = terms.filter(term => term.term === normalized.join('').trim().toLowerCase());
                    if (details){
                        alternatives = details[0].alternatives.join(', ');
                    }

                    // refactor to use logger
                    core.warning(`[Line ${index+1}] ${match.input}`,{
                        file: file,
                        startLine: (index+1).toString(),
                        startColumn: match.index.toString(),
                        endColumn: match.index + match[0].length,
                        title: `Found the term '${match[0].trim()}', consider using alternatives: ${alternatives}` });
                }
            }
        });
    }
    else
        // refactor to use logger
        core.debug(`Skipping binary file: ${file}`)
    
    return passed;
}

module.exports = checkFileForTerms;