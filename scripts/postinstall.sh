#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

read -p "Would you like gphotoweb to create a desktop shortcut?" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  sed "s|scriptLocation|$DIR|g" $DIR/starttemplate.sh > $DIR/startgphotoweb.sh
  sed "s|scriptLocation|$DIR|g" $DIR/gphotoweb.desktop > ~/Desktop/gphotoweb.desktop
  chmod +x $DIR/startgphotoweb.sh
  chmod +x ~/Desktop/gphotoweb.desktop
fi
