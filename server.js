import fetch from "node-fetch";
import * as cheerio from "cheerio";

export let valorDolar;
export let valorSol;
export let valorReal;

var myHeaders = new Headers();
myHeaders.append("apikey", "5KO67Bz4Fg5s34qWHB5820R46GiuIWby");

var requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => data);
};

const URLdolar = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";

export const traerDataDolar = async () => {
  const data = await getRawData(URLdolar);
  const parsedData = cheerio.load(data);
  let dolar = parsedData(".value").text();
  let valores = dolar.split("$");

  valores = valores.filter((valor) => valor !== "");
  dolar = valores[0].replace(",", ".");
  return +dolar;
};

export const traerDataSol = async () => {
  try {
    fetch(
      "https://api.apilayer.com/exchangerates_data/convert?to=PEN&from=USD&amount=1",
      requestOptions
    )
      .then((res) => {
        console.log("tengo el sol");

        return res.json();
      })
      .then((json) => (valorSol = json.result));
  } catch (e) {
    console.log("error", e);
    traerDataSol();
  }
};

export const traerDataReal = async () => {
  fetch(
    "https://api.apilayer.com/exchangerates_data/convert?to=BRL&from=USD&amount=1",
    requestOptions
  )
    .then((res) => {
      console.log("tengo el real");

      return res.json();
    })
    .then((json) => (valorReal = json.result))
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      traerDataSol();
    });
};
traerDataReal();
valorDolar = await traerDataDolar();

setInterval(async () => {
  await traerDataSol();
  await traerDataReal();

  console.log("traje nuevos datos", valorReal, valorSol);
}, 86400000);

setInterval(async () => {
  valorDolar = await traerDataDolar();

  console.log("Nuevo valor dolar oficial", valorDolar);
}, 3600000);
