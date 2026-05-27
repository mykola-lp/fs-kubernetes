## Setup

This directory contains the `todo app` service and the Kubernetes resources
used to run it in the cluster.

**Run locally**

```bash
node the_project/todo-app/index.js
```

**Build image**

```bash
docker build -t todo-app:1.2 the_project/todo-app
```

**Deploy**

```bash
k3d image import todo-app:1.2 -c k3s-default

kubectl apply -f the_project/todo-app/manifests/
kubectl get pods
kubectl logs deployment/todo-app
```

## Exercises

### 1.2 The project, step 1

Create a web server that outputs `Server started in port NNNN` when it is
started and deploy it into your Kubernetes cluster.

The used port must be configurable through the `PORT` environment variable.

You will not have access to the port when it is running in Kubernetes yet.
The networking configuration will be added in later exercises.

As an answer, give the link to the GitHub release that corresponds to the
exercise.

**Output:**

```text
$ kubectl logs deployment/todo-app
Server started: http://localhost:3000/
```
