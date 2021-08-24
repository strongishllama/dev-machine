#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
new PipelineStack(app, 'pipeline-stack', {
  env: {
    account: '320045747480',
    region: 'ap-southeast-2'
  }
});
