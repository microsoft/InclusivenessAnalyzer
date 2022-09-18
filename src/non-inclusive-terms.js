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

module.exports = getNonInclusiveTerms;