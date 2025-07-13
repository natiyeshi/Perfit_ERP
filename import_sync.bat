#!/bin/bash

while true; do
  echo "$(date)" > import_sync.log
  curl --get http://dashboard.perfitpharma.com/api/v1/import-sync >> import_sync.log
  sleep 21600  # sleep for 6 hours (60 * 60 * 6)
done
