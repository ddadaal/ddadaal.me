CO_REF="git.coding.net/viccrubs/viccrubs.coding.me.git"

cd ./public
git init
git config user.name "viccrubs"
git config user.email "smallda@outlook.com"
git add .
git commit -m "Update Blog By TravisCI With Build $TRAVIS_BUILD_NUMBER"
# Coding Pages
git push --force --quiet "https://viccrubs:${CODINGNET_TOKEN}@${CO_REF}" master:master
