#!/bin/bash

DEST_PATH=demo/src/assets
DEST_FINAL_PATH=dist/prebuilt-themes/
INPUT_PATH=$DEST_PATH/custom-themes/


echo Building custom theme scss files.

# Get the files
FILES=$(find demo/src/assets/custom-themes -name "*.scss")

for FILE in $FILES
do
  FILENAME=${FILE#$INPUT_PATH}
  BASENAME=${FILENAME%.scss}
  $(npm bin)/node-sass $FILE > $DEST_PATH/$BASENAME.css
done
cp -R $DEST_PATH $DEST_FINAL_PATH

echo Finished building CSS.
