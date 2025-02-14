import express from "express";
import { createServer } from "node:http";
import compression from "compression";
import { hostname } from "node:os";
import { fileURLToPath } from "url";
import chalk from "chalk";
import routes from "./src/routes.js";

const publicPath = fileURLToPath(new URL("./public/", import.meta.url));

const app = express();
app.use(express.static(publicPath));
app.use("/", routes);

app.use(
  compression({
    level: 1,
    threshold: 0,
    filter: () => true,
    memLevel: 1,
    strategy: 1,
    windowBits: 9,
  })
);

let port = parseInt(process.env.PORT || "3000");

const server = createServer(app);

server.on("listening", () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(
      chalk.bold.blue(`
██╗    ██╗ █████╗ ██╗   ██╗███████╗███████╗   
██║    ██║██╔══██╗██║   ██║██╔════╝██╔════╝   
██║ █╗ ██║███████║██║   ██║█████╗  ███████╗   
██║███╗██║██╔══██║╚██╗ ██╔╝██╔══╝  ╚════██║   
╚███╔███╔╝██║  ██║ ╚████╔╝ ███████╗███████║██╗
 ╚══╝╚══╝ ╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚══════╝╚═╝                                          
    `)
    );

    console.log(chalk.bold.green(`🟡 Server starting...`));
    console.log(chalk.bold.green(`🟢 Server started successfully!`));
    console.log(
      chalk.green(`🔗 Hostname: `) +
        chalk.bold(`http://${hostname()}:${address.port}`)
    );
    console.log(
      chalk.green(`🔗 LocalHost: `) + chalk.bold(`http://localhost:${address.port}`)
    );
    console.log(
      chalk.green("🕒 Time: ") + chalk.bold.magenta(new Date().toLocaleTimeString())
    );
    console.log(
      chalk.green("📅 Date: ") + chalk.bold.magenta(new Date().toLocaleDateString())
    );
    console.log(chalk.green("💻 Platform: ") + chalk.bold.yellow(process.platform));
    console.log(chalk.green("📶 Server Status: ") + chalk.bold.green("Running"));
    console.log(chalk.red("🔴 Do ctrl + c to shut down the server."));
  } else {
    console.error(chalk.bold.red("❌ Server failed to start."));
  }
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

async function shutdown(signal) {
  console.log(chalk.bold.red(`🔴 ${signal} received. Shutting down...`));

  try {
    await closeServer(server, "HTTP server");
    console.log(chalk.bold.green("✅ All servers shut down successfully."));
    process.exit(0);
  } catch (err) {
    console.error(chalk.bold.red("⚠️ Error during shutdown:"), err);
    process.exit(1);
  }
}

function closeServer(server, name) {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error(chalk.bold.red(`❌ Error closing ${name}:`), err);
        reject(err);
      } else {
        console.log(chalk.bold.red(`🔴 ${name} closed.`));
        resolve();
      }
    });
  });
}

server.listen(port);