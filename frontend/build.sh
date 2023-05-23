#!/bin/bash

# build the Nuxt site
npm run build

# add our functions
mkdir dist/functions
cp test.js dist/functions.js
