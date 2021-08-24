import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as DevMachine from '../lib/dev-machine-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new DevMachine.DevMachineStack(app, 'MyTestStack', {
      env: {
        account: '',
        region: ''
      }
    });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
