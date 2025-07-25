import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });

const handler = app.getRequestHandler();

let io: Server;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connect", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on port http://${hostname}:${port}`);
    });
  (global as any).io = io;
});
