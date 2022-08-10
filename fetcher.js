const request = require("request");
const fs = require("fs");
const readline = require("readline");
// const { dir } = require("console");
// const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Global Var set up
const input = process.argv.slice(2);
const url = input[0];
const filePath = input[1];

//begin page fetcher

request(url, (error, response, body) => {

  //a quick validation if there is a complete and utter mess of a url typed in
  if (response === undefined) {
    rl.write(`Your ${url} is undefined\n`);
    rl.write(`Error: ${error}\n`);
    process.exit();
  }
  //if any other errors occurs exit the request and show the error
  if (error) {
    rl.write(`${error}`);
    process.exit();
  }

  const { statusCode } = response;
  const firstStatusNum = statusCode.toString()[0];
  const bytes = body.split("").length; //character count equals bit count as per compass

  //if the status code equals something other that a 2.. show the status code and exit
  if (Number(firstStatusNum) !== 2) {
    rl.write(`${statusCode} has been given as a result of this ${url}\n`);
    process.exit();
  }

  //access the file via the file path and check via the constants if the file exists and it can be written to
  fs.access(filePath, fs.constants.F_OK && fs.constants.W_OK, (error) => {
    if (!error) {
      //ask the user if they want to overwrite the file
      rl.question(`This file at ${filePath} already exists do you want to overwrite it? Y/N?\n`, (input) => {
        if (input === '\u0079') {
          //if yes, then write the body from the URL path to the specified file path and exit
          fs.writeFile(filePath, body, err => {
            if (err) {
              console.log(err);
            }
            rl.write(`Downloaded and saved ${bytes} bytes to ${filePath}\n`);
            rl.close();
          });
          //if no, then exit the question and continue to the else statement below
        } else if (input === '\u006E') {
          rl.close();
        }
      });
    } else {
      rl.write(`There has been a file path error. \n${error}\n`);
      process.exit();
    }
  });
});


