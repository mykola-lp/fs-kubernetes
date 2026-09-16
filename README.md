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