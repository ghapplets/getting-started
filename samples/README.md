## Requirements

Read more about [Fission](https://fission.io) first and ensure you have a working setup.

## Instructions

### Create your GitHub App

Create a GitHub App by specifying the following:
- Homepage URL: http://9560d9c6.ngrok.io
- Webhook URL: http://9560d9c6.ngrok.io/gh/applets/issue-comment

Most of the samples should only require Issues, Repository contents R&W permissions. Note they can't be changed after creation (requires the creation of a new app).

Take note of your App ID and generate a private key (download of a .pem file will start). 
Install the app on your repository of choice and from the installation settings page take note of your installation ID as shown in the URL bar (e.g. ?/settings/installations/XYZ).

> TODO: find a solution to automate grabbing installation id (e.g. Setup webhook -> store secret).

See https://developer.github.com/apps/building-github-apps/creating-a-github-app for more details.

### Create secrets
Create a copy of `hubotjs-environment/secrets.example.yaml` called `secrets.yaml`, e.g.:

```
cp hubotjs-environment/secrets.example.yaml hubotjs-environment/secrets.yaml
```
Please note: your `secrets.yaml` file is already added to `.gitignore`.

Substitute the values for your app (make sure you base64 encode them first!) and then run in your terminal:

```
kubectl create -f hubotjs-environment/secrets.yaml
```
Verify your secrets:

```
$ kubectl get secret gh-applets -o yaml

apiVersion: v1
data:
  GH_APP_ID: YOUR_BASE64_ENCODED_APP_ID
  GH_INST_ID: YOUR_BASE64_ENCODED_INSTALLATION_ID
  ...
```

### Updating secrets
In case you need to update a secret (e.g. your app ID has changed) you must delete and recreate:

```
kubectl -n default delete secret gh-applets
# now re-run the command to create all secrets
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
  * `ngrok http ${$(minikube service --url -n fission router)#*//}`
  * NOTE: each time you restart ngrok the URL will change so you'll need to update the GitHub App settings
* change the webhook url in your GitHub App to be your NGROK url + `/gh/applets/issue-comment`
* Create a new issue in the repo you installed the GitHub App into and see if the function is executed
  * `fission fn logs --name issue-comment`

If you make any changes to the fission function, reload them like so:
* `fission spec apply --wait`
