//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const root = require('./tree-model-search/parse-tree-model').root
const queList = require('./que')
const getQueInfo = require('./tree-model-search/utils').getQueInfo
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname)))

// Webhook validation
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'sample_bot_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

// Display the web page
app.get('/', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write(messengerButton);
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function (entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      if(entry && entry.messaging) {
      // Iterate over each messaging event
      entry.messaging.forEach(function (event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    }
    });
  
    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  //console.log("Received message for user %d and page %d at %d with message:",
   // senderID, recipientID, timeOfMessage);
  //console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    console.log('message text ----', messageText)
    switch (messageText) {
      case 'generic':
        {
          sendGenericMessage(senderID);
          break;
        }
      case 'hi':
        {
          sendGenericMessage(senderID, queList['Q1']);
          break;
        }
      default:
        {
          var queInfo = getQueInfo(messageText, root)
          if (queInfo && queInfo.text == 'not found') {
            sendTextMessage(senderID, "Sorry I don't understand . type  hi to start");
          } else {
            sendGenericMessage(senderID, queInfo);
          }
        }
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}
// handling option click
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  //console.log("Received postback for user %d and page %d with payload '%s' " +
   // "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  var queInfo = getQueInfo(payload, root)
  // for text inputs
  if (queInfo && queInfo.text == 'not found') {
    sendTextMessage(senderID, "Sorry I don't understand . type  hi to start");
  } else {
    // final step
    if (queInfo && queInfo.type == 'End') {
      sendTextMessage(senderID, queInfo.text)
    } else { // showing next que
      sendGenericMessage(senderID, queInfo);
    }
  }
  //sendTextMessage(senderID, "Postback called");
}

//////////////////////////
// Sending helpers
//////////////////////////
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}
function sendGenericMessage(recipientId, queInfo) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: queInfo.text,
            subtitle: "Select an option below",
            item_url: "",
            image_url: "",
            buttons: [],
          }]
        }
      }
    }
  };

  for (var i = 0; i < queInfo.options.length; i++) {
    messageData.message.attachment.payload.elements[0].buttons.push({
      type: 'postback',
      title: queInfo.options[i].text,
      payload: queInfo.options[i].key
    })
  }

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: 'EAAN3s3DTH3sBALO66QmZC5ZBWi84dlacSIswselak01NC4fB9WZB8L4tfCjH455QqabDqsjzzldqgEj5Lq0GjOpyMnICCOUHm0lLwF49f6u3iiltvyVSo1oHZAEUGo1Cofza9Xvtr9bCVCiHR31ZAV9n6Y6gBn2Mwg6y7LzbYgAZDZD'
    },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      //console.log("Successfully sent generic message with id %s to recipient %s",
       // messageId, recipientId);
    } else {
      console.error("Unable to send message.");
   //   console.error(response);
      console.error(error);
    }
  });
}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});