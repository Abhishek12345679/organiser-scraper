const { writeFile, mkdir, readFile } = require("fs/promises");
const request = require("request");
const { promisify } = require("util");
const cheerio = require("cheerio");

const requestAsync = promisify(request);

// FIXME: it misses certain editions, read the readMe for fix
const scrapeContent = async (issueDate, issueLink, page) => {
  console.log(issueLink);
  console.log(page);
  const baseUrl = "https://www.organiser.org/archives/dynamic/";
  let issueYear = issueDate.substring(issueDate.indexOf(",") + 1).trim();
  if (issueYear === "07") {
    issueYear = "2007";
  }

  const { err, response, body } = await requestAsync(issueLink);

  const $ = cheerio.load(body);

  let nextPage = $("center:nth-child(12) > a:nth-child(1)").attr("href");
  const isLastPage = $("center:nth-child(20) > a:nth-child(1)").text();

  if (page > 1) {
    nextPage = $("center:nth-child(10) > a:nth-child(3)").attr("href");
  }

  const nextPageLink = baseUrl + nextPage;

  const article = $(
    "body > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)"
  ).text();

  // creating issue folder
  await mkdir(`Archives/${issueYear}/${issueDate.replace(" ", "")}`, {
    recursive: true,
  });

  // writing articles
  await writeFile(
    `Archives/${issueYear}/${issueDate.replace(" ", "")}/${page}.txt`,
    article,
    {
      flag: "w",
    }
  );
  console.log(`saving ${issueDate}/${page}...`);

  if (isLastPage === "Go Back") {
    console.log("Last page reached!");
    return;
  }

  await scrapeContent(issueDate, nextPageLink, page + 1);
};

const scrapeOrganiser = (year) => {
  readFile(`Archives/${year}/${year}.json`)
    .then((data) => {
      const issues = JSON.parse(data.toString())["Issues"];
      if (issues !== undefined) {
        issues.map((issue, i) => {
          scrapeContent(
            issue.issueDate,
            "https://www.organiser.org/archives/dynamic/" + issue.issueLink,
            1
          );
        });
      } else {
        console.log("issue undefined!!");
      }
    })
    .catch((err) => {
      console.error(err);
    });
  console.log("Scraped!!");
};

const saveIssue = (issueYear, issueDate) => {
  readFile(`Archives/${issueYear}/${issueYear}.json`)
    .then((data) => {
      const issues = JSON.parse(data.toString())["Issues"];
      if (issues !== undefined) {
        issues.map((issue, i) => {
          if (issue.issueDate === issueDate) {
            console.log("issue found!");
            scrapeContent(
              issue.issueDate,
              "https://www.organiser.org/archives/dynamic/" + issue.issueLink,
              1
            );
            console.log(`issue saved at ${issueYear}`);
          }
        });
      } else {
        console.log("issue undefined!!");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  scrapeOrganiser,
  saveIssue,
};
