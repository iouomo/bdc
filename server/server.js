const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const port = process.env.PORT || 3000;
const app = require("./app");

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log("worker " + worker.process.pid + " died");
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  const server = http.createServer(app);
  server.listen(port);

  console.log(`Worker ${process.pid} started`);
}
