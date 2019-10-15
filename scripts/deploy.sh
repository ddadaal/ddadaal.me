#!/bin/sh
CO_REF="git.coding.net/viccrubs/viccrubs.coding.me.git"
GITHUB_REF="github.com/daacheen/daacheen.me.github.io"
FQDN="daacheen.me"

cd ./public
echo "pages.$FQDN" > CNAME
git init
git config user.name "daacheen-deploy-bot"
git config user.email "daacheen@outlook.com"
git add .
git commit -m "Update By GitHub Actions to commit $(echo $GITHUB_SHA | head -c 6)"

# Coding Pages
echo "[deploy bot] Deploying to Coding.NET..."
git push --force --quiet "https://dt_LaxAU3:${CODINGNET_TOKEN}@${CO_REF}" master:master

# GitHub Pages
echo "[deploy bot] Deploying to GitHub Pages..."
git push --force --quiet "https://daacheen:${ACTIONS_TOKEN}@${GITHUB_REF}" master:master
