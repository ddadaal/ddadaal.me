#!/bin/sh
CO_REF="e.coding.net/viccrubs/viccrubs.coding.me.git"
GITHUB_REF="github.com/ddadaal/ddadaal.me.github.io"
FQDN="ddadaal.me"

# Clone the existing repo
git clone --depth=1 "https://$GITHUB_REF" existing

# Copy the new built files into the existing repo and let git figure out the diffs
cp -r out/* existing/

cd ./existing
# echo "pages.$FQDN" > CNAME
echo "$FQDN" > CNAME
git config user.name "ddadaal-deploy-bot"
git config user.email "ddadaal@outlook.com"
git add .
git commit -m "Update By GitHub Actions to commit $(echo $GITHUB_SHA | head -c 6)"

# Coding Pages
# echo "[deploy bot] Deploying to Coding.NET..."
# git push --quiet "https://${CODINGNET_USERNAME}:${CODINGNET_TOKEN}@${CO_REF}" master:master

# GitHub Pages
echo "[deploy bot] Deploying to GitHub Pages..."
git push --quiet "https://ddadaal:${ACTIONS_TOKEN}@${GITHUB_REF}" master:master
