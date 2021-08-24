import * as cdk from '@aws-cdk/core';
import { DevMachineStack } from './dev-machine-stack';

export class DevMachineApplication extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);

    new DevMachineStack(this, 'dev-machine', {
      env: props.env
    });
  }
}
