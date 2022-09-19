const getNonInclusiveTerms = require("./non-inclusive-terms");
const getFilesFromDirectory = require("./read-files");
const checkFileForPhrase = require("./file-content");

const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');

async function run() { 
  try {
    // `fail-build` input defined in action metadata file
    const failBuild = core.getInput('fail-build');

    // `exclude-words` input defined in action metadata file
    const excludeTerms = core.getInput('exclude-terms');
    console.log(`Excluding terms: ${excludeTerms}`);
    var exclusions = excludeTerms.split(',');

    
    var passed = true;

    const dir = process.env.GITHUB_WORKSPACE;
    //const dir = `c:\\temp`;
    
    const nonInclusiveTerms = await getNonInclusiveTerms();

    // list all files in the directory
    var filenames = getFilesFromDirectory(dir);

    filenames.forEach(filename => {
      console.log(`Scanning file: ${filename}`);
      
      nonInclusiveTerms.forEach(phrase => {
        if (!exclusions.includes(phrase)) {
          var lines = checkFileForPhrase(filename.toString(), phrase.term);

          if (lines.length > 0) {
            // The Action should fail
            passed = false;

            console.log(`Found the term '${phrase.term}', consider using alternatives: ${phrase.alternatives}`);
            lines.forEach(line => {
              console.log(`\t[Line ${line.number}] ${line.content}`);
            });
          }
        }
        else
        console.log(`Skipping the term '${phrase.term}'`);
      });
    });

    if (!passed)
      if (failBuild === 'true')
        core.setFailed("Found non inclusive terms in some files.");
      else
        core.warning("Found non inclusive terms in some files.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();