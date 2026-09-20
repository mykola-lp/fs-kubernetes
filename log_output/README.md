# Log Output

Generates a random UUID on startup and logs it with a timestamp every 5 seconds.

## Setup

### Run Locally

```bash
npm install
npm start
```

### Run with Docker

```bash
docker build -t log-output:1.1 .
docker run log-output:1.1
```

## Outputs

### #1.1

**Deploy to Kubernetes (k3d)**

```bash
# List available k3d clusters
k3d cluster list

# Import the Docker image into the k3d cluster
k3d image import log-output:1.1 -c <cluster-name>

# Create a Kubernetes deployment
kubectl create deployment log-output-dep --image=log-output:1.1

# Check running pods
kubectl get pods

# Follow pod logs
kubectl logs -f <pod-name>
```

#### Result

![Log output result (imperative)](./docs/1.1-result.png)

### #1.3

**Deploy to Kubernetes (declarative)**

With the **imperative** approach, you run direct commands (e.g. `kubectl create deployment`) that tell Kubernetes exactly what to do at a given moment, but this state exists only in the cluster's memory and is hard to reproduce or track over time. With the **declarative** approach, you describe the desired end state in a YAML file (e.g. `deployment.yaml`) and apply it with `kubectl apply -f`, letting the Deployment controller handle how to reach and maintain that state. This makes the configuration reproducible, version-controlled with git, and self-healing — if a pod is deleted, the controller automatically recreates it to match the desired state.

> **Note:** `kubectl delete` is an anti-pattern. Prefer updating the image tag in the YAML and re-running `kubectl apply` — Kubernetes will perform a rolling update with no downtime. `delete` was only used once here, to switch from the old imperative deployment to the new declarative one.

```bash
kubectl apply -f manifests/deployment.yaml
```

#### Result

![Log output result (declarative)](./docs/1.3-result-declarative.png)

This confirms that the declarative deployment.yaml file automatically restores the pod after deletion (the Deployment controller watches the desired state and immediately creates a replacement) — this is proof that the switch to the declarative approach was successful.

### #1.7

**Request flow:**

```
http://localhost:8081/
         ↓
  [Ingress Controller] (port 8081 mapped from host)
         ↓
  [Ingress Rules] (path: / → log-output-svc:2345)
         ↓
  [Service] (port 2345 → targetPort 3000)
         ↓
  [Pod] (container listening on port 3000)
         ↓
  [Application]
```

**Terminal:**

![Log output result (terminal)](./docs/1.7-result-terminal.png)

**Browser:**

![Log output result (browser)](./docs/1.7-result-browser.png)

### #1.10

**Deploy to Kubernetes (two containers, shared volume)**

```bash
# Build both images separately
docker build -t log-output-writer:1.10 ./writer
docker build -t log-output-reader:1.10 ./reader

# Import both images into the k3d cluster
k3d image import log-output-writer:1.10 log-output-reader:1.10 -c k3s-default

# Apply the deployment (writer + reader in one pod, sharing an emptyDir volume)
kubectl apply -f manifests/deployment.yaml

# Check running pods — 2/2 means both containers in the pod are up
kubectl get pods

# View logs for each container separately (required in a multi-container pod)
kubectl logs <pod-name> -c writer
kubectl logs <pod-name> -c reader

# Check the shared file's content via the reader's HTTP endpoint
curl http://localhost:8081/; echo
```

Or open `http://localhost:8081/` in the browser.

#### Result

Terminal:

![Log output result (terminal)](./docs/1.10-result-terminal.png)

Browser:

![Log output result (browser)](./docs/1.10-result-browser.png)

### #1.11

![Log output result (terminal)](./docs/1.11-result.png)