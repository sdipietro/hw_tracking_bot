#!/bin/bash

cd ~/Downloads
mkdir Assessments
cd Assessments

wget $1 -O ~/Downloads/Assessments/$2.zip

unzip -d ~/Downloads/Assessments/$2 $2.zip

cd $2

# cd -- "$(find / -name assessment_1.rb -type f -printf '%h' -quit)"
