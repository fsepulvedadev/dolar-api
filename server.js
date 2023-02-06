import fetch from "node-fetch";
import * as cheerio from "cheerio";

const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => data);
};

const URL = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";

const traerDataDolar = async () => {
  const data = await getRawData(URL);
  const parsedData = cheerio.load(data);
  let dolar = parsedData(".value").text();
  let valores = dolar.split("$");

  valores = valores.filter((valor) => valor !== "");
  dolar = valores[0].replace(",", ".");
  return +dolar;
};

let valorDolar = await traerDataDolar();
console.log(valorDolar);

export default traerDataDolar;
