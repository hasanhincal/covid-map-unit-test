import { render, screen } from "@testing-library/react";
import Detail from "../pages/Detail";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { exa_data } from "../constant";

// test ortamındaki sahte store kurulumunu yap
const mockStore = configureStore([thunk]);

it("yüklenme durumunda loader bileşenleri ekrana basılır", () => {
  // yüklenme durumundaki store simüle et
  const store = mockStore({ isLoading: true, error: null, data: null });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );

  // loaderlar ekrana geliyormu?
  screen.getByTestId("header-loader");
  screen.getAllByTestId("card-loader");
});

it("hata durumunda error bileşeni ekrana basılır", () => {
  const store = mockStore({
    isLoading: false,
    error: "404 content not found",
    data: null,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );

  // hatanın metnini içeren element ekrana basıldı mı?
  screen.getByText(/404 content/);
});
it("veri geldiğinde ülke bilgisi ve kartlar ekrana basılır", () => {
  // veri gelme durumun da store simüle et;
  const store = mockStore({
    isLoading: false,
    error: null,
    data: exa_data,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );

  // 1- ülke detayları ekrana geliyor mu?

  // isim ekrana basılıyor mu?
  screen.getByText("Turkiye");

  //ekrandaki resmi al;
  const img = screen.getByRole("img");

  // resmin kaynağı doğru mu?
  expect(img).toHaveProperty("src", exa_data.country.flags.png);

  // 2-Kartlar ekrana geliyor mu?

  // covid nesnesini diziye çevir;
  const arr = Object.entries(exa_data.covid);

  arr.forEach(async (item) => {
    // Anahtar (başlık) ekranda var mı?
    const headers = await screen.findAllByText(item[0].split("_").join(" "), {
      exact: false,
    });
    console.log(`${item[0]} başlığı ekranda ${headers.length} kez bulundu.`);

    // Değer ekranda var mı?
    const values = await screen.findAllByText(item[1]);
    console.log(`${item[1]} değeri ekranda ${values.length} kez bulundu.`);
  });
});
// {exact: false} kullanarak, boşlukların, tirelerin veya diğer düzensizliklerin metin eşleştirme işleminden önce normalleştirilmesi sağlanabilir.
