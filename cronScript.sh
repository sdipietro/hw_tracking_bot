#!/bin/bash

now=$(date)
echo "$now" >> ~/Desktop/hw_tracking_bot/output.txt

~/.nvm/versions/node/v16.19.0/bin/node ~/Desktop/hw_tracking_bot/attendance_bot.js >> ~/Desktop/hw_tracking_bot/output.txt

echo 'End' >> ~/Desktop/hw_tracking_bot/output.txt
echo '' >> ~/Desktop/hw_tracking_bot/output.txt