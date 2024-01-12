#!/bin/bash

update_env () {
    if [ ! -f ./.env ];
    then
         echo "$(tput setaf 1)The env file need to exists first!$(tput sgr0)"
    else
        gh variable set ENV --body $(cat .env |  tr '\n' ';')
    fi
}

if [ "$CI" == "true" ];
then
    update_env
else
    if command -v gh &>/dev/null;
    then
        update_env
        echo "$(tput setaf 2)ENV file was updated!$(tput sgr0)"
    else
        echo "$(tput setaf 1)Github Cli could not be found!$(tput sgr0)"
    fi
fi
