const { scrapeOrganiser, saveIssue } = require("./scrapeContent");
const { mkdir } = require("fs/promises");

const program = require("commander");
program.version("0.0.1");

//command to get all the issues from a year
program
  .command("getYearIssue <year>")
  .alias("getYI")
  .description(
    "save the entered year's issues. If the process does not end, please press CMD+C or CTRL+C"
  )
  .action((year) => {
    scrapeOrganiser(year);
  });

// init command
program
  .command("init")
  .alias("i")
  .description("creates folders")
  .action(() => {
    ["2011", "2010", "2009", "2008", "2007", "2006"].map((year) => {
      mkdir(`Archives/${year}`)
        .then(() => {
          console.log(`${year} folder created...`);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });

//command to get a particular issue
program
  .command("getIssue <year> <issueDate>") //issuedate should be the exactly like in the json files (eg. 2011.json -> September 04, 2011)
  .alias("getI")
  .description("saves particular issues")
  .action((year, issueDate) => {
    console.log({ year, issueDate });
    saveIssue(year, issueDate);
  });

program.parse(process.argv);
