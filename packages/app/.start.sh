#!/bin/bash

# Create ENV if not exists
if [ ! -f ./.env ]; then
    yarn env:create
fi

sudo yarn dev
