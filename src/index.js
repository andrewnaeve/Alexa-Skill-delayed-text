'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const phoneNumber = '+19095529597';
const questions = require('./questions.json');
const sns = new AWS.SNS();

let recipient;
let message;
let time;

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);

    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('AskRecipientIntent');
    },

    'AskRecipientIntent': function () {
        this.emit(':ask', questions.askForRecipient, questions.askForRecipient);
    },

    'ToIntent': function () {
        recipient = this.event.request.intent.slots.Recipient.value;
        this.emit(':ask', `i heard ${recipient}. ${questions.askForMessage}`, questions.askForMessage);
    },

    'MessageIntent': function () {
        message = this.event.request.intent.slots.Message.value;
        this.emit(':ask', `${message}. Is this correct. ${questions.askForTime}`, questions.askForTime);
    },

    'TimeIntent': function () {
        time = this.event.request.intent.slots.Time.value;
        console.log('Message: ', message);
        const textMsg = {
            Message: message,
            PhoneNumber: phoneNumber
        };
        console.log('Setting region');
        AWS.config.update({region: 'us-east-1'});
        console.log('Set region success');
        sns.publish(textMsg, (err, data) => {
            if (err) console.log('Error sending text: ', err);
            console.log('Data: ', data);
        });
        this.emit(':tell', `Sending message to ${recipient} at ${time}`);

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

