const octokit = require('@octokit/rest')()
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const appId = 14518 //app id from setup
const pem = fs.readFileSync('sample-applet.2018-07-09.private-key.pem')


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

async function postIssueComment(installationId, organization, repository, number, action) {
  await octokit.authenticate({
    type: 'app',
    token: generateJwtToken(),
  });

  const { data: { token } } = await octokit.apps.createInstallationToken({
    installation_id: installationId,
  });

  octokit.authenticate({ type: 'token', token });

  var result = await octokit.issues.createComment({
      owner: organization,
      repo: repository,
      number: number,
      body: `Updated Function from Channel All Hands demo for action ${action}`
  })
  return result
}

module.exports = async function(context) {
  const stringBody = JSON.stringify(context.request.body);
  const body = JSON.parse(stringBody);
  const action = body.action;
  const number = body.issue.number;
  const repository = body.repository.name
  const organization = body.organization.login
  const installationId = body.installation.id //get from webhook payload

  try {
    var response = "";
    if (action === "opened") {
      response = await postIssueComment(installationId, organization, repository, number, action);
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