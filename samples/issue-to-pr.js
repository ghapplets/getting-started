const octokit = require('@octokit/rest')()
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const appId = 14518 //app id from setup
const pem = fs.readFileSync('sample-applet.2018-07-09.private-key.pem')
const re = /^\w+\s#?\d*/i


function generateJwtToken() {
  // Sign with RSA SHA256
  return jsonwebtoken.sign(
    {
      iat: Math.floor(new Date() / 1000),
      exp: Math.floor(new Date() / 1000) + 60,
      iss: appId,
    },
    pem,
    { algorithm: 'RS256' },
  );
}

async function convertIssueToPR(installationId, owner, repository, issue_no, head) {
  await octokit.authenticate({
    type: 'app',
    token: generateJwtToken(),
  });

  const { data: { token } } = await octokit.apps.createInstallationToken({
    installation_id: installationId,
  });

  octokit.authenticate({ type: 'token', token });

  console.log(`issue_no = ${issue_no}`);

  var result = await octokit.pullRequests.createFromIssue({
      owner:  owner,
      repo:   repository,
      issue:  issue_no,
      head:   head,
      base:   "master"
  });

  return result
}

module.exports = async function(context) {
  const stringBody = JSON.stringify(context.request.body);
  const body = JSON.parse(stringBody);
  const head = body.ref;
  const owner = body.repository.owner.name;
  const repository = body.repository.name
  const message = body.commits[0].message.match(re);
  const installationId = body.installation.id //get from webhook payload
  var issue_no = 0;

  try {
    var response = "";
    if ((message !== null) && (message[0].toLowerCase().startsWith("converts"))) {
      issue_no = message[0].substring(message[0].indexOf("#") + 1);
      response = await convertIssueToPR(installationId, owner, repository, issue_no, head)
    } else {
      console.log("message WAS null");
    }

    return {
        status: 200,
        body: {
          text: response
        },
        headers: {
          'Content-Type': 'application/json'
        }
    }
  } catch (e) {
    return {
        status: 500,
        body: e
    };
  }
}
