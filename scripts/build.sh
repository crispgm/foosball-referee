#!/usr/bin/env bash

mkdir docs
cp -r src/* docs/
cp -r assets docs/

sed -i 's/src="\/app.js"/src="\/referee\/app.js"/g' docs/index.html
sed -i 's/<link href="\/assets\/css\/style.css" rel="stylesheet">/<link href="\/referee\/assets\/css\/style.css" rel="stylesheet">/g' docs/index.html
