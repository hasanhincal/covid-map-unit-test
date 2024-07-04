import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://ismailarilik.com/react-covid-maps/geo.json";

const Main = () => {
  const [geo, setGeo] = useState();

  return (
    <div className=" text-white overflow-hidden pt-6 md:pt-20 h-[calc(100vh-74px)] flex flex-col justify-center items-center wrapper">
      <h1 className="px-6 pb-6 flex gap-2 items-center">
        Detay Görüntüle
        <span>
          {geo?.properties?.name ? geo.properties.name : "(ülke seçiniz)"}
        </span>
      </h1>
      <ComposableMap
        height={1000}
        projectionConfig={{ rotate: [-10, 0, 0], scale: 287 }}
      >
        <ZoomableGroup>
          <Graticule stroke="gray" strokeWidth={0.3} />
          <Sphere stroke="gray" />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Link to={`/detail?code=${geo?.id}`}>
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setGeo(geo)}
                    onMouseLeave={() => setGeo(null)}
                    style={{
                      default: {
                        fill: "#EEE",
                      },
                      hover: {
                        fill: "rgb(54 197 94)",
                      },
                    }}
                  />
                </Link>
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default Main;
