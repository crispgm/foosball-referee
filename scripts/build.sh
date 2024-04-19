#!/usr/bin/env bash

mkdir docs
cp -r src/* docs/

sed -i 's/src="\/app.js"/src="\/foosball-referee\/app.js"/g' docs/index.html
sed -i 's/<link href="\/assets\/css\/style.css" rel="stylesheet">/<link href="\/foosball-referee\/assets\/css\/style.css" rel="stylesheet">/g' docs/index.html
sed -i 's/<link type=\"image\/x-icon\" href="\/assets\/images\/icon.png" rel="icon">/<link type=\"image\/x-icon\" href="\/foosball-referee\/assets\/images\/icon.png" rel="icon">/g' docs/index.html
sed -i 's/\/assets\/css/\/foosball-referee\/assets\/css/g' docs/assets/css/style.css
sed -i 's/\/assets\/css/\/foosball-referee\/assets\/css/g' docs/assets/css/themes/themes.css
