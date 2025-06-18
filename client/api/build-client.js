import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We are on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
// This function creates an Axios instance with the appropriate base URL
// and headers based on whether the code is running on the server or in the browser.
// It allows the application to make HTTP requests to the correct API endpoint
// depending on the environment, ensuring that requests are made correctly
// whether the code is executed on the server side or client side.
// This is useful for applications that need to interact with APIs in both environments,
// such as Next.js applications that render pages on the server and client.
