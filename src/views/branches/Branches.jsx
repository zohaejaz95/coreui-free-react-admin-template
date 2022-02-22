import React, { useState, useEffect } from "react";
import {
  CAvatar,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CFormSelect,
} from "@coreui/react";
const axios = require("axios");
import { getBaseURL } from "src/routes/login";

const Branches = () => {
  const [backendData, setBackendData] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [floor, setFloor] = useState(0);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisibleNew] = useState(false);
  const url = getBaseURL();
  const token = sessionStorage.getItem("token");
  const headerConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    axios
      .get(
        url + "/get/all/branches",
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          setBackendData(res.data);
          console.log(res);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    return () => console.log("unmounting...");
  }, []);

  function setDefaultValues() {
    setName("");
    setAddress("");
    setCity("");
    setState("");
    setFloor(0);
    setLocation("");
    setImage("");
  }
  function updateBranch(id) {
    let body = {
      name: name,
      address: address,
      city: city,
      state: state,
      floor: floor,
      image: image,
      location: location,
    };
    console.log(body);
    axios({
      method: "get",
      url: url + "/update/branch/" + id,
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
        address: address,
        city: city,
        state: state,
        floor: floor,
        image: image,
        location: location,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          setDefaultValues();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }
  function viewModal(data) {
    if (visible) {
    } else {
      setDefaultValues();
    }
    setName(data.name);
    setAddress(data.address);
    setCity(data.city);
    setState(data.state);
    setFloor(data.floor);
    setLocation(data.location.lat + data.location.lng);
    //setImage(data.image)
    setVisible(!visible);
  }

  function newBranchModal() {
    if (visible2) {
    } else {
      setDefaultValues();
    }
    setVisibleNew(!visible2);
  }

  function deleteBranch(id) {
    axios
      .get(
        url + "/delete/branch/" + id,
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", admins);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addBranch() {
    let body = {
      name: name,
      address: address,
      city: city,
      state: state,
      floor: floor,
      image: image,
      location: location,
    };
    axios
      .get(
        url + "/add/branch",
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } },
        { data: body }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
        }
        setDefaultValues();
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
            <CCardHeader>
              Branches
              <CButton
                color="primary"
                className="float-end"
                onClick={() => newBranchModal()}
              >
                Add
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableBody>
                  {backendData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={item.id}>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{index + 1}</strong>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.name}</strong>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>City: {item.city + ", " + item.state}</div>
                        <div className="small text-medium-emphasis">
                          Address: {item.address}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          className="float-end"
                          onClick={() => viewModal(item)}
                        >
                          Update
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          style={{ color: "white" }}
                          className="float-end"
                          onClick={() => deleteBranch(item.id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                      <>
                        <CModal
                          backdrop="static"
                          visible={visible}
                          onClose={() => setVisible(false)}
                        >
                          <CModalHeader>
                            <CModalTitle>Update Admin</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Name
                              </CInputGroupText>
                              <CFormInput
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon2">
                                Address
                              </CInputGroupText>
                              <CFormInput
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon2"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon3">
                                City
                              </CInputGroupText>
                              <CFormInput
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Date of Birth"
                                aria-label="Date of Birth"
                                aria-describedby="basic-addon3"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon3">
                                State
                              </CInputGroupText>
                              <CFormInput
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="Phone Number"
                                aria-label="Phone Number"
                                aria-describedby="basic-addon3"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon2">
                                Floor
                              </CInputGroupText>
                              <CFormInput
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                placeholder="Floor"
                                aria-label="Floor"
                                aria-describedby="basic-addon2"
                              />
                            </CInputGroup>
                            {/* <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon2">
                                  Location
                                </CInputGroupText>
                                <CFormInput
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  placeholder="Location"
                                  aria-label="Location"
                                  aria-describedby="basic-addon2"
                                />
                              </CInputGroup> */}
                          </CModalBody>
                          <CModalFooter>
                            <CButton
                              color="secondary"
                              onClick={() => setVisible(false)}
                            >
                              Close
                            </CButton>
                            <CButton
                              color="primary"
                              onClick={() => updateBranch(item.id)}
                            >
                              Save changes
                            </CButton>
                          </CModalFooter>
                        </CModal>
                      </>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <>
        <CModal
          backdrop="static"
          visible={visible2}
          onClose={() => setVisibleNew(false)}
        >
          <CModalHeader>
            <CModalTitle>Add Branch</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Branch Name"
                aria-label="Branch Name"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon2">Address</CInputGroupText>
              <CFormInput
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                aria-label="Address"
                aria-describedby="basic-addon2"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon3">City</CInputGroupText>
              <CFormInput
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                aria-label="City"
                aria-describedby="basic-addon3"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon3">State</CInputGroupText>
              <CFormInput
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                aria-label="State"
                aria-describedby="basic-addon3"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon2">Floor</CInputGroupText>
              <CFormInput
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="Floor"
                aria-label="Floor"
                aria-describedby="basic-addon2"
              />
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisibleNew(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => addBranch()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    </>
  );
};

export default Branches;
