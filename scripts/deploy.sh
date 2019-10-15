#!/bin/bash
CO_REF="git.coding.net/viccrubs/viccrubs.coding.me.git"
GITHUB_REF="github.com/vicblog/vicblog.github.io"
FQDN="daacheen.me"

cd ./public
echo "pages.$FQDN" > CNAME
git init
git config user.name "daacheen-deploy-bot"
git config user.email "daacheen@outlook.com"
git add .
git commit -m "Update Blog By TravisCI With Build $TRAVIS_BUILD_NUMBER"

# Coding Pages
echo "[deploy bot] Deploying to Coding.NET..."
git push --force --quiet "https://viccrubs:${CODINGNET_TOKEN}@${CO_REF}" master:master

# GitHub Pages
echo "[deploy bot] Deploying to GitHub Pages..."
git push --force --quiet "https://daacheen:${GITHUB_TOKEN}@${GITHUB_REF}" master:master
