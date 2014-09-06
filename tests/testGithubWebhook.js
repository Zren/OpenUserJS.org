var request = require('request');

var payload = require('./fixtures/githubWebhookPayload.json');

request.post({
  url: 'http://localhost:8080/github/hook',
  headers: {
    'User-Agent': 'GitHub-Hookshot/5c8714b',
    'X-GitHub-Delivery': '3e516c02-26f0-11e4-837d-66ca7aa9c2f7',
    'X-GitHub-Event': 'push'
  },
  form: { payload: JSON.stringify(payload) }
}, function (err, response, body) {
  if (err)
    return console.error(err);
  console.log(response.statusCode);
  if (body)
    console.log(body);
});
