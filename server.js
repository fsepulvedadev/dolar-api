import fetch from "node-fetch";
import * as cheerio from "cheerio";

export let valorDolar;
export let valorSol;
export let valorReal;

const URLdolar = "https://www.infobae.com/economia/divisas/dolar-hoy/";

export const traerDataDolar = async () => {
  let dolar;
  const response = await fetch(URLdolar);
  const body = await response.text();

  const $ = cheerio.load(body);

  $(".d23-dolar-item").map((i, element) => {
    const nombre = $(element).find(".d23-dolar-title").text();
    const precio = $(element).find(".d23-dolar-amount").text();

    if (nombre == "Dólar Banco Nación") {
      let precioLimpio = precio.replace("$", "");
      console.log(precioLimpio);
      dolar = +precioLimpio;
    }

    valorDolar = dolar;
  });
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
traerDataSol().then(() => console.log("valor sol", valorSol));

traerDataReal().then(() => console.log("valor real", valorReal));
traerDataDolar().then(() => console.log("valor dolar", valorDolar));

setInterval(async () => {
  await traerDataSol();
  await traerDataReal();

  console.log("traje nuevos datos", valorReal, valorSol);
}, 86400000);

setInterval(async () => {
  valorDolar = await traerDataDolar();

  console.log("Nuevo valor dolar oficial", valorDolar);
}, 3600000);
