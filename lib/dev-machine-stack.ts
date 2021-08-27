import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cloudwatch_actions from '@aws-cdk/aws-cloudwatch-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda_nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import { userData } from './user-data';

export class DevMachineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    if (props.env === undefined || props.env.account === undefined || props.env.region === undefined) {
      throw new Error('Error: props.env, props.env.account and props.env.region are all required');
    }

    // Create the instance.
    const instance = new ec2.Instance(this, 'instance', {
      keyName: 'dev-machine',
      vpc: ec2.Vpc.fromLookup(this, 'vpc', {
        vpcId: 'vpc-1e217c79'
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-southeast-2': 'ami-0567f647e75c7bc05'
      }),
      userData: ec2.UserData.custom(userData()),
      role: new iam.Role(this, 'role', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromManagedPolicyArn(this, 'smm-access', 'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore')
        ]
      })
    });

    // Create the shutdown function.
    const shutdownFunction = new lambda_nodejs.NodejsFunction(this, 'shutdown',{
      environment: {
        'INSTANCE_ID': instance.instanceId
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: [
            'ec2:StopInstances'
          ],
          resources: [
            `arn:aws:ec2:${props.env.region}:${props.env.account}:instance/${instance.instanceId}`
          ]
        })
      ]
    });

    // Create the shutdown topic.
    const topic = new sns.Topic(this, 'topic');
    topic.addSubscription(new subscriptions.LambdaSubscription(shutdownFunction));

    // Create the shutdown alarm.
    const alarm = new cloudwatch.Alarm(this, 'alarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: 'NetworkOut',
        dimensionsMap: {
          InstanceId: instance.instanceId
        }
      }).with({
        period: cdk.Duration.minutes(15),
        statistic: cloudwatch.Statistic.SUM,
      }),
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      threshold: 300000,
      evaluationPeriods: 1,
    });

    // Attach the topic to the alarm.
    alarm.addAlarmAction(new cloudwatch_actions.SnsAction(topic));

    // Output the instance id.
    new cdk.CfnOutput(this, 'instance-id', {
      value: instance.instanceId
    });
  }
}
