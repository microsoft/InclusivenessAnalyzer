const fs = require('fs');
const core = require('@actions/core');

function buildTermsRegex(terms){
    var termsArray = terms.map(term => term.regex ?? term.term);

    return termsArray.join('|');
    //return "white\\s?list|blacklist|[^a-z]he[^a-z]";
};

function checkFileForTerms(file, terms) {
    var pass = true;

    // build the regular expression
    var regex = buildTermsRegex(terms);
    var r = new RegExp(regex,"ig");

    var content = fs.readFileSync(file, 'utf-8').toString().split("\n");
    content.forEach((line, index) => {
        var matches = line.matchAll(r);
        if(matches) {
            for (const match of matches) {
                // get alternatives
                var alternatives = '';
                var details = terms.filter(term => term.term.localeCompare(match[0].trim(), undefined, { sensitivity: 'accent' }));
                console.log( match[0]);
                if (details){
                    alternatives = details[0].alternatives.join(', ');
                }

                core.warning(`[Line ${index+1}] ${match.input}`,{
                    file: file,
                    startLine: (index+1).toString(),
                    startColumn: match.index.toString(),
                    endColumn: match.index + match[0].length,
                    title: `Found the term '${match[0].trim()}', consider using alternatives: ${alternatives}` });
            }
        }
    });
    
    return pass;
}

module.exports = checkFileForTerms;