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

const Customer = () => {
  const [backendData, setBackendData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDoB] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
        url + "/get/all/customer",
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
    setEmail("");
    setDoB("");
    setPhoneNumber("");
  }
  function updateCustomer(id) {
    let body = {
      name: name,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
    };
    console.log(body);
    axios({
      method: "get",
      url: url + "/update/customer/" + id,
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
        email: email,
        dob: dob,
        phoneNumber: phoneNumber,
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
    let date = new Date(data.dob).toISOString().substring(0, 10);
    setName(data.name);
    setEmail(data.email);
    setDoB(date);
    setPhoneNumber(data.phoneNumber);
    setVisible(!visible);
  }

  function newCustomerModal() {
    if (visible2) {
    } else {
      setDefaultValues();
    }
    setVisibleNew(!visible2);
  }

  function deleteCustomer(id) {
    axios
      .get(
        url + "/delete/customer/" + id,
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

  function addCustomer() {
    let body = {
      name: name,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
    };
    axios
      .get(
        url + "/add/customer/",
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
              Customers
              <CButton
                color="primary"
                className="float-end"
                onClick={() => newCustomerModal()}
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
                        <div>Name: {item.name}</div>
                        <div className="small text-medium-emphasis">
                          Email: {item.email}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>Phone: {item.phoneNumber}</strong>
                          </div>
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
                          onClick={() => deleteCustomer(item.id)}
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
                                Email
                              </CInputGroupText>
                              <CFormInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon2"
                              />
                            </CInputGroup>
                            {/* <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon2">
                                Password
                              </CInputGroupText>
                              <CFormInput
                                value={dob}
                                onChange={(e) => setDoB(e.target.value)}
                                placeholder="Date of Birth"
                                aria-label="Date of Birth"
                                aria-describedby="basic-addon2"
                              />
                            </CInputGroup> */}
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon3">
                                DoB
                              </CInputGroupText>
                              <CFormInput
                                value={dob}
                                onChange={(e) => setDoB(e.target.value)}
                                placeholder="Date of Birth"
                                aria-label="Date of Birth"
                                aria-describedby="basic-addon3"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon3">
                                Phone
                              </CInputGroupText>
                              <CFormInput
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone Number"
                                aria-label="Phone Number"
                                aria-describedby="basic-addon3"
                              />
                            </CInputGroup>
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
                              onClick={() => updateCustomer(item.id)}
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
            <CModalTitle>Add Customer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon2">Email</CInputGroupText>
              <CFormInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon2"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon3">DoB</CInputGroupText>
              <CFormInput
                value={dob}
                onChange={(e) => setDoB(e.target.value)}
                placeholder="Date of Birth"
                aria-label="Date of Birth"
                aria-describedby="basic-addon3"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon3">Phone</CInputGroupText>
              <CFormInput
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                aria-label="Phone Number"
                aria-describedby="basic-addon3"
              />
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisibleNew(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => addCustomer()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    </>
  );
};

export default Customer;
