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
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CFormSelect,
} from "@coreui/react";
const axios = require("axios");
import { getBaseURL } from "src/routes/login";

const Admin = () => {
  const [backendData, setBackendData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisibleNew] = useState(false);
  var admins = [];
  const url = getBaseURL();
  const token = sessionStorage.getItem("token");
  const headerConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    //debugger;
    //let url = getBaseURL();
    //console.log("render!" + url);
    axios
      .get(
        url + "/get/all/admin/",
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          admins = res.data;
          console.log("RESPONSE RECEIVED: ", admins);
          setBackendData(admins);
          console.log(backendData);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });

    // If you want to implement componentWillUnmount,
    // return a function from here, and React will call
    // it prior to unmounting.
    return () => console.log("unmounting...");
  }, []);

  function setDefaultValues(){
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
  }
  function updateAdmin(id) {
    let body = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    console.log(body);
    axios({
      method: "get",
      url: url + "/update/admin/" + id,
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
        password: password,
        role: role,
      },
    })
    // axios
    //   .get(
    //     url + "/update/admin/" + id,
    //     { mode: "cors" }, {params: body},
    //     {headers: {
    //       "Content-Type": "application/json;charset=UTF-8",
    //       "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    // Authorization: `Bearer ${token}`
    //     }}
    //   )
      .then((res) => {
        if (res.status === 200) {
          //admins = res.data;
          console.log("RESPONSE RECEIVED: ", admins);
          //setBackendData(admins);
          //console.log(backendData);
          setDefaultValues()
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        setDefaultValues()
      });
  }
  function viewModal(data) {
    setName(data.name);
    setEmail(data.email);
    //setPassword(data.password);
    setRole(data.role);
    setVisible(!visible);
  }
  function newAdminModal(){
    setVisibleNew(!visible2)
  }
  function deleteAdmin(id) {
    axios
      .get(
        url + "/delete/admin/" + id,
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

  function addAdmin(){
    let body = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    axios
      .get(
        url + "/add/admin/" ,
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } },
        {data: body}
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
        }
        setDefaultValues()
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        setDefaultValues()
      });
  }
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              Admin
              <CButton
                color="primary"
                className="float-end"
                onClick={() => newAdminModal()}
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
                            <strong>Role: {item.role}</strong>
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
                          onClick={() => deleteAdmin(item.id)}
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
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon3">
                                Password
                              </CInputGroupText>
                              <CFormInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon3"
                              />
                            </CInputGroup>
                            <CFormSelect
                              aria-label="Select Role"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Branch Manager">
                                Branch Manager
                              </option>
                              <option value="Office Manager">
                                Office Manager
                              </option>
                            </CFormSelect>
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
                              onClick={() => updateAdmin(item.id)}
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
            <CModalTitle>Add Admin</CModalTitle>
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
              <CInputGroupText id="basic-addon3">Password</CInputGroupText>
              <CFormInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                aria-describedby="basic-addon3"
              />
            </CInputGroup>
            <CFormSelect
              aria-label="Select Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Branch Manager">Branch Manager</option>
              <option value="Office Manager">Office Manager</option>
            </CFormSelect>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisibleNew(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => addAdmin()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    </>
  );
};

export default Admin;
