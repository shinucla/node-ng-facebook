# nodejs-template

1 Installing Git for Linux
  sudo apt-get install git

2 Configuring GitHub
  git config --global user.name "user_name"
  git config --global user.email "email_id"

3 Creating a local repository
  At parent folder type: git init nodejs-express-auth to create the project folder

4 Creating a README file to describe the repository
  Inside project folder, create a README file,
  git add README

5 Committing changes made to the index
  git commit -m "some_message"

6 Creating a repository on GitHub
  git remote add origin https://github.com/user_name/nodejs-express-auth.git

7 Pushing files in local repository to GitHub repository
  git push origin master

8 pull the changes:
  git pull origin master
  
  
====================================================
Working with emacs
1 Download git.el and save it under ~/.emacs.d/

2 Edit ~/.emacs file:
  (add-to-list 'load-path "~/.emacs.d")
  (require 'git)

====================================================
Working with node.js npm
1 create package.json for the project
2 sudo mkdir /home/[xxxx]/tmp
3 sudo npm cache clear
4 npm install 


====================================================
Working with nodemon
1 sudo npm install -g nodemon
2 sudo nodemon app.js to start nodemon
3 sudo PORT=9090 nodemon app.js to start nodemon at port 9090


====================================================
Working with additional tools
1 sudo apt-get install graphicsmagick


