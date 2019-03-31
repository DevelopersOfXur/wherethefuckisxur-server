# wherethefuckisxur-server
---
### Note:
wherethefuckisxur-script and -server accomplishes two different things. -script talks to Bungie API and writes data into storage/, while -server uses the data and renders the website. [Check out the -script repository for more information](https://gitlab.com/kingsofxur/wherethefuckisxur-server).

# Getting Started
This project requires node.js, so figure out how to install that if you haven't already.
First, clone yourself a version of this repository.

    git clone https://gitlab.com/kingsofxur/wherethefuckisxur-server.git
    
Inside the repo, run `npm i` to install all required node packages.

    npm i
    
To run the server with test data, simply do

    npm run testdata
    
and open a browser to localhost:8000, you should be able to load up the website running test data.

##### Running with your own data.
If you've already collected data using -script, and have another directory containing data, you can tell the server to use that directory for data instead of the test data.

    npm start -- --data relative/path/to/data

Yes, the extra `--` is necessary, it's just special npm syntax. Note that there are some special shortcut commands that assumes your data directory. `npm start` will look for `storage/` inside current directory, and `npm run sandbox` will look for `../wherethefuckisxur-script/storage/`