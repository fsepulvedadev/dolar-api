import express from "express";
import getDolarOficial from "./server.js";
import cors from "cors";

let PORT = 4000 || process.env.PORT;
var app = express();

app.use(express.json());
app.use(cors());

app.get("/api", async (req, res) => {
  let valor = await getDolarOficial();
  res.send({ dolar: "oficial", valor: valor });
});

const api = app.listen(PORT, () => {
  console.log("Server is running on port 4000");
});

api.timeout = 1000000000;
