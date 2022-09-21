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
                    var termFound = match[0].trim();
                    // get alternatives (need to normalize the match to remove the spaces and aditional chars)
                    var termAlternatives = [];
                    //const re = /\w+/g;
                    //var normalized = match[0].match(re);
                    //var details = terms.filter(term => term.term === normalized.join('').trim().toLowerCase());
                    var regexWhitespace = new RegExp('[\\s _-]', "gi");
                    var termFoundNormalized = termFound.replace(regexWhitespace, '').toLowerCase();
                    var termMatch = terms.find(term => term.term.replace(regexWhitespace, '') === termFoundNormalized);
                    if (termMatch) {
                        termAlternatives = termMatch.alternatives;
                    }

                    // refactor to use logger
                    core.warning(`${file}\#L${index+1}\r\n${match.input.trim()}`,{
                        file: file,
                        startLine: (index+1).toString(),
                        startColumn: match.index.toString(),
                        endColumn: (match.index + termFound.length).toString(),
                        title: `Consider replacing term "${termFound}" with an alternative such as "${termAlternatives.join('", "')}"` });
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