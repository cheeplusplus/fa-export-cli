# FA Exporter CLI

This is a CLI application to dump your FA gallery while the site is still alive. It uses [fa.js](https://github.com/cheeplusplus/fa.js) to talk to FA. It's all local, nothing leaves your machine (except to FA, obv)

## User guide

### Installation

Requires node 18 or higher. Eventually I'll get the prebuilt images working.

* Install node
* Check out this repo
* Run `npm install`
* Run `npm run build`

### Running

* Create a file called `settings.json` based on `settings.sample.json`. Grab your FA cookies out of your FA browser session and put it in the `cookies` key. They should look like this: `a=asdf; b=asdf; s=1`
* Run `npm start archive user <YOUR USERNAME>` to archive your user account.

## Dev TODO

Eventually (sooner than later) I'd like to get this building single application images (see the `build-X.sh` files) but that requires more work like setting up GHA and maybe code signing???
The scripts DO work (well the Windows one does) but I'm not confident enough in trying to distribute prebuilt executables
This is good enough for a v0.1
