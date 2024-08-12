# FA Exporter CLI

This is a CLI application to dump an FA account's gallery and account data while the site is still alive. It uses [fa.js](https://github.com/cheeplusplus/fa.js) to talk to FA. It's all local, nothing leaves your machine (except to FA, obv)

## What's Dumped

- Galleries
- Submission metadata
- Journals
- A List of Follows/Followers
- Shouts
- Profile Information
- Scraps

## User guide

### Friendly installation

Grab the latest release for your platform from [Releases](https://github.com/cheeplusplus/fa-export-cli/releases).

You may experience issues on Windows and Mac due to code-signing (or a lack thereof).

### Running

* Create a file called `settings.json` based on `settings.sample.json`. Grab your FA cookies out of your FA browser session and put it in the `cookies` key. They should look like this: `a=asdf; b=asdf; s=1`
* Run `./fa-export-cli.exe archive user <YOUR USERNAME>` to archive your user account. (or platform equivilent)

### Getting Your Cookie

For most browsers, you can follow these steps to get your FA cookie to place in `settings.json`

1. Open your browser
2. Press F12 to open the browser dev tools
3. Select the "Network" tab
4. Log into or open FA
5. Select the bottom-most item in the Network Tab
6. On the right-side panel that opens select "Headers"
7. Under the heading of "Request Headers" find "Cookie" and copy that entire string not including "Cookie: "
8. Paste this into `settings.json` where indicated

If the bottom-most item in the Network list doesn't have "Cookie", look specifically for an entry where "File" is "/"


## Development

Requires node 18 or higher.

* Install node
* Check out this repo
* Run `npm install`
* Run `npm run build`
* Use `npm start` to go
