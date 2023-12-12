#!/bin/bash

database="genus-db"
branch="dev"
deploy_request_number=$1

if [[ -z $deploy_request_number ]]
then
  echo "Usage: $0 <deploy-request-number>"
  echo "Missing argument for 'deploy_request_number'"
  exit 1
fi

pscale org switch genus

pscale deploy-request create $database $branch

sleep 10

pscale deploy-request deploy $database $deploy_request_number
