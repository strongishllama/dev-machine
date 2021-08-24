import * as sdk from 'aws-sdk';
import { CloudWatchLogsEvent, CloudWatchLogsHandler, Context } from 'aws-lambda';

export const handler: CloudWatchLogsHandler = async (event: CloudWatchLogsEvent, context: Context) => {
  if (process.env.INSTANCE_ID === undefined || process.env.INSTANCE_ID === '') {
    console.error("'INSTANCE_ID' environment variable not defined");
    return;
  }

  const ec2 = new sdk.EC2();

  try {
    const data = await ec2.stopInstances({ InstanceIds: [process.env.INSTANCE_ID] }).promise();
    console.log(data);
  } catch (err) {
    console.error(`Failed to shutdown instance with id ${process.env.INSTANCE_ID}: ${err}`);
  }
};
