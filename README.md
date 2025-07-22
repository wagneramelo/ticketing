# Ticketing Microservices Application

This is a full-stack microservices-based ticketing application. It uses Node.js, Next.js, MongoDB, NATS Streaming, Stripe, and Kubernetes for orchestration.

## Architecture

- **Frontend:** Next.js (React) app (`client/`)
- **Microservices:** Auth, Tickets, Orders, Payments, Expiration (all Node.js/Express)
- **Shared Library:** Common code (`common/`)
- **Event Bus:** NATS Streaming
- **Databases:** MongoDB (one per service)
- **Orchestration:** Kubernetes (YAML in `infra/k8s/`)
- **Local Dev:** Skaffold for rapid development

See `microservice-architecture-diagram.md` for a detailed diagram and explanation.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (with Kubernetes enabled)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [skaffold](https://skaffold.dev/docs/install/)
- [Node.js](https://nodejs.org/) (v18+ recommended) and [npm](https://www.npmjs.com/)
- [Stripe account](https://dashboard.stripe.com/register) (for payments)
- (Optional) [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/) for Kubernetes

---

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Ticket
```

---

## 2. Install Dependencies

Install dependencies for all services and the shared library:

```bash
cd common && npm install && npm run build && cd ..
cd auth && npm install && cd ..
cd tickets && npm install && cd ..
cd orders && npm install && cd ..
cd payments && npm install && cd ..
cd expiration && npm install && cd ..
cd client && npm install && cd ..
```

---

## 3. Set Up Environment Variables

Each service may require environment variables. At minimum, you need:

- **JWT_KEY** (for Auth, Tickets, Orders, Payments)
- **MONGO_URI** (for each service)
- **NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL** (for all services)
- **STRIPE_KEY** (for Payments, your Stripe secret key)

You can set these in your Kubernetes manifests or as Kubernetes secrets.

Example for local development (not for production!):

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret
```

---

## 4. Update Your Hosts File

Add the following line to your `/etc/hosts` file to route `ticketing.dev` to localhost:

```
127.0.0.1 ticketing.dev
```

---

## 5. Start Kubernetes and Ingress

- Make sure Kubernetes is running in Docker Desktop.
- Install the Nginx Ingress Controller if not already installed:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.1/deploy/static/provider/docker/deploy.yaml
```

---

## 6. Deploy the Application

From the project root, run:

```bash
skaffold dev
```

This will:
- Build all Docker images
- Deploy all services and MongoDB instances to Kubernetes
- Watch for file changes and redeploy automatically

---

## 7. Access the Application

- Open [http://ticketing.dev](http://ticketing.dev) in your browser.

---

## 8. Running Tests

Each service has its own tests. To run them:

```bash
cd <service>
npm test
```
For example:
```bash
cd auth
npm test
```

---

## 9. Stripe Setup

- Use your Stripe test secret key for `STRIPE_KEY`.
- The frontend uses a test publishable key for Stripe Checkout.
- You may need to update your Stripe dashboard to allow your integration surface, or migrate to Stripe Elements/Checkout if you see tokenization errors.

---

## 10. Troubleshooting

- Make sure all pods are running: `kubectl get pods`
- Check logs for a service: `kubectl logs <pod-name>`
- If you see Stripe publishable key errors, see the Stripe docs or migrate to Stripe Elements/Checkout.

---

## 11. Stopping the Application

Press `Ctrl+C` in the terminal running `skaffold dev`.

---

## 12. Cleaning Up

To remove all Kubernetes resources:

```bash
kubectl delete -f infra/k8s
```

---

## Additional Notes

- All service endpoints are routed through the Ingress at `ticketing.dev`.
- MongoDB is deployed as a single pod per service for development.
- NATS Streaming is used for event-driven communication.

---

**For more details, see the code in each service and the architecture diagram in `microservice-architecture-diagram.md`.** 