@echo off
echo %date% %time% > import_sync.log
curl --get http://dashboard.perfitpharma.com/api/v1/import-sync >> import_sync.log
timeout /t 21600
%0
