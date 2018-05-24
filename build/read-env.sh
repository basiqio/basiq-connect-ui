#!/bin/sh

bucketName=$(aws cloudformation list-exports --output json --no-paginate --query "Exports[?(Name=='basiq-blink-s3-bucket')].{name:Name, value:Value}")
echo $bucketName > build/build-conf.json