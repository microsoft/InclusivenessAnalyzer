const fs = require('fs');

function checkFileForPhrase(file, phrase) {

    var lines = [];
    var content = fs.readFileSync(file, 'utf-8').toString().split("\n");
    content.forEach((line, index) => {
        if(line.match(phrase)) {
            var match = {
                file: file,
                number: index,
                content: line
            }
            lines.push(match);
        }
    });
    
    return lines;
}

module.exports = checkFileForPhrase;