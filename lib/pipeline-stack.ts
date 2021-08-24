import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import { DevMachineApplication } from './dev-machine-application';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'pipeline', {
      synth: new pipelines.ShellStep('synth', {
        input: pipelines.CodePipelineSource.gitHub('strongishllama/dev-machine', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      })
    });

    pipeline.addStage(new DevMachineApplication(this, 'prod', {
      env: props.env
    }));
  }
}
