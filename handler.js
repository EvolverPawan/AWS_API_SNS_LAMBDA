'use strict';
const AWS = require('aws-sdk')
const sns = new AWS.SNS()
const TOPIC_NAME = process.env.TOPIC_NAME
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};


module.exports.eventProducer = (event, context, callback) => {
  const functionArnCols = context.invokedFunctionArn.split(':')
  const region = functionArnCols[3]
  const accountId = functionArnCols[4]
  const topicName = 'dispatcher'
  // const topicArn = `arn:aws:sns:${region}:${accountId}:${topicName}`
  // const accountId = process.env.ACCOUNT_ID;

  const params = {
    Message: `msg sent`,
    TopicArn: `arn:aws:sns:${region}:${accountId}:${TOPIC_NAME}`
  }

  sns.publish(params, (error, data) => {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: ` Message successfully published to SNS topic "${TOPIC_NAME}"`
      }),
    })
  });
};

module.exports.eventConsumer = (event, context, callback) => {
  // print out the event information on the console (so that we can see it in the CloudWatch logs)
  console.log(`I'm triggered by "eventProducer" through the SNS topic "${TOPIC_NAME}"`);
  console.log(`event:\n${JSON.stringify(event, null, 2)}`);
  if(event.Records[0].Sns.Message == 'msg sent'){
      console.log('successs in event');

  }else{
      console.log('successs not found event');
  }
  callback(null, { event });
};
