import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { useParams } from "react-router";
import "./adPage.css";
import noImg from "../images/no-image.svg";

function AdPage(props) {
  const { API } = useContext(MainContext);
  const { id } = useParams();
  const [ad, setAd] = useState();
  const [bigImg, setBigImg] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API}/ad/${id}`);
      const data = await res.json();
      setAd(data[0]);
      console.log(data[0]);
    };

    if (id) fetchData();
  }, [id]);

  if (!ad) return <></>;

  return (
    <div className="adPageContainer">
      {bigImg >= 0 && (
        <div className="adBigImageContainer" onClick={() => setBigImg(-1)}>
          <img
            className="adBigImage"
            src={ad.photos[bigImg]}
            alt=""
          />
        </div>
      )}
      <h1 className="adPageTitle">{ad.title}</h1>
      <a
        className="adPageLocation"
        target="_blank"
        rel="noreferrer"
        href={`https://maps.google.com/?q=${ad.location}`}
      >
        {ad.location}
      </a>
      <div style={{display: "flex"}}>
        <div className="adPageImageContainer">
          <img
            onClick={()=> ad.photos.length > 0 ? setBigImg(0) : null}
            className="adPageImage"
            src={
              ad.photos.length > 0
                ? ad.photos[0]
                : noImg
            }
            alt=""
          />
          <div style={{ display: "flex" }}>
            {ad.photos.length > 0 &&
              ad.photos.map((photo, index) => {
                if (index > 0)
                  return (
                    <button
                      onClick={() => {
                        setBigImg(index);
                      }}
                      className="extraPhotoContainer"
                    >
                      <img
                        className="extraPhoto"
                        src={photo}
                        alt=""
                      />
                    </button>
                  );
              })}
          </div>
        </div>
        <div className="adPagePrice">
            ${ad.price}
        </div>
      </div>
      <div className="adPageDescription">{ad.description}</div>
    </div>
  );
}

export default AdPage;
