# fs-kubernetes

Kubernetes course (University of Helsinki)

## Prerequisites

**Verify that the required tools are installed:**

```bash
# Check the installed Docker version
docker --version

# Check the installed kubectl client version
kubectl version --client

# Check the installed k3d version
k3d version
```
**Create a local Kubernetes cluster with k3d (2 agent nodes):**
 
```bash
k3d cluster create -a 2
```

## Debugging

Kubernetes heals itself most of the time — if a pod dies, it usually just comes back on its own. But when it's own config that's broken, I need to dig in myself.

Go-to commands, in order:

- `kubectl describe <resource>` — shows the full state of a Deployment/Pod, and the `Events` section at the bottom is where errors actually show up.
- `kubectl logs <pod-name>` — is the app itself actually doing what it's supposed to?
- `kubectl delete <resource>` — managed by a Deployment, a new one spins up automatically, so this is a safe way to force a restart.

**Example, checking a deployment:**

```bash
kubectl describe deployment log-output-dep
```

**Example, checking a pod (events at the bottom are the important part):**

```bash
kubectl describe pod <pod-name>
```

**Example, checking logs:**

```bash
kubectl logs <pod-name>
```

**Also** [Lens](https://k8slens.dev/) for a visual dashboard instead of digging through kubectl output. It requires a login — [Freelens](https://github.com/freelensapp/freelens) is the free/open-source fork without that requirement.

## Storage

**emptyDir** — a shared folder inside a single pod, used to pass files between two containers running together (like `writer`/`reader` in 1.10). It only exists as long as the pod exists — if the pod restarts or gets deleted, the data is gone and starts fresh. Good for temporary sharing, not for anything that needs to survive.

**PersistentVolume (PV) + PersistentVolumeClaim (PVC)** — storage that lives independently of any pod. A PV represents actual disk space (e.g. a folder on a cluster node), a PVC is how a pod "claims" that storage for its own use. Since the data isn't tied to the pod's lifecycle, it survives pod restarts, deletions, and recreations. Use this whenever data actually needs to persist.

## Chapter 1.

**DOESN'T** contain an actual coding exercise. It is an introductory chapter meant to familiarize yourself with the course material and rules, followed by a short check where you need to select the correct statements about the course.

## Chapter 2.

<details>
<summary>1.1 Getting started</summary>

**Exercises can be done with any language and framework you want.**

Create an application that generates a random string on startup, stores this string into memory, and outputs it every 5 seconds with a timestamp. e.g.

```
2020-03-30T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43
2020-03-30T12:15:22.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43
```

Deploy it into your Kubernetes cluster and confirm that it's running with `kubectl logs ...`

You will keep building this application in future exercises. This application will be called **Log output**.

As an answer, give the link to the GitHub release that corresponds to the exercise.

* See [here for more info on their requirements for](https://courses.mooc.fi/org/uh-cs/courses/devops-with-kubernetes/chapter-1) your submission repository.
* For the example submission repository, the link is https://github.com/mluukkai/KubernetesSubmissions/tree/1.1

**Release:** [tag 1.1](https://github.com/mykola-lp/fs-kubernetes/tree/1.1/log_output)

</details>

<details>
<summary>1.2 The project, step 1</summary>

**Let's get started!**
 
Create a web server that outputs "Server started in port NNNN" when it is started and deploy it into your Kubernetes cluster. Please make it so that an environment variable PORT can be used to choose the used port. You may call the server todo app since it will, amongst other things, provide the functionality of a todo application pretty soon.
 
You will not have access to the port when it is running in Kubernetes yet. We will configure the access when we get to networking.
 
As an answer, give the link to the GitHub release that corresponds to the exercise.
 
**Release:** [tag 1.2](https://github.com/mykola-lp/fs-kubernetes/tree/1.2/todo_app)
 
</details>

<details>
<summary>1.3 Declarative approach</summary>

In your "Log output" application create a folder for manifests and move your deployment into a declarative file.

Make sure everything still works by restarting and following logs.

As an answer, give the link to the GitHub release that corresponds to the exercise.

**Release:** [tag 1.3](https://github.com/mykola-lp/fs-kubernetes/tree/1.3/log_output)

</details>

<details>
<summary>1.4 The project, step2</summary>

Create a deployment.yaml for the course project (that you started in Exercise 1.2.)

You won't have access to the port yet but that'll come soon.

As an answer, give the link to the GitHub release that corresponds to the exercise.

**Release:** [tag 1.4](https://github.com/mykola-lp/fs-kubernetes/tree/1.4/todo_app)

</details>

<details>
<summary>1.5 The project, step 3</summary>

Make the project respond something to a GET request sent to the / url of the project. A simple HTML page is good, or you can deploy something more complex, like a single-page application.

See [here](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) how you can define environment variables for containers.

Use `kubectl port-forward` to confirm that the project is accessible and works in the cluster by using a browser to access the project.

**Release:** [tag 1.5](https://github.com/mykola-lp/fs-kubernetes/tree/1.5/todo_app)

</details>

<details>
<summary>1.6 The project, step 4</summary>

Use a NodePort Service to enable access to the project.

**Release:** [tag 1.6](https://github.com/mykola-lp/fs-kubernetes/tree/1.6/todo_app)

</details>

<details>
<summary>1.7 External access with Ingress</summary>

"Log output" application currently outputs a timestamp and a random string (that it creates on startup) to the logs.

Add an endpoint to request the current status (timestamp and the random string) and an Ingress so that you can access it with a browser.

You can just store the random string to the memory.

**Release:** [tag 1.7](https://github.com/mykola-lp/fs-kubernetes/tree/1.7/log_output)

</details>

<details>
<summary>1.8 The project, step 5</summary>

Switch to using Ingress instead of NodePort to access the project. You can delete the Ingress of the "Log output" application so they don't interfere with this exercise. We'll look more into paths and routing in the next exercise, and at that point, you can configure the project to run with the "Log output" application side by side.

**Release:** [tag 1.8](https://github.com/mykola-lp/fs-kubernetes/tree/1.8/todo_app)

</details>

<details>
<summary>1.9 More services</summary>

Develop a second application that simply responds with "pong 0" to a GET request and increases a counter (the 0) so that you can see how many requests have been sent. The counter should be in memory so it may reset at some point.

Create a new deployment for it and have it share ingress with "Log output" application. Route requests directed '/pingpong' to it.

In future exercises, this second application will be referred to as "ping-pong application". It will be used with "Log output" application.

**Release:** [tag 1.9](https://github.com/mykola-lp/fs-kubernetes/tree/1.9/pingpong)

</details>

<details>
<summary>1.10 Even more services</summary>

Split the "Log output" application into two different containers within a single pod:

* One generates a random string on startup and writes a line with the random string and timestamp every 5 seconds into a file.
* The other reads that file and provides the content in the HTTP GET endpoint for the user to see

**Release:** [tag 1.10](https://github.com/mykola-lp/fs-kubernetes/tree/1.10/log_output)

</details>

<details>
<summary>1.11 Persisting data</summary>

Let's share data between "Ping-pong" and "Log output" applications using persistent volumes. Create both a PersistentVolume and PersistentVolumeClaim and alter the Deployment to utilize it. As PersistentVolumes are often maintained by cluster administrators rather than developers and those are not application specific you should keep the definition for those separated, perhaps in own folder.

Save the number of requests to the "Ping-pong" application into a file in the volume and output it with the timestamp and the random string when sending a request to our "Log output" application.

**Release:** [tag 1.11](https://github.com/mykola-lp/fs-kubernetes/tree/1.11)

</details>

<details>
<summary>1.12 The project, step 6</summary>

Since the project looks a bit boring right now, let's add a picture!

The goal is to add an hourly image to the project. Get a random picture from Lorem Picsum like `https://picsum.photos/1200` and display it in the project. Find a way to store the image so it stays the same for 10 minutes.

Make sure to cache the image into a persistent volume so that the API isn't needed for new images every time we access the application or the container crashes.

The best way to test what happens when your container shuts down is likely by shutting down the container, so you can add logic for that as well, for testing purposes.

**Release:** [tag 1.12](https://github.com/mykola-lp/fs-kubernetes/tree/1.12/todo_app)

</details>