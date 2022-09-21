const nonInclusiveTerms = require("./non-inclusive-terms");
const getFilesFromDirectory = require("./read-files");
//const checkFileForPhrase = require("./file-content");
const checkFileForTerms = require("./check-file");

const logger = require("./logger");
const params = require("./params");

async function run() {
  try {
    // `failStep` input defined in action metadata file
    const failStep = params.read('failStep');

    // `exclude-words` input defined in action metadata file
    const excludeTerms = params.read('excludeterms');
    var exclusions = excludeTerms.split(',');
    if (excludeTerms.trim() !== '')
      logger.info(`Excluding terms: ${exclusions}`);

    var passed = true;

    const dir = process.env.GITHUB_WORKSPACE;
    //const dir = `C:/Temp`;
    //const dir = process.cwd().replaceAll("\\", "/");

    const list = await nonInclusiveTerms.getNonInclusiveTerms();

    // list all files in the directory
    var filenames = getFilesFromDirectory(dir);

    filenames.forEach(filename => {
      logger.debug(`Scanning file: ${filename}`);
      //core.startGroup(`Scanning file: ${filename}`);

/*       nonInclusiveTerms.forEach(phrase => {
        if (!exclusions.includes(phrase.term)) {
          var lines = checkFileForPhrase(filename, phrase.term);

          if (lines.length > 0) {
            // The Action should fail
            passed = false;

            lines.forEach(line => {
              logger.warn(`[${line.file}:${line.number}] Consider replacing term '${phrase.term}' with an alternative such as '${phrase.alternatives.join("', '")}'`, line.file, line.number.toString(), line.column, `Consider replacing term '${phrase.term}' with an alternative such as '${phrase.alternatives.join("', '")}'`);
              logger.debug(`[${line.file}:${line.number}] ${line.content}`);
              //core.warning(`[${line.file}:${line.number}] Consider replacing term '${phrase.term}' with an alternative such as '${phrase.alternatives.join("', '")}'`, { file: line.file, startLine: line.number.toString(), startColumn: line.column, title: `Consider replacing term '${phrase.term}' with an alternative such as '${phrase.alternatives.join("', '")}'` });
              //core.debug(`[${line.file}:${line.number}] ${line.content}`);
            });
          }
        }
        else
          core.debug(`Skipping the term '${phrase.term}'`);
      }); */

      passed = checkFileForTerms(filename, nonInclusiveTerms.getTermsRegex(exclusions), list);

      //core.endGroup();
    });

    if (!passed)
      if (failStep === 'true')
        logger.fail("Found non inclusive terms in some files.");
      //else
      //  logger.warn("Found non inclusive terms in some files.");

  } catch (error) {
    logger.fail(error.message);
  }
}

run();
