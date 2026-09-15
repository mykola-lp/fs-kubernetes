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

**Release:** [tag 1.1](https://github.com/mykola-lp/fs-kubernetes/releases/tag/1.1)

</details>
