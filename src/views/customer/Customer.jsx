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
  CFormLabel,
} from "@coreui/react";
const axios = require("axios");
import { getBaseURL } from "src/routes/login";
import { CDatePicker } from "@coreui/react-lab";
import DatePicker from "react-date-picker";

const Customer = () => {
  const [backendData, setBackendData] = useState([]);
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDoB] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisibleNew] = useState(false);
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
    getAllCustomers();
    return () => console.log("unmounting...");
  }, []);

  function getAllCustomers() {
    axios
      .get(url + "/get/all/customer", headerConfig)
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
  }

  function setDefaultValues() {
    setName("");
    setEmail("");
    setDoB("");
    setPhoneNumber("");
    setID("");
  }
  function updateCustomer(id) {
    let body = {
      name: name,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
      password: password,
    };
    axios
      .put(url + "/update/customer/" + id, body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED");
          getAllCustomers();
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
    setID(data.id);
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
      .get(url + "/delete/customer/" + id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED");
          getAllCustomers();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addCustomer() {
    console.log(dob);
    let body = {
      name: name,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
      password: password,
    };
    axios
      .post(url + "/add/customer", body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          getAllCustomers();
          setDefaultValues();
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
                  <CTableRow v-for="item in tableItems">
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Name</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Phone</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Date of Birth</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Reward Points</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Update</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Delete</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                  {backendData !== [] ? (
                    backendData.map((item, index) => (
                      <CTableRow v-for="item in tableItems" key={item.id}>
                        <CTableDataCell>
                          <div>{item.name}</div>
                          <div className="small text-medium-emphasis">
                            Email: {item.email}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="clearfix">
                            <div className="float-start">
                              <strong>{item.phoneNumber}</strong>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.dob}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.rewards}</div>
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
                              <CModalTitle>Update Customer</CModalTitle>
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
                              <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon2">
                                  Password
                                </CInputGroupText>
                                <CFormInput
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Password"
                                  aria-label="Password"
                                  aria-describedby="basic-addon2"
                                />
                              </CInputGroup>
                              <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon3">
                                  DoB
                                </CInputGroupText>
                                <DatePicker onChange={setDoB} value={dob} />
                              </CInputGroup>
                              <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon3">
                                  Phone
                                </CInputGroupText>
                                <CFormInput
                                  value={phoneNumber}
                                  onChange={(e) =>
                                    setPhoneNumber(e.target.value)
                                  }
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
                                onClick={() => updateCustomer(id)}
                              >
                                Save changes
                              </CButton>
                            </CModalFooter>
                          </CModal>
                        </>
                      </CTableRow>
                    ))
                  ) : (
                    <div></div>
                  )}
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
              <CInputGroupText id="basic-addon2">Password</CInputGroupText>
              <CFormInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                aria-describedby="basic-addon2"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon3">DoB</CInputGroupText>
              {/* <CFormInput
                value={dob}
                onChange={(e) => setDoB(e.target.value)}
                placeholder="Date of Birth"
                aria-label="Date of Birth"
                aria-describedby="basic-addon3"
              /> */}
              <DatePicker onChange={setDoB} value={dob} />
              {/* <CDatePicker value={dob}
                id="datepicker"
                onChange={(e) => setDoB(e.target.value)}
                placeholder="Date of Birth"
                aria-label="Date of Birth"/> */}
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
