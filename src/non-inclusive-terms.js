//const request = require("request-promise");
const data = require("./data.json");

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