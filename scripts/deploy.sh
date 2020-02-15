#!/bin/sh
CO_REF="e.coding.net/viccrubs/viccrubs.coding.me.git"
GITHUB_REF="github.com/ddadaal/ddadaal.me.github.io"
FQDN="ddadaal.me"

cd ./public
echo "pages.$FQDN" > CNAME
git init
git config user.name "ddadaal-deploy-bot"
git config user.email "ddadaal@outlook.com"
git add .
git commit -m "Update By GitHub Actions to commit $(echo $GITHUB_SHA | head -c 6)"

# Coding Pages
echo "[deploy bot] Deploying to Coding.NET..."
git push --force --quiet "https://${CODINGNET_USERNAME}:${CODINGNET_TOKEN}@${CO_REF}" master:master

# GitHub Pages
echo "[deploy bot] Deploying to GitHub Pages..."
git push --force --quiet "https://ddadaal:${ACTIONS_TOKEN}@${GITHUB_REF}" master:master
