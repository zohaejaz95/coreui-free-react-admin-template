import {
  CTableDataCell,
  CTableBody,
  CTable,
  CTableRow,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CButton,
  CCardBody,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormTextarea,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { getBaseURL } from "src/routes/login";
const axios = require("axios");

const Rewards = () => {
  const url = getBaseURL();
  const [points, setPoints] = useState(0);
  const [work, setWork] = useState("");
  const [id, setId]= useState("")
  const token = sessionStorage.getItem("token");
  const headerConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getRewards()
    return () => console.log("unmounting...");
  }, []);
  function getRewards(){
    axios
    .get(url + "/get/points", headerConfig)
    .then((res) => {
      if (res.status === 200) {
        setPoints(res.data[0].currency)
        setWork(res.data[0].working)
        setId(res.data[0].id)
      }
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    });
  }
  function updateRewards(){
      let rewards = {
        currency: points,
        working: work
      }
    axios
    .put(url + "/update/points/"+id,rewards, headerConfig)
    .then((res) => {
      if (res.status === 200) {
          getRewards()
          alert("Updated!")
      }
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    });
  }
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Rewards</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      <div>
                        AED 1.00 is equal to
                        <strong> {points}</strong> reward points.
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CInputGroup className="mb-1">
                        <CInputGroupText id="basic-addon1">
                          Rewards Points
                        </CInputGroupText>
                        <CFormInput
                          type="number"
                          value={points}
                          onChange={(e) => setPoints(e.target.value)}
                          placeholder="Enter Points"
                          aria-label="points"
                          aria-describedby="basic-addon1"
                        />
                      </CInputGroup>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        className="float-start"
                        onClick={() => updateRewards()}
                      >
                        Update
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>
                      <div>
                        <strong>How it works?</strong>
                        <div>{work}</div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CInputGroup>
                        <CInputGroupText>With textarea</CInputGroupText>
                        <CFormTextarea
                          aria-label="With textarea"
                          value={work}
                          onChange={(e) => setWork(e.target.value)}
                        ></CFormTextarea>
                      </CInputGroup>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        className="float-start"
                        onClick={() => updateRewards()}
                      >
                        Update
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Rewards;
