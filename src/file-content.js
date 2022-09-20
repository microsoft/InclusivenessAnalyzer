const fs = require('fs');

function checkFileForPhrase(file, phrase) {
    // if the phrase is small (<5 chars) don't match it inside other words
    var term = phrase
    if (term.length < 5)
        term = `[^a-z]${term}[^a-z]`;
    // build the regular expression
    var r = new RegExp(term,"ig");

    var lines = [];
    var content = fs.readFileSync(file, 'utf-8').toString().split("\n");
    content.forEach((line, index) => {
        if(line.match(r)) {
            var match = {
                file: file,
                number: index+1,
                content: line
            }
            lines.push(match);
        }
    });
    
    return lines;
}

module.exports = checkFileForPhrase;