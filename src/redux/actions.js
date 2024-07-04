import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const covidURL = process.env.REACT_APP_API_URL;

const headers = {
  "x-rapidapi-key": process.env.REACT_APP_API_KEY,
  "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
};

const getData = createAsyncThunk("covid/getData", async ({ code, query }) => {
  console.log(query);
  // apı'ya gönderilecek parameteleri hazırla
  const params = { iso: code, q: query };

  // isoCode'a göre covid verilerini al
  const req1 = axios.get(covidURL, { params, headers });

  // isoCode'a göre ülke verilerini al
  const req2 = axios.get(
    code
      ? `https://restcountries.com/v3.1/alpha/${code}`
      : `https://restcountries.com/v3.1/name/${query}`
  );

  // her iki apı isteğini aynı anda parelel olarak atıyoruz
  const responses = await Promise.all([req1, req2]);

  // region nesnesindeki değerleri bir üst nesne ile aynı düzeye cıkarma işlemi;
  const covid = {
    ...responses[0].data.data[0],
    ...responses[0].data.data[0].region,
  };

  // gereksiz değerleri kaldır
  delete covid.region;
  delete covid.cities;

  // payload'ı return et
  return { covid, country: responses[1].data[0] };
});
export default getData;
