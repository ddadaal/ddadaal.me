#!/usr/bin/env bash
# Required environment variables:
# PAT: GitHub Personal Access Token
# user: GitHub username
# repo: Repository name
# CNAME: CNAME
# name: git name
# email: git email
# For deployment from local, create a 'localdeploy.sh' with the following command and gitignore will ignore it
# PAT={PAT} user={user} repo={repo} CNAME={CNAME} name={name} email={email} ./deploy.sh

currentTime=`date '+%Y-%m-%d %H:%M:%S'`
repoUrl="https://${PAT}:x-oauth-basic@github.com/${user}/${repo}.git"
cd ./public
echo $CNAME > ./CNAME

git init
git config user.name ${name}
git config user.email ${email}
git remote add origin ${repoUrl}
git add *
git commit -m "Deployment at ${currentTime}"
git push origin master -f

cd ../
echo "Deployment successful."
