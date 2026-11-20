import app from "./server.js";
import dotenv from "dotenv";
import DBconnection from "./DB/dbConnection.js";

dotenv.config({
  path: "./.env",
});

import dns from "node:dns";

// Set public DNS servers BEFORE mongoose.connect()
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const PORT = process.env.PORT || 3000;

DBconnection().then(() => {
  app.listen(PORT, () => {
    console.log(`APP IS LISTENING AT PORT : ${PORT}`);
  });
}).catch((error) => {
  console.log("DB CONNECTION ERROR", error.message);
  process.exit(1);
});
