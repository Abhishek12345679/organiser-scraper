# Organiser Scrapper

Run the following commands
 
> if you don't have node installed, go to https://nodejs.org/en/ and download 16.0.0 version or whichever is the latest.


Extract the folder and ```cd``` into it


1. ``` npm install ``` //to install the dependencies

2. ``` node commands.js init``` //this will create the folders for the issues to be in

3. ``` node scrapeLinks.js ``` //saves the links for all the issues as jsons 

4. To get the issues, you will have to manually type out the command for each year as: ``` node commands.js getYearIssue <year> ``` //where year is 2006-2011

    eg: ``` node commands.js getYearIssue 2011 ``` 

5. due to some weird bugs if certain issues are not saved and you need them, use the following command:

    ``` node commands.js getIssue <year> <issueDate>```

    eg:``` node commands.js getIssue 2011 "September 04, 2011" ```
    //the issueDate should to be exactly as it is in organiser.org archives or the json files.