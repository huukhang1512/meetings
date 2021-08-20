#!/bin/bash

set -e

cd /github/workspace/frontend
npm install 
npm run build

cd /github/workspace/backend
npm install --save-dev serverless-finch
npm install --save-dev serverless-prune-plugin
serverless plugin install --name serverless-python-requirements
serverless config --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_ACCESS_KEY

# deploy backend
serverless deploy --verbose

# deploy front end 
serverless client deploy --no-confirm
