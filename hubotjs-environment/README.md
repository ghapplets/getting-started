## Requirements

Read more about [Fission](https://fission.io) first and ensure you have a working setup.
TODO link to top-level README.

## Instructions

* create your GitHub App settings (TODO detailed instructions)
* `cd hubotjs-environment`
* `copy` you PEM file you downloaded from creating your own GitHub App into this folder
* in the `Dockerfile`, replace the PEM file with the one you downloaded
* `build` the Docker image
  * `minikube start` if not already running
  * `eval $(minikube docker-env) && docker build --no-cache -t github/hubotjs .`
* run the Docker image
  * `eval $(minikube docker-env) && docker run github/hubotjs .`
* `install` the fission environment
  * `fission env create --name hubotjs --image github/hubotjs`
* `cd ../samples`
* in the `issue-comment.js` file, replace:
  * `appId` with the GitHub App Id that you created
  * `pem` with the file you copied you into the Docker image
* install the function
  * `fission fn create --name issue-comment --env hubotjs --deploy issue-comment.js`
* create the route
  * `fission route create --method POST --url /gh/applets/issue-comment --function issue-comment`
* setup NGROK to point to the fission ROUTER URL
  * `minikube service list`
  * `ngrok http [LOCAL_ROUTER_IP:PORT]`
* change the webhook url in your GitHub App to be your NGROK url + `/gh/applets/issue-comment`
* Create a new issue in the repo you installed the GitHub App into and see if the function is executed
  * `fission fn logs --name issue-comment`
