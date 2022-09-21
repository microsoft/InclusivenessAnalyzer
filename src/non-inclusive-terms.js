//const request = require("request-promise");
const data = require("./data.json");

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
  var regexWhitespace = new RegExp('[\\s _-]', "gi");

  var termsArray = data
    .filter(term => !exclusions.some(exclude => exclude === term.term))
    .map(term => term.regex ?? term.term.replace(regexWhitespace, '[\\s _-]?'));

  return termsArray.join('|');
  //return "white\\s?list|blacklist|[^a-z]he[^a-z]";
};

module.exports = { getNonInclusiveTerms, getTermsRegex };