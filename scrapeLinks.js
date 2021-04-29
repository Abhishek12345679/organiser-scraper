const request = require("request");
const cheerio = require("cheerio");
const { writeFile } = require("fs/promises");

// saves issues from 2010 and 2009
const getLinks10and9 = (issueYear, link) => {
  const baseUrl = "https://www.organiser.org/archives/dynamic/";
  request.get(baseUrl + link, (err, response, body) => {
    if (err) console.error("An Error Occured: ", err);
    const $ = cheerio.load(body);

    const issueList = $("ul > li");

    const issues = [];
    issueList.each((i, ele) => {
      const issueDate = $(ele).find("li > p > a").text();
      const issueLink = $(ele).find("li > p > a").attr("href");
      issues.push({ issueDate: issueDate, issueLink: issueLink });
    });
    writeFile(
      `Archives/${issueYear}/${issueYear}.json`,
      JSON.stringify({ Issues: issues }),
      {
        flag: "w",
      }
    ).then(() => {
      console.log(`saved ${issueYear} json!`);
    });
  });
};

// saves issues <=2008

const getLinksOthers = (issueYear, link) => {
  const baseUrl = "https://www.organiser.org/archives/dynamic/";
  request.get(baseUrl + link, (err, response, body) => {
    if (err) console.error("An Error Occured: ", err);
    const $ = cheerio.load(body);

    const issueList = $(".blocklink");

    const issues = [];
    issueList.each((i, ele) => {
      const issueDate = $(ele).find("b").text();
      const issueLink = $(ele).attr("href");
      if (issueDate !== "") {
        issues.push({ issueDate: issueDate, issueLink: issueLink });
      }
    });
    writeFile(
      `Archives/${issueYear}/${issueYear}.json`,
      JSON.stringify({ Issues: issues }),
      {
        flag: "w",
      }
    ).then(() => {
      console.log(`saved ${issueYear} json!`);
    });
  });
};

const scrapeLinks = () => {
  const lastestArchiveLink =
    "https://www.organiser.org/archives/dynamic/modulesebad.html?name=Content&pa=showpage&pid=413";
  request.get(lastestArchiveLink, (err, response, body) => {
    if (err) console.error("An Error Occured: ", err);
    const $ = cheerio.load(body);

    const issueList = $(
      "td.bg02:nth-child(1) > table:nth-child(4) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr"
    );

    const issues = [];
    issueList.each((index, ele) => {
      const issueDate = $(ele).find("tr > td:nth-child(2) > a").text();
      const issueLink = $(ele).find("tr > td:nth-child(2) > a").attr("href");
      issues.push({ issueDate: issueDate, issueLink: issueLink });
    });

    const Issues_2011 = issues.slice(0, 36);
    writeFile(
      "Archives/2011/2011.json",
      JSON.stringify({ Issues: Issues_2011 }),
      {
        flag: "w",
      }
    ).then(() => {
      console.log("saved 2011 json!");
    });

    const yearlyIssues = issues.slice(49, 54);

    yearlyIssues.slice(0, 2).map((year, idx) => {
      getLinks10and9(year.issueDate.replace(" Issues", ""), year.issueLink);
    });

    yearlyIssues.slice(2).map((year, idx) => {
      getLinksOthers(year.issueDate.replace(" Issues", ""), year.issueLink);
    });
  });
};

//start of the program
scrapeLinks();
