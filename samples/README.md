## Requirements

Read more about [Fission](https://fission.io) first and ensure you have a working setup.

## Instructions

### Create your GitHub App

See https://developer.github.com/apps/building-github-apps/creating-a-github-app for details.
Take note of your App ID and generate a private key (download of a .pem file will start). 

### Create secrets
Substitute the values for your app ID and path to the pem file in this line and run in your terminal:

```
kubectl -n default create secret generic gh-applets --from-literal=GH_PEM_KEY="$(cat ./path/to/sample-private-key.pem)" --from-literal=GH_APP_ID=123456
```

### Docker
Let's build our `github/hubotjs` container.

* `minikube start` if not already running
* `eval $(minikube docker-env) && docker build --no-cache -t github/hubotjs .`

### Run our issue comment example

* `cd ../samples`
* `fission spec apply --wait`

* setup NGROK to point to the fission ROUTER URL
  * `minikube service list`
  * `ngrok http [LOCAL_ROUTER_IP:PORT]`
  * NOTE: each time you restart ngrok the URL will change so you'll need to update the GitHub App settings
* change the webhook url in your GitHub App to be your NGROK url + `/gh/applets/issue-comment`
* Create a new issue in the repo you installed the GitHub App into and see if the function is executed
  * `fission fn logs --name issue-comment`

If you make any changes to the fission function, reload them like so:
* `fission spec apply --wait`
