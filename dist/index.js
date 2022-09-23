/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 689:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isBinaryFileSync = (__nccwpck_require__(522).isBinaryFileSync);
const fs = __nccwpck_require__(147);
const logger = __nccwpck_require__(653);

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
        });
    }
    else
        // refactor to use logger
        logger.debug(`Skipping binary file: ${file}`)
    
    return passed;
}

module.exports = checkFileForTerms;

/***/ }),

/***/ 653:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(838);
const github = __nccwpck_require__(766);

function info(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.notice(message);
    else
        core.notice(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function warn(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.warning(message);
    else
        core.warning(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function debug(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.debug(message);
    else
        core.debug(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function error(message, file = '', line = 0, column = 0, title = "") {
    if (file === '')
        core.error(message);
    else
        core.error(message, { file: file, startLine: line.toString(), column: column.toString(), title: title });
}

function fail(message) {
    core.setFailed(message);
}

module.exports = { info, warn, debug, fail };

/***/ }),

/***/ 224:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//const request = require("request-promise");
const data = __nccwpck_require__(468);

//const options = {
//  method: "GET",
//  uri: "https://icanhazdadjoke.com/",
//  headers: {
//    Accept: "application/json",
//    "User-Agent":
//      "Writing JavaScript action GitHub Learning Lab course.  Visit lab.github.com or to contact us."
//  },
//  json: true
//};

async function getNonInclusiveTerms() {
  //const res = await request(options);
  //return res.joke;
  return data;
}

function getTermsRegex(exclusions = []) {
  var regexWhitespace = new RegExp('[\\s_-]', "gi");

  var termsArray = data
    .filter(term => !exclusions.some(exclude => exclude === term.term))
    .map(term => term.regex ?? ((term.term.length < 5) ? `(?<=^|[^a-z])${term.term.replace(regexWhitespace, '[\\s_-]?')}(?=$|[^a-z])` : term.term.replace(regexWhitespace, '[\\s_-]?')));

  return termsArray.join('|');
  //return `(?<=^|[^a-z])${termsArray.join('|')}(?=$|[^a-z])`;
};

module.exports = { getNonInclusiveTerms, getTermsRegex };

/***/ }),

/***/ 240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(838);
const github = __nccwpck_require__(766);

function read(name) {
    return core.getInput(name);
}

function readBoolean(name) {
    return core.getBooleanInput(name);
}

module.exports = { read, readBoolean };

/***/ }),

/***/ 892:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const glob = __nccwpck_require__(296);
var minimatch = __nccwpck_require__(261)
const { REPL_MODE_STRICT } = __nccwpck_require__(102);

const logger = __nccwpck_require__(653);

const execSync = (__nccwpck_require__(81).execSync);

function getFilesFromDirectory(directoryPath, exclusions) {

    // check coherene of base directory
    coherentDirectoryPath = directoryPath.trim().replace(/\\/g,"/")
    if (coherentDirectoryPath.charAt(coherentDirectoryPath.length - 1) !== "/") {
        coherentDirectoryPath += "/"
    }
    logger.debug(`Base directory: ${coherentDirectoryPath}`);

    // get files
    var filesArray = glob.sync(`${coherentDirectoryPath}**/*`, { nodir: true, ignore: exclusions, absolute: true });

    // make all path relative
    var processPath = process.cwd().replace(/\\/g,"/");
    var regex = new RegExp(`^${processPath}/`,'')
    for (var i=0; i<filesArray.length; i++) {
        filesArray[i] = filesArray[i].replace(regex, "");
    }    
    
    return filesArray;
}

function getFilesFromLastCommit(exclusions) {
    var output = execSync('git log --format= --name-only --diff-filter=AM -n 1');
    var files = output.toString().trim().split("\n");
    var includedFiles = []
    files.forEach(filename => {
        var skip = false;
        exclusions.forEach(pattern => {
            if (minimatch(filename,pattern)) {
                skip = true;
                return;
            }
        });
        if (skip) 
            return;
        includedFiles.push(filename);
    });
    return includedFiles;
}

module.exports = { getFilesFromDirectory, getFilesFromLastCommit };

/***/ }),

/***/ 838:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 766:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 296:
/***/ ((module) => {

module.exports = eval("require")("glob");


/***/ }),

/***/ 522:
/***/ ((module) => {

module.exports = eval("require")("isbinaryfile");


/***/ }),

/***/ 261:
/***/ ((module) => {

module.exports = eval("require")("minimatch");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 102:
/***/ ((module) => {

"use strict";
module.exports = require("repl");

/***/ }),

/***/ 468:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[{"term":"whitelist","regex":"white[\\\\s_-]?list","alternatives":["allow list","access list","permit"]},{"term":"blacklist","regex":"black[\\\\s_-]?list","alternatives":["deny list","blocklist","exclude list"]},{"term":"master","alternatives":["primary","main","default","leader"]},{"term":"slave","alternatives":["replica","standby","secondary","follower"]},{"term":"minority","alternatives":["marginalized groups","underrepresented groups","people of color"]},{"term":"minorities","alternatives":["marginalized groups","underrepresented groups","people of color"]},{"term":"brown bag","alternatives":["learning session","lunch-and-learn","sack lunch"]},{"term":"white box","alternatives":["open-box"]},{"term":"black box","alternatives":["closed-box"]},{"term":"culture fit","alternatives":["values fit","cultural contribution"]},{"term":"citizen","alternatives":["resident","people"]},{"term":"guys","alternatives":["folks, you all","y\'all","people","teammates","team"]},{"term":"he","regex":"(?<=^|[^a-z])he(?=$|[^a-z])","alternatives":["they"]},{"term":"his","alternatives":["their","theirs"]},{"term":"him","alternatives":["them"]},{"term":"she","alternatives":["they"]},{"term":"her","alternatives":["their"]},{"term":"hers","alternatives":["theirs"]},{"term":"manpower","regex":"man[\\\\s_-]?power","alternatives":["human effort","person hours","engineer hours","work","workforce","personnel","team","workers"]},{"term":"man hours","alternatives":["human effort","person hours","engineer hours","work","workforce","personnel","team","workers"]},{"term":"mankind","regex":"man[\\\\s_-]?kind","alternatives":["people","humanity"]},{"term":"chairman","alternatives":["chairperson","spokesperson","moderator","discussion leader","chair"]},{"term":"foreman","alternatives":["chairperson","spokesperson","moderator","discussion leader","chair"]},{"term":"middleman","regex":"middle[\\\\s_-]?man","alternatives":["middle person","intermediary","agent","dealer"]},{"term":"mother","alternatives":["parent","caretaker","nurturer","guardian"]},{"term":"mothering","alternatives":["parenting","caretaking","caring","nurturing"]},{"term":"father","alternatives":["parent","caretaker","nurturer","guardian"]},{"term":"fathering","alternatives":["parenting","caretaking","caring","nurturing"]},{"term":"wife","alternatives":["spouse","partner","significant other"]},{"term":"husband","alternatives":["spouse","partner","significant other"]},{"term":"boyfriend","regex":"boy[\\\\s_-]?friend","alternatives":["partner","significant other"]},{"term":"girlfriend","regex":"girl[\\\\s_-]?friend","alternatives":["partner","significant other"]},{"term":"girl","alternatives":["woman"]},{"term":"girls","alternatives":["women"]},{"term":"female","alternatives":["woman"]},{"term":"females","alternatives":["women"]},{"term":"boy","alternatives":["man"]},{"term":"boys","alternatives":["men"]},{"term":"male","alternatives":["man"]},{"term":"males","alternatives":["men"]},{"term":"mom test","alternatives":["user test"]},{"term":"girlfriend test","alternatives":["user test"]},{"term":"ninja","alternatives":["professional"]},{"term":"rock star","alternatives":["professional"]},{"term":"housekeeping","alternatives":["maintenance","cleanup","preparation"]},{"term":"opposite sex","alternatives":["different sex"]},{"term":"grandfathered in","alternatives":["exempt"]},{"term":"grandfathered","alternatives":["exempt"]},{"term":"midget","alternatives":["little person","short stature","person with dwarfism"]},{"term":"crazy","alternatives":["unexpected","unpredictable","surprising"]},{"term":"insane","alternatives":["unexpected","unpredictable","surprising"]},{"term":"freak","alternatives":["unexpected","unpredictable","surprising"]},{"term":"tone deaf","alternatives":["oblivious"]},{"term":"blind spot","regex":"blind\\\\s?spot","alternatives":["dead spot","unseen area"]},{"term":"OCD","alternatives":["organized","detail-oriented"]},{"term":"depressed","alternatives":["sad","upset"]},{"term":"depressing","alternatives":["saddening","upsetting"]},{"term":"handicap","alternatives":["person with a disability"]},{"term":"cripple","alternatives":["person with a disability"]},{"term":"sanity check","alternatives":["quick check","confidence check","coherence check"]},{"term":"sane","alternatives":["correct","adequate","sufficient","valid","sensible","coherent"]},{"term":"retard","alternatives":["person with disabilities","mentally limited"]},{"term":"dummy value","alternatives":["placeholder value","sample value","design value"]}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const nonInclusiveTerms = __nccwpck_require__(224);
const readFiles = __nccwpck_require__(892);
//const checkFileForPhrase = require("./file-content");
const checkFileForTerms = __nccwpck_require__(689);

const logger = __nccwpck_require__(653);
const params = __nccwpck_require__(240);

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

})();

module.exports = __webpack_exports__;
/******/ })()
;