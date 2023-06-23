const ps = require("prompt-sync");
const prompt = ps();
const http = require("https");
const { json } = require("stream/consumers");
const { response } = require("express");
const { error } = require("console");

var sessionID = "";
let DomainName = prompt("Enter Domain: ");
let UserName = prompt("Enter username: ");
let Password = prompt("Enter password: ");

const data = JSON.stringify({
  DomainName,
  UserName,
  Password,
});

const option_Func = (path, id) => {
  var options = {
    host: "www.famark.com",
    path: "/host/api.svc/api" + path,
    method: "POST",
    headers: {
      SessionId: id,
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  };
  return options;
};

let suffix = "/Credential/Connect";

let httpreq = http.request(option_Func(suffix, null), (response) => {
  console.log("statusCode:", response.statusCode);
  console.log("headers:", response.headers);

  response.on("data", (d) => {
    sessionID = JSON.parse(d);
    console.log(typeof sessionID);
    console.log(sessionID);
  });
});

httpreq.on("error", (error) => {
  console.log("An error", error);
});
httpreq.write(data);
httpreq.end();

setTimeout(retriveData, 500);
setTimeout(createRec, 1000);
setTimeout(DeleteRecord, 3000);
//    Function for Creating Records

function createRec() {
  let ans = prompt("Do you want to create record Y or N");
  if (ans === "N" || ans === "n") {
    return;
  } else {
    let rec_data = JSON.stringify({
      FirstName: "dstrdbghf",
      LastName: "Sfetgrgdeee",
    });

    let recpath = "/Business_Contact/CreateRecord";
    let option = option_Func(recpath, sessionID);
    console.log(JSON.stringify(option));
    let httpreq2 = http.request(option, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers:", response.headers);

      response.on("data", (d) => {
        process.stdout.write(d);
      });
    });
    httpreq2.on("error", (error) => {
      console.log("An error", error.message);
    });
    httpreq2.write(rec_data);
    httpreq2.end();
  }
}
393a2649-8a39-42e6-ae32-fe4698ab61f0
// Function for Retreive Records

function retriveData() {
  const RETdata = JSON.stringify({
    Columns: "FirstName,LastName,Business_ContactId",
    OrderBy: "FirstName",
  });
  let options = option_Func(
    "/Business_Contact/RetrieveMultipleRecords",
    sessionID
  );
  let httpreq3 = http
    .request(options, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers:", response.headers);
      response.on("data", (chunk) => {
        console.log(JSON.parse(chunk));
      });
    })
    .on("error", (error) => {
      console.log("Error in Retriving: ", error);
    });
  httpreq3.write(RETdata);
  httpreq3.end();
}

// Function for Deleting Records
/*
To delete records you need to pass RecordID(Business_ContactId) to of Specific Record 
*/

function DeleteRecord() {
  let ans = prompt("Do you want to Delete record Y or N");
  if (ans === "N" || ans === "n") {
    return;
  } else {
    let Record_Id = prompt("Enter Record ID: ");
    let Del_data = JSON.stringify({
      Business_ContactId: Record_Id,
    });
    let option = option_Func("/Business_Contact/DeleteRecord", sessionID);
    const httpreq4 = http.request(option, (response) => {
      console.log(response.statusCode);
    });
    httpreq4.on("error", (error) => {
      console.log("error while Deleting :", error);
    });
    httpreq4.write(Del_data);
    httpreq4.end();
  }
}
