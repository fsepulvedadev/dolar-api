import express from "express";
import cors from "cors";
import { valorDolar, valorSol, valorReal } from "../server.js";

let PORT = 4000 || process.env.PORT;
var app = express();

app.use(express.json());
app.use(cors());

app.get("/api", async (req, res) => {
  res.send([
    { moneda: "dolar oficial", valor: valorDolar },
    { moneda: "dolar a sol", valor: valorSol },
    { moneda: "dolar a real", valor: valorReal },
  ]);
});

const api = app.listen(PORT, () => {
  console.log("Server is running on port 4000");
});

api.timeout = 1000000000;
