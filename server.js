import fetch from "node-fetch";
import * as cheerio from "cheerio";

export let valorDolar;
export let valorSol;
export let valorReal;

/* var myHeaders = new Headers();
myHeaders.append("apikey", "5KO67Bz4Fg5s34qWHB5820R46GiuIWby");

 */

const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => data);
};

const URLdolar = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARS";

export const traerDataDolar = async () => {
  const data = await getRawData(URLdolar);
  const parsedData = cheerio.load(data);
  let dolar = parsedData(".value").text();
  let valores = dolar.split("$");

  valores = valores.filter((valor) => valor !== "");
  dolar = valores[1].replace(",", ".");
  return +dolar;
};

export const traerDataSol = async () => {
  try {
    fetch(
      "https://api.getgeoapi.com/v2/currency/convert?api_key=8621ab8342a7d6c96077e568aac356b84d8b9ace&from=USD&to=PEN&amount=1&format=json"
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => (valorSol = +json.rates.PEN.rate));
  } catch (e) {
    console.log("error", e);
    traerDataSol();
  }
};

export const traerDataReal = async () => {
  fetch(
    "https://api.getgeoapi.com/v2/currency/convert?api_key=8621ab8342a7d6c96077e568aac356b84d8b9ace&from=USD&to=BRL&amount=1&format=json"
  )
    .then((res) => {
      console.log("tengo el real");

      return res.json();
    })
    .then((json) => (valorReal = +json.rates.BRL.rate))
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      traerDataSol();
    });
};
await traerDataSol();
await traerDataReal();
await traerDataDolar();

console.log("valor dolar", valorDolar);
console.log("valor real", valorReal);
console.log("valor SOL", valorSol);

setInterval(async () => {
  await traerDataSol();
  await traerDataReal();

  console.log("traje nuevos datos", valorReal, valorSol);
}, 86400000);

setInterval(async () => {
  valorDolar = await traerDataDolar();

  console.log("Nuevo valor dolar oficial", valorDolar);
}, 3600000);
