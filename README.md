# FA Exporter CLI

This is a CLI application to dump your FA gallery while the site is still alive. It uses [fa.js](https://github.com/cheeplusplus/fa.js) to talk to FA. It's all local, nothing leaves your machine (except to FA, obv)

## User guide

### Friendly installation

Grab the latest release for your platform from [Releases](https://github.com/cheeplusplus/fa-export-cli/releases). MacOS support eventually.

### Running

* Create a file called `settings.json` based on `settings.sample.json`. Grab your FA cookies out of your FA browser session and put it in the `cookies` key. They should look like this: `a=asdf; b=asdf; s=1`
* Run `./fa-export-cli.exe archive user <YOUR USERNAME>` to archive your user account. (or platform equivilent)

## Development

Requires node 18 or higher.

* Install node
* Check out this repo
* Run `npm install`
* Run `npm run build`
* Use `npm start` to go
