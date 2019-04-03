'use strict';

//import ask-sdk-core
const Alexa = require('ask-sdk-core');

//skill name
const appName = 'Investacito';

//code for the handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        //welcome message
        let speechText = `Welcome to Investacito. I will tell you how to make an
        efficient portfolio to get your desired return by combining stocks with your portfolio.
        All you have to say is i need help with my portfolio.`;
        //welcome screen message
        let displayText = "Welcome to Investacito"
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, displayText)
            .getResponse();
    }
};

//implement custom handlers

const ExpectedReturnIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'expectedReturn'
  },
  handle(handlerInput) {
    let speechText = '';
    let displayText = '';
    let intent = handlerInput.requestEnvelope.request.intent;
    let wantedReturn = intent.slots.wantedReturn.value;
    let currentReturn = intent.slots.currentReturn.value;
    let stockReturn = intent.slots.stockReturn.value;

    if ( wantedReturn && currentReturn && stockReturn) {
      //Perform operation
      let x = (parseInt(wantedReturn) - parseInt(stockReturn))/(parseInt(currentReturn) - parseInt(stockReturn));

      if(x>1) {
        let value1 = x*100;
        let value2 = (1-x)*100;
        speechText = `For every 100 dollars, invest ${value1} dollars in your current portfolio
                      and short ${value2} dollars worth of the second stock`;
        displayText = `For every 100 dollars, invest ${value1} dollars in your current portfolio
                      and short ${value2} dollars worth of the second stock`;
      } else if (x<0) {
        let value1 = x*100;
        let value2 = (1-x)*100;
        speechText = `For every 100 dollars, short ${value1} dollars worth of your current portfolio
                      and invest ${value2} dollars in the second stock`;
        displayText = `For every 100 dollars, short ${value1} dollars worth of your current portfolio
                       and invest ${value2} dollars in the second stock`;
      } else {
        let value1 = x*100;
        let value2 = (1-x)*100;
        speechText = `For every 100 dollars, invest ${value1} dollars in your current portfolio
                      and invest ${value2} dollars in the second stock`;
        displayText = `For every 100 dollars, invest ${value1} dollars in your current portfolio
                       and invest ${value2} dollars in the second stock`;
      }

      return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(appName, displayText)
      .withShouldEndSession(true)
      .getResponse();


    } else {
      //Ask for the required input
      return handlerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse();

    }

  }
};

//end Custom handlers

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        //help text for your skill
        let speechText = `You can say the return I want is 30%, My current
        portfolio gives me a return of 20% and the stock I want to invest in has a return of 40% and
        I'll tell you the ratio of your investments. Or you can just say I need help with my portfolio`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        let speechText = 'Thanks for summoning Investacito.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

//Lambda handler function
//Remember to add custom request handlers here
exports.handler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(LaunchRequestHandler,
                         ExpectedReturnIntentHandler,
                         HelpIntentHandler,
                         CancelAndStopIntentHandler,
                         SessionEndedRequestHandler).lambda();
