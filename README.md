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

Kubernetes heals itself most of the time — if a pod dies, it usually just comes back on its own. But when the configuration or application is broken, I need to inspect the resources and test connectivity from inside the cluster.

**Go-to commands, in order:**

* `kubectl describe <resource>` — shows the current state of a Deployment/Pod. The `Events` section at the bottom is especially useful for configuration and scheduling errors.
* `kubectl logs <pod-name>` — shows the application output and helps determine whether the container itself is working as expected.
* `kubectl delete <resource>` — for resources managed by a Deployment, deleting a Pod forces Kubernetes to create a replacement and can be useful when testing restart/recovery behaviour.

**Examples:**

```bash
# Check a Deployment
kubectl describe deployment log-output-dep

# Check a Pod
kubectl describe pod <pod-name>

# Check container logs
kubectl logs <pod-name>
```

### **Temporary debug Pods**

For network debugging and testing connectivity between Services and Pods, a temporary debug Pod can be more convenient than entering an existing application container.

```bash
# Start a temporary Ubuntu Pod
kubectl run my-debug --image=ubuntu:24.04 -- sleep infinity

# Open a shell inside it
kubectl exec -it my-debug -- sh

# Example request from inside the cluster
curl http://localhost:8081/status; echo

# Remove the debug Pod when finished
kubectl delete pod my-debug
```

Other useful debugging images:

* [`curlimages/curl`](https://hub.docker.com/r/curlimages/curl) — lightweight image focused on `curl`, useful for testing HTTP/HTTPS endpoints.
* [`nicolaka/netshoot`](https://github.com/nicolaka/netshoot) — networking troubleshooting image with tools such as `curl`, `wget`, `dig`, `nslookup`, `nc`, `tcpdump`, and more.
* `busybox` — very small image that is useful for basic shell and networking checks.

For example, with `curlimages/curl`:

```bash
kubectl run curl-debug --rm -it \
  --image=curlimages/curl \
  --restart=Never -- \
  curl http://localhost:8081/status
```

With `netshoot`:

```bash
kubectl run netshoot --rm -it \
  --image=nicolaka/netshoot \
  --restart=Never -- bash
```

With `busybox`:

```bash
kubectl run busybox-debug --rm -it \
  --image=busybox \
  --restart=Never -- \
  wget -qO - http://localhost:8081/status
```

**Visual tools:**

* [Lens](https://k8slens.dev/) — Kubernetes IDE/dashboard for inspecting clusters, Pods, Deployments, Services and logs.
* [Freelens](https://github.com/freelensapp/freelens) — open-source fork of Lens.

## Key Concepts

**Cluster** — a group of machines (nodes) working together as one unit. One or more are server nodes (control-plane, make decisions), the rest are agent nodes (run the actual workloads).

**Pod** — the smallest deployable unit in Kubernetes. Usually runs one container, but can run several that need to share resources (like `writer`/`reader` in 1.10). Pods are disposable — Kubernetes recreates them freely, don't rely on a specific pod surviving.

**Deployment** — describes the desired state for a set of pods (which image, how many replicas, resource limits). The Deployment controller keeps the actual state matching this — restarts crashed pods, handles rolling updates when the image tag changes.

**Service** — a stable network address for a set of pods (pods themselves have changing IPs). Types used so far: `ClusterIP` (internal only), `NodePort` (exposes a port on every node, simple but not production-grade).

**Ingress** — routes external HTTP traffic into the cluster based on path/host, forwarding to the right Service. More flexible than NodePort — one Ingress can route multiple paths (`/`, `/status`, `/pingpong`) to different apps. Handled by an Ingress controller (Traefik, built into k3s).

**Volume** — a way to give a pod/container storage. `emptyDir` = temporary, tied to the pod's lifecycle (gone when pod dies). `PersistentVolume` + `PersistentVolumeClaim` = storage independent of any pod's lifecycle, survives restarts/deletions.

**k8s vs k3s vs k3d**
- `k8s` — just short for "Kubernetes" (not a tool, just a common abbreviation)
- `k3s` — a lightweight Kubernetes distribution (by Rancher), same core concepts, smaller footprint
- `k3d` — a wrapper that runs k3s inside Docker containers, used to get a local Kubernetes cluster running quickly on a dev machine

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

**Release:** [tag 1.2](https://github.com/mykola-lp/fs-kubernetes/tree/1.2/todo_app)
 
</details>

<details>
<summary>1.3 Declarative approach</summary>

In your "Log output" application create a folder for manifests and move your deployment into a declarative file.

Make sure everything still works by restarting and following logs.

**Release:** [tag 1.3](https://github.com/mykola-lp/fs-kubernetes/tree/1.3/log_output)

</details>

<details>
<summary>1.4 The project, step2</summary>

Create a deployment.yaml for the course project (that you started in Exercise 1.2.)

You won't have access to the port yet but that'll come soon.

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

<details>
<summary>1.13 The project, step 7</summary>

It is time to start adding some real functionality to our project! As promised earlier, the project shall have a todo app functionality. So in this exercise

1. add an input field. The input should not take todos that are over 140 characters long.
2. add a send button. It does not have to send the todo yet.
3. add a list of the existing todos with some hardcoded todos.

**Release:** [tag 1.13](https://github.com/mykola-lp/fs-kubernetes/tree/1.13/todo_app)

</details>

## Chapter 3.

<details>
<summary>2.1 Connecting pods</summary>

Connect the Log output application and the Ping pong application with HTTP. So, instead of sharing data via files, use an HTTP GET endpoint in the Ping pong app to respond with the number of pongs for the Log output app. Remove the volume between the two applications for the time being.

The response of the HTTP GET to Log output will stay the same:

```
2026-05-18T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43.
Ping / Pongs: 3
```

**Release:** [tag 2.1](https://github.com/mykola-lp/fs-kubernetes/tree/2.1)

</details>