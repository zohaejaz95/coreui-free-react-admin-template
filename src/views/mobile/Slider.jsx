import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CButton,
  CRow,
  CCol,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibFacebook,
  cibLinkedin,
  cibTwitter,
  cilCalendar,
} from "@coreui/icons";
const axios = require("axios");
import { getBaseURL } from "src/routes/login";

const Slider = () => {
  const [backendData, setBackendData] = useState([]);
  const url = getBaseURL();
  const token = sessionStorage.getItem("token");
  const headerConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getSliderImages();
    return () => console.log("unmounting...");
  }, []);

  function getSliderImages() {
    axios
      .get(url + "/get/slider/image", headerConfig)
      .then((res) => {
        if (res.status === 200 && res.data) {
          console.log("RESPONSE RECEIVED");
          setBackendData(res.data);
          console.log(res);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function deleteImage(idImage) {
    axios
      .get(url + "/delete/slider/image/" + idImage, headerConfig)
      .then((res) => {
        if (res.status === 200 && res.data) {
          console.log("RESPONSE RECEIVED");
          getSliderImages();
          //console.log(res);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addImage() {
    axios
      .get(url + "/add/slider/image", headerConfig)
      .then((res) => {
        if (res.status === 200 && res.data) {
          console.log("RESPONSE RECEIVED");
          getSliderImages();
          //console.log(res);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  return (
    <div>
      <CRow >
        <CButton style={{width: "10rem", margin: 10}} color="primary" className="float-end">
          Add Image
        </CButton>
      </CRow>
      <CRow>
        {backendData.map((images) => (
          <CCol sm={6} lg={3}>
            <CCard style={{ width: "18rem" }}>
              <CCardImage orientation="top" src={images.image} />
              <CCardBody>
                <CButton color="danger" className="float-end" onClick={() => deleteImage(images.id)}>
                  Delete
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default Slider;
