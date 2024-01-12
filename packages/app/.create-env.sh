#!/bin/bash

create_env () {
    gh variable list | grep ENV | tr ';' '\n' | sed -e "s/ENV//; s/[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}T[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}Z//g" > .env
}

if [ "$CI" == "true" ];
then
    create_env
else
    if command -v gh &>/dev/null;
    then
        create_env
        echo "$(tput setaf 2)ENV file was created!$(tput sgr0)"
    else
        echo "$(tput setaf 1)Github Cli could not be found$(tput sgr0)"
    fi
fi
