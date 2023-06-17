const ps = require("prompt-sync");
const prompt = ps();
const http = require("http");
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

const option_Func = (meth, path, id) => {
  var options = {
    host: "localhost",
    port: 8092,
    path: "/api.svc/api" + path,
    method: meth,
    headers: {
      SessionId: id,
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  };
  return options;
};

let suffix = "/Credential/Connect";
let metho = "POST";

let httpreq = http.request(option_Func(metho, suffix, null), (response) => {
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

setTimeout(createRec, 500);
setTimeout(retriveData,600);
setTimeout(DeleteRecord,700);

//    Function for Creating Records

function createRec() {
  let rec_data = JSON.stringify({
    FirstName: "dstrdbghf",
    LastName: "Sfetgrgdeee",
  });

  let recpath = "/Business_Contact/CreateRecord";
  let recmeth = "POST";
  let option = option_Func(recmeth, recpath, sessionID);
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

// Function for Retreive Records

function retriveData() {
  const RETdata = JSON.stringify({
    Columns:'FirstName,LastName,Business_ContactId',
    OrderBy:'FirstName',
  });
  let options = option_Func('POST','/Business_Contact/RetrieveMultipleRecords',sessionID)
  let httpreq3 = http.request(options, (response) => {
    console.log("statusCode:", response.statusCode);
    console.log("headers:", response.headers);
      response.on("data", (chunk) => {
        console.log(JSON.parse(chunk));
      });
    })
    .on("error", (error) => {
      console.log("Error in Retriving: ", error);
    })
    httpreq3.write(RETdata)
    httpreq3.end();
}

// Function for Deleting Records
/*
To delete records you need to pass RecordID(Business_ContactId) to of Specific Record 
*/

function DeleteRecord(){
  let Record_Id = prompt("Enter Record ID: ");
  let Del_data=JSON.stringify({
    Business_ContactId:Record_Id,
  })
  let option=option_Func('POST','/Business_Contact/DeleteRecord',sessionID);
  const httpreq4=http.request(option,(response)=>{
    console.log(response.statusCode)
  })
  httpreq4.on('error',(error)=>{
    console.log('error while Deleting :',error)
  })
  httpreq4.write(Del_data);
  httpreq4.end();
}