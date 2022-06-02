const HEADER = ['id', 'game', 'username', 'score'];
const STATUS = { success : 'success', fail : 'fail' };
const SORT_METHOD = { ascending : 'ascending', descending : 'descending' };
const SORT_METHOD_KEY = Object.keys(SORT_METHOD);
const GAMES = {
  firevoid : 'firevoid',
  findingMine : 'findingMine',
  diceGame : 'diceGame',
  guessingNumber : 'guessingNumber', 
  aimPractice : 'aimPractice',  
  snakeGame : 'snakeGame',
  whackAMozzie : 'whackAMozzie',
  breakoutStyle : 'breakoutStyle',
  puzzle : 'puzzle',
};
const GAMES_KEY = Object.keys(GAMES);

// ----------------------------------------------------------

function doGet(e) {
  try {
    /*
      e.parameter is {
        gamename : "string" <--- target game name.
        getNumber : "int" <--- The number of datas you needs for each game.
        sortMethod : "string"
      }
    */

    let params;
    if(!e){
      throw new Error("No URL Parameters");
    }
    params = e.parameter;

    // validate params
    if (!SORT_METHOD_KEY.includes(params.sortMethod))
      throw new Error(`Invalid sortMethod : ${params.sortMethod}`);
    else if(!GAMES_KEY.includes(params.gamename) && params.gamename != 'all')
      throw new Error(`Invalid gamename : ${params.gamename}`);
    else if(!parseInt(params.getNumber))
      throw new Error(`Invalid getNumber : ${params.getNumber}`);

    // For TEST ▼
    // const params = {
    //   gamename : GAMES.firevoid,
    //   getNumber : 3,
    //   sortMethod : SORT_METHOD.ascending,
    // }
    // For TEST ▲

    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = SpreadsheetApp.setActiveSheet(spreadSheet.getSheets()[0]);
    const dataArr = sheet.getDataRange().getValues();

    const dataObj = arrToObj(dataArr);
    const result = makeResultRequestedByGET(dataObj, params);

    Logger.log(result);

    return buildResponse({
          status: STATUS.success,
          data: result,
    }); 

  } catch (err) {
    Logger.log(err);
    return buildResponse({
          status: STATUS.fail,
          data: String(err.stack),
    });
  }
}

function makeResultRequestedByGET(data, params){
  Logger.log(params);
  /* params is { gamename, getNumber, sortMethod } */
  let target = [];
  const result = {};

  // [1.] select target ---
  target = (params.gamename==="all") ? Object.keys(GAMES) : [params.gamename];

  // [2.] separate gamedata by game name ---
  //   [2-1.] initialize arr 'result.(gamename)' as empty array. 
  target.forEach( key => {result[key]=[]} );
  //   [2-2.] push data to arr 'result.(gamename)'
  data.forEach(item =>
    target.includes(item.game)
    && result[item.game].push(item) 
  );
  
  // [3.] sort 'result.(gamename)' by params.sortMethod ---
  const sortExp = {
    'ascending' : (a,b) => a.score-b.score,
    'descending' : (a,b) => b.score-a.score,
  };
  target.forEach(key => 
    result[key].sort( sortExp[params.sortMethod] )
  );

  // [4.] leave the first N(=params.getNumber), and remove the rest.
  target.forEach(key => {
    const len = result[key].length;
    const n = parseInt(params.getNumber);
    if(len > n)
      result[key] = result[key].slice(0, params.getNumber);
  });

  return result;
}

// ----------------------------------------------------------

function doPost(e) {
  try {
    /*
      postData is {
        gamename : "string",
        username : "string",
        score : "int",
      }
    */ 
    const postData = JSON.parse(e.postData.contents);
    
    // validate postData
    if (postData.username == false)
      throw new Error(`Invalid username : ${postData.username}`);
    else if(!GAMES_KEY.includes(postData.gamename))
      throw new Error(`Invalid gamename : ${postData.gamename}`);
    else if(!parseInt(postData.score) && parseInt(postData.score) != 0)
      throw new Error(`Invalid score : ${postData.score}`);

    // For TEST ▼
    // const postData = {
    //   gamename : GAMES.findingMine,
    //   username : 'www',
    //   score : 123,
    // }
    // For TEST ▲

    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = SpreadsheetApp.setActiveSheet(spreadSheet.getSheets()[0]);
    const sheetArr = sheet.getDataRange().getValues();

    const sheetHeight = sheetArr.length;
    const newId = parseInt(sheetArr[sheetHeight - 1][0]) + 1;

    const reqDataArr = [newId, postData.gamename, postData.username, postData.score];
    sheet.appendRow(reqDataArr);
    
    return buildResponse({
      status: STATUS.success,
      data: postData,
    });

  } catch (err) {
    Logger.log(err);
    return buildResponse({
      status: STATUS.fail,
      data: String(err.stack),
    });
  }
}

// ----------------------------------------------------------

function arrToObj(arr) {
  const keys = arr.shift();
  const result = [];

  for (var i = 0; i < arr.length; i++) {
    const member = {}
    for (var j = 0; j < keys.length; j++) {
      member[keys[j]] = arr[i][j];
    }
    result.push(member);
  }

  arr.unshift(keys);

  return result;
}

function buildResponse({ status, data }) {
  const response = {
    status: status,
    data: data,
  }
  Logger.log(response);
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}