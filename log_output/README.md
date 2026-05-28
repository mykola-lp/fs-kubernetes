## Setup

This directory contains the `Log output` service and the Kubernetes resources
used to run it in the cluster.

### Run locally

```bash
node log_output/index.js
```

### Build image

```bash
docker build -t log-output:1.1 log_output
```

### Deploy

```bash
k3d image import log-output:1.1 -c k3s-default

kubectl apply -f log_output/manifests/deployment.yaml
kubectl rollout restart deployment/log-output
kubectl get pods
kubectl logs deployment/log-output
```

## Exercises

### 1.1 Getting started

Exercises can be done with any language and framework you want.

Create an application that generates a random string on startup, stores
this string into memory, and outputs it every 5 seconds with a timestamp.

**Example output:**

```text
2020-03-30T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43
2020-03-30T12:15:22.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43
```

Deploy it into your Kubernetes cluster and confirm that it's running with
`kubectl logs ...`

You will keep building this application in future exercises. This
application will be called `Log output`.

As an answer, give the link to the GitHub release that corresponds to the
exercise.

For the example submission repository, the link is:
`https://github.com/mluukkai/KubernetesSubmissions/tree/1.1`

**Output:**

```text
amd@amd ~/projects/fs-kubernetes  (main)$ kubectl logs deployment/log-output
2026-05-27T08:36:32.141Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:36:37.150Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:36:42.155Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:36:47.156Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:36:52.160Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:36:57.166Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:02.171Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:07.176Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:12.181Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:17.181Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:22.185Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:27.191Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
2026-05-27T08:37:32.196Z: 047725da-f2b8-4e47-82f1-1fd3d7ba8a2c
...
```

### 1.3. Declarative approach


In your "Log output" application, create a folder for manifests and move your deployment into a declarative file.

Make sure everything still works by restarting and following logs.
