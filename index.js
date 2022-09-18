const getNonInclusiveTerms = require("./non-inclusive-terms");
const getFilesFromDirectory = require("./read-files");
const checkFileForPhrase = require("./file-content");

const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');

async function run() { 
  try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);


    var passed = true;

    const dir = process.env.GITHUB_WORKSPACE;
    //const dir = `c:\\temp`;
    
    const nonInclusiveTerms = await getNonInclusiveTerms();

    // list all files in the directory
    var filenames = getFilesFromDirectory(dir);

    filenames.forEach(filename => {
      console.log(`Scanning file: ${filename}`);
      
      nonInclusiveTerms.forEach(phrase => {
        var lines = checkFileForPhrase(filename.toString(), phrase.term);

        if (lines.length > 0) {
          // The Action should fail
          passed = false;

          console.log(`Found the term '${phrase.term}', consider using alternatives: ${phrase.alternatives}`);
          lines.forEach(line => {
            console.log(`\t[Line ${line.number}] ${line.content}`);
          });
        }
      });
    });

    if (!passed)
      core.setFailed("Found non inclusive terms in some files.");

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();