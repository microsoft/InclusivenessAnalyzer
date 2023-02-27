const isBinaryFileSync = require('isbinaryfile').isBinaryFileSync;
const fs = require('fs');
const logger = require("./platform/logger");

const MAX_LINE_LENGTH = 1000;

function checkFileForTerms(file, expression, terms, maxLineLength) {
    if (isNaN(maxLineLength))
        maxLineLength = MAX_LINE_LENGTH
    var passed = true;

    // build the regular expression
    var regex = expression;
    var r = new RegExp(regex,"ig");

    if (!isBinaryFileSync(file)){
        var content = fs.readFileSync(file, 'utf-8').toString().split("\n");
        content.forEach((line, index) => {
            if (line.length > maxLineLength) {
                logger.warn(`Line ${index + 1} on ${file} is longer than the limit of ${MAX_LINE_LENGTH} characters, skipping.`);
            } else {
                var matches = line.matchAll(r);
                if(matches) {
                    passed = false;

                    for (const match of matches) {
                        var termFound = match[0].trim();
                        
                        // get alternatives (need to normalize the match to remove the spaces and aditional chars)
                        var termAlternatives = [];
                        var regexWhitespace = new RegExp('[\\s_-]', "gi");
                        var termFoundNormalized = termFound.replace(regexWhitespace, '').toLowerCase();
                        var termMatch = terms.find(term => term.term.replace(regexWhitespace, '') === termFoundNormalized);
                        if (termMatch) {
                            termAlternatives = termMatch.alternatives;
                        }

                        // add endColumn to logger?  match.index + termFound.length
                        logger.warn(`${file}\#L${index + 1} ${match.input.trim()}`, file, (index + 1).toString(), match.index.toString(), `Consider replacing term "${termFound}" with an alternative such as "${termAlternatives.join('", "')}"`);
                        logger.debug(`${file}\#L${index + 1} ${match.input.trim()}`);
                        // core.warning(`${file}\#L${index + 1}\r\n${match.input.trim()}`,{
                        //     file: file,
                        //     startLine: (index+1).toString(),
                        //     startColumn: match.index.toString(),
                        //     endColumn: (match.index + termFound.length).toString(),
                        //     title: `Consider replacing term "${termFound}" with an alternative such as "${termAlternatives.join('", "')}"` 
                        // });
                    }
                }
            }
        });
    }
    else
        // refactor to use logger
        logger.debug(`Skipping binary file: ${file}`)
    
    return passed;
}

module.exports = checkFileForTerms;