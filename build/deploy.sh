#!/bin/bash

export Bucket=`aws cloudformation list-exports --output text --query "Exports[?(Name=='basiq-blink-s3-bucket')].Value"`
aws s3 sync dist s3://$Bucket/v1/ --acl public-read
