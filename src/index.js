'use strict';

const Alexa = require('alexa-sdk');

const questions = require('./questions.json');

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);

    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('AskIntent');
    },
    'AskIntent': function () {
        this.emit(':ask', questions.askForRecipient, questions.askForRecipient);
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'you can schedule a message by saying schedule message.', 'try again');
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye');
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye');
    }
};

