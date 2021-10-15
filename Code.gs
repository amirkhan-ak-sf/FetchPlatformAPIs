
function fetchJSON(url, token, xpath) {


  var options = {
    'method' : 'GET',
    'headers' : {
      'Authorization': 'Bearer ' + token,
    }
  };
 var response = UrlFetchApp.fetch(url, options);

  var content = response.getContentText();
  var json = JSON.parse(content);
  
  var patharray = xpath.split("/");
  //Logger.log(patharray);
  
  for(var i=0;i<patharray.length;i++){
    json = json[patharray[i]];
  }
  
  //Logger.log(typeof(json));
  
  if(typeof(json) === "undefined"){
    return "Node Not Available";
  } else if(typeof(json) === "object"){
    var tempArr = [];
    
    for(var obj in json){
      tempArr.push([obj,json[obj]]);
    }
    return tempArr;
  } else if(typeof(json) !== "object") {
    return json;
  }
}


function fetchJSONwithHeader(url, token, orgId, envId, xpath) {

  var options = {
    'method' : 'GET',
    'headers' : {
      'Authorization': 'Bearer ' + token,
      'X-ANYPNT-ORG-ID' : orgId,
      'X-ANYPNT-ENV-ID' : envId
    }
  };
 var response = UrlFetchApp.fetch(url, options);

  var content = response.getContentText();
  var json = JSON.parse(content);
  
  var patharray = xpath.split("/");
  //Logger.log(patharray);
  
  for(var i=0;i<patharray.length;i++){
    json = json[patharray[i]];
  }
  
  //Logger.log(typeof(json));
  
  if(typeof(json) === "undefined"){
    return "Node Not Available";
  } else if(typeof(json) === "object"){
    var tempArr = [];
    
    for(var obj in json){
      tempArr.push([obj,json[obj]]);
    }
    return tempArr;
  } else if(typeof(json) !== "object") {
    return json;
  }
}

function fetchToken(url, username, password) {
  var xpath = "access_token"
  var payload = {"username": username,
                 "password": password};

  var options = {
    'method' : 'POST',
    'headers' : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    'payload': payload
  };


 var response = UrlFetchApp.fetch(url + "/accounts/login", options);
  var content = response.getContentText();
  Logger.log(response.getResponseCode())

  var json = JSON.parse(content);
  
  var patharray = xpath.split("/");
  //Logger.log(patharray);
  
  for(var i=0;i<patharray.length;i++){
    json = json[patharray[i]];
  }
  
  //Logger.log(typeof(json));
  
  if(typeof(json) === "undefined"){
    return "Node Not Available";
  } else if(typeof(json) === "object"){
    var tempArr = [];
    
    for(var obj in json){
      tempArr.push([obj,json[obj]]);
    }
    return tempArr;
  } else if(typeof(json) !== "object") {
    return json;
  }
}

