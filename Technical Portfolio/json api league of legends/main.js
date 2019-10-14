//function to get the tier of the username given.
function rankTier(body,currentChar){
  //varaible for the tier and divison string
  var tierAndDivison="";

  //loop that starts at the char index given and parses for the tier and division text
  while(body[currentChar]!='}'){
    //endOfTier holds the value of the index for the end of the string for the tier then for the rank in the next if statment
    var endOfTierRank=0;
    //if the substring is equal to tier then we parse for the end index string
    if(body.substring(currentChar,currentChar+4)=="tier"){
      endOfTierRank=currentChar+7;
      while(body[endOfTierRank]!="\""){
        endOfTierRank=endOfTierRank+1;
      }
      tierAndDivison = body.substring(currentChar+7,endOfTierRank);
    }
    // if the substring equals rank we look for the end of rank index from body text
    if(body.substring(currentChar,currentChar+4)=="rank"){
      endOfTierRank=currentChar+7;
      //while loop to find the end of the rank string
      while(body[endOfTierRank]!="\""){
        endOfTierRank=endOfTierRank+1;
      }
      tierAndDivison = tierAndDivison + " " + body.substring(currentChar+7,endOfTierRank);
    }
    currentChar=currentChar+1;
  }
  return tierAndDivison;
}

//function to parse the text and get the rank of the user
function getRank(body){
    var charIndexBody=0;//variable to keep track of the current char location in the body
    var whatRank = 0;//variable to keep track if this rank is solo,flex or tft queue
    var rankText1 = "";//text for rank for solo
    var rankText2 = "";//text for rank for tft
    var rankText3 = "";//text for rank for flex
    var queTypeString = "";//text of the queuetype parsed from the body
    //loops through text until a "]" is found, same as end of file
    while(body[charIndexBody]!=']'){
      //if the string queueType is found in the body parsing is done to get the name of the queueType
      if(body.substring(charIndexBody,charIndexBody+9)=="queueType"){
        whatRank=whatRank+1;
        //endOfQueStr is a varaible to get mark the end index of the queueType string
        endOfQueStr=charIndexBody+12;
        //loop to get find the index of the last character for the queueType string
        while(body[endOfQueStr]!="\""){
          endOfQueStr=endOfQueStr+1;
        }
        queTypeString = body.substring(charIndexBody+12,endOfQueStr);
        //for all 3 if statements if thequeTypeString is found rankText is assigned a string
        if("RANKED_FLEX_SR"== queTypeString){rankText="Flex Rank ";}
        if("RANKED_TFT"== queTypeString){rankText="TFT Rank ";}
        if("RANKED_SOLO_5x5"== queTypeString){rankText="Solo Rank ";}

        // if what rank is 1,2 or 3 than rankTier and winRatio are called and rankText 1,2 or 3 are assigned the string with the rturn values from the function calls
        if(whatRank==1){
          rankText1 = "\n"+rankText+" "+rankTier(body,charIndexBody)+" "+ winRatio(charIndexBody,body)+"% win rate.";
        }else if(whatRank==2) {
          rankText2 = "\n"+rankText+" "+rankTier(body,charIndexBody)+" "+ winRatio(charIndexBody,body)+"% win rate.";
        }else if(whatRank==3){
          rankText3 = "\n"+rankText+" "+rankTier(body,charIndexBody)+" "+ winRatio(charIndexBody,body)+"% win rate.";
        }
      }
      charIndexBody=charIndexBody+1;
    }
    return rankText1+rankText2+rankText3;
  }
  //function call that parses the text to round the win ratio to the Hundredths
  function roundToHundredths(text){
    //answer is the text returned when the number is reduced to the Hundredths
    answer=parseInt(text.substring(2,4),10);
    //the 4 character is compared if greater than 4 round up
    if(parseInt(text[4],10)>4){
      answer=answer+1;
    }
    //answer is returned as a values 100 times the original number.
      return answer;
  }
  //function to get the win % of a user
  function winRatio(currentChar,body){
    //text for wins in solo,tft,or flex queue
    winsText="";
    ////text for losses in solo,tft,or flex queue
    lossesText="";
    //currentChar is the index of the character in the body
    x=currentChar;
    //while loop to find the wins and losses substring
    while(body[x]!="}"){
      if(body[x]=="{"){break;}
      //if wins is found the number is assigned to winsText
      if(body.substring(x,x+4)=="wins"){
        y=x+4;
        while(body[y]!=","){
          y=y+1;
        }
        winsText=body.substring(x+6,y);
        //console.log(winsText);
      }
      ////if losses is found the number is assigned to lossesText
      if(body.substring(x,x+6)=="losses"){
        y=x+6;
        while(body[y]!=","){
          y=y+1;
        }
        lossesText=body.substring(x+8,y);
        //console.log(lossesText);
      }
      x=x+1;
    }
    //the text variiables are converted to ints
    var winsNum = parseInt(winsText, 10);
    var lossesNum = parseInt(lossesText, 10);
    //the win loss ration is calculated and assigned to winRatioNum
    winRatioNum = winsNum/(winsNum+lossesNum);
    //the win ratio is roundToHundredths and then converted to a whole number
    return roundToHundredths(winRatioNum.toString());
}
//the code below looks up a summoner in league of legends using the riotgames API
function httpGet(theUrl)
{
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
//function to display which champs are on free rotation
function freeChampRotation(bodyText){

    //opens and reads file located at location in C: drive
    var fs = require('fs');
    var data = fs.readFileSync('C:\\Users\\jaket\\OneDrive\\Desktop\\json api league of legends\\1234567.txt').toString();
    champRotationAnswer="";
    //splits text from data based on the newline character
    var lines = data.split('\n');
    //denotes last and first desired characters of bodyText
    lastLetter=0;
    firstLetter=0;
    //assigns firstLetter to the index of [
    while(bodyText[firstLetter]!="["){
      firstLetter=firstLetter+1;
    }
    //assigns last letter to index of ]
    while(bodyText[lastLetter]!="]"){
      lastLetter=lastLetter+1;
    }
    //console.log(firstLetter);
    //indexChamps is the string of numbers that has all champs indexs split by commas
    indexChamps=bodyText.substring(firstLetter+1,lastLetter);
    //champSplitter splits indexs up based on the commas
    var champSplitter = indexChamps.split(',').map(function(item) {
    return parseInt(item, 10);
    });
    //x is a counter to loop through until xlength is reached
    x=0;
    xLength=champSplitter.length;
    while(x<xLength){
      //y is a counter used to loop until }\r is found
      y=0;
      while(lines[y]!=="}\r"){
        //if the numbers at lines[y] and champSplitter are equal the champ name is added to champRotationAnswer
        if(lines[y]==champSplitter[x]){
          champRotationAnswer = champRotationAnswer+lines[y-1]+"\n";
        }
        y=y+1;
      }
      x=x+1;
    }
    return "\n"+champRotationAnswer;
}



//the 2 lines of code create and connect the discord bot to a discord server
const Discord = require('discord.js');
const client = new Discord.Client();

//when the discord bot is ready a line is printed to the console
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// when a message is sent in the discord server it is parsed to see if it is a valid command
client.on('message', msg => {
  //if the message startwith a ~ than the following if statment is ran.
  if (msg.content.startsWith("~")) {
    //searchForName is the remainder of the string directly after the "~" character
    var searchForName = msg.content.substring(1,msg.content.length);
    //encryptedSummonerName is a unique (linked to only 1 account) 47 charater string provided by the riotgames api
    var encryptedSummonerName = httpGet('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+searchForName+'?api_key=RGAPI-9a6ba7b4-7b37-4799-9890-6be8aa433550');
    encryptedSummonerName = encryptedSummonerName.substring(7,54);
    //textFromRequest is the entire text from the api-request file requested
    textFromRequest = httpGet('https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+encryptedSummonerName+'?api_key=RGAPI-9a6ba7b4-7b37-4799-9890-6be8aa433550');
    //rankFound is the rank of the user given
    var rankFound = getRank(textFromRequest);
    //the msg.reply sends a message to the user who entered the command with the rank and name of the user entered
    msg.reply(searchForName +" is "+ rankFound);
  }







  if (msg.content == "!R"){
    //replies to the user with the freeChampRotation
    msg.reply(freeChampRotation(httpGet('https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-9a6ba7b4-7b37-4799-9890-6be8aa433550')));

    }
});

client.login('NTM2NTgzMTczNzgyNjM0NTE0.XTOCyg.J00z8tk-OrAp9gT4zdFayss321g');
