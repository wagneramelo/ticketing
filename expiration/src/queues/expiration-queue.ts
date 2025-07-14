import Queue from "bull";
import { OrderExpirationCompletePublisher } from "../events/publishers/order-expiration-complete";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("I want to publish an expiration:complete event for", job.data.orderId);
  new OrderExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };