# Log Output

Generates a random UUID on startup and logs it with a timestamp every 5 seconds.

## Run Locally

```bash
npm install
npm start
```

## Run with Docker

```bash
docker build -t log-output:1.1 .
docker run log-output:1.1
```

## Deploy to Kubernetes (k3d)

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
## Result

![Log output result](./1.1-result.png)