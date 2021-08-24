import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { DevMachineApplication } from './dev-machine-application';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'pipeline', {
      synth: new pipelines.ShellStep('synth', {
        input: pipelines.CodePipelineSource.gitHub('strongishllama/dev-machine', 'main', {
          authentication: secretsmanager.Secret.fromSecretCompleteArn(this, 'secret', 'arn:aws:secretsmanager:ap-southeast-2:320045747480:secret:GithubPersonalAccessToken-ko08in').secretValue
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      }),
      dockerEnabledForSynth: true
    });

    pipeline.addStage(new DevMachineApplication(this, 'prod', {
      env: props.env
    }));
  }
}
