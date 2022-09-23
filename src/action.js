const nonInclusiveTerms = require("./non-inclusive-terms");
const readFiles = require("./read-files");
//const checkFileForPhrase = require("./file-content");
const checkFileForTerms = require("./check-file");

const logger = require("./platform/logger");
const params = require("./platform/params");

const EXCLUSIONS = ["**/.git", "**/node_modules/**"];

async function run() {
  try {
    logger.info("Inclusiveness Analyzer")
    // `failStep` input defined in action metadata file
    const failStep = params.readBoolean('failStep');
    if (failStep) 
      logger.info("- Failing if non-inclusive term are found");

    // `exclude-words` input defined in action metadata file
    const excludeTerms = params.read('excludeterms');
    var exclusions = excludeTerms.split(',');
    if (excludeTerms.trim() !== '')
      logger.info(`- Excluding terms: ${exclusions}`);

    var exclusions = EXCLUSIONS;

    // `exclude-from-scan` input defined in action metadata file
    const excludeFromScan = params.read('excludeFromScan');
    //const excludeFromScan = "**/*.ps1,**/*.mp4";
    if (excludeFromScan !== '') {
        exclusions = exclusions.concat(excludeFromScan.split(/[, ]+/));
        logger.info(`- Excluding file patterns : ${exclusions}`);
    }

    // `last-commit` input defined in action metadata file
    const checkLastCommit = params.readBoolean('lastCommit');

    var passed = true;

    const dir = process.env.GITHUB_WORKSPACE;
    //const dir = `C:/Temp`;
    //const dir = process.cwd().replaceAll("\\", "/");

    const list = await nonInclusiveTerms.getNonInclusiveTerms();

    var filenames = []
    if (checkLastCommit) {
      logger.info("- Scanning files added or modified in last commit");
      filenames = readFiles.getFilesFromLastCommit(exclusions);
    } else { 
      logger.info("- Scanning all files in directory");
      filenames = readFiles.getFilesFromDirectory(dir,exclusions);
    }

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

    if (!passed && failStep)
        logger.fail("Found non inclusive terms in some files.");

  } catch (error) {
    logger.fail(error.message);
  }
}

run();
