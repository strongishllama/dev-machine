# Dev Machine

The project contains the CDK infrastructure for my personal dev machine.
* At its core the dev machine is an EC2 instance that can be connected using the AWS CLI and the [Remote SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) Visual Studio Code plugin.
* Changes to the dev machine are deployed through a pipeline that leverages the [AWS CDK Pipelines](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/) module.
* The EC2 instance will be automatically shutdown by a Lambda function when network traffic out of the instance is low enough.
