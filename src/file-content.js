const fs = require('fs');

function checkFileForPhrase(file, phrase) {

    var lines = [];
    var content = fs.readFileSync(file, 'utf-8').toString().split("\n");
    content.forEach((line, index) => {
        match = line.match(phrase) 
        if (match) {
            var output = {
                file: file,
                number: index,
                column: match.index,
                content: match.input
            }
            lines.push(output);
        }
    });
    
    return lines;
}

module.exports = checkFileForPhrase;