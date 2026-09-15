# Todo App

A simple web server that starts and logs "Server started in port NNNN". The port is configurable via the `PORT` environment variable. This application will evolve into a full todo application in later exercises.

## Run Locally

```bash
npm install
PORT=3000 npm start
```

## Run with Docker

```bash
docker build -t todo-app:1.2 .
docker run -e PORT=3000 -p 3000:3000 todo-app:1.2
```

## Deploy to Kubernetes (k3d)

```bash
# List available k3d clusters
k3d cluster list

# Import the Docker image into the k3d cluster
k3d image import todo-app:1.2 -c k3s-default

# Create a Kubernetes deployment
kubectl create deployment todo-app-dep --image=todo-app:1.2

# Check running pods
kubectl get pods

# Follow pod logs
kubectl logs -f <pod-name>
```

## View in Browser (local testing only)

There is no external access configured for this exercise yet (networking is covered in a later part). To check the app in a browser for testing purposes, use port-forwarding:

```bash
kubectl port-forward <pod-name> 3000:3000
```

Then open `http://localhost:3000/` in your browser.

## Result

Terminal output (`kubectl logs`):

![todo_app terminal result](./docs/1.2-result-terminal.png)

In browser **NOT** working (as expected):

![todo_app browser result](./docs/1.2-result-browser-not-working.png)

Browser output (via **port-forward**):

![todo_app terminal result](./docs/1.2-result-terminal-port.png)

![todo_app browser result](./docs/1.2-result-browser-working-port.png)
