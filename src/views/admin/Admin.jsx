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
  const [id, setID] = useState("");
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
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getAllAdmins();
    return () => console.log("unmounting...");
  }, []);

  function getAllAdmins(){
    axios
      .get(
        url + "/get/all/admin/",
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          admins = res.data;
          console.log("RESPONSE RECEIVED",res);
          setBackendData(admins);
          //console.log(backendData);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function setDefaultValues() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setID("")
  }
  function updateAdmin(id) {
    let body = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    axios
      .put(url + "/update/admin/" + id, body, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          //admins = res.data;
          //console.log("RESPONSE RECEIVED: ", admins);
          getAllAdmins()
          setVisible(!visible)
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }
  function viewModal(data) {
    setName(data.name);
    setEmail(data.email);
    //setPassword(data.password);
    setRole(data.role);
    setID("")
    setVisible(!visible);
  }
  function newAdminModal() {
    setVisibleNew(!visible2);
  }
  function deleteAdmin(id, index) {
    console.log(index);
    axios
      .get(url + "/delete/admin/" + id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          getAllAdmins();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addAdmin() {
    let body = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    axios
      .post(url + "/add/admin", body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          admins = res.data;
          backendData.push(admins);
          alert("Admin Added Successfully!");
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
                <CTableRow v-for="item in tableItems" >
                      <CTableDataCell>
                        <div><strong>Name</strong></div>
                        
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>Role</strong>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div
                        >
                         <strong>Update</strong>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div
                          
                        >
                          <strong>Delete</strong>
                        </div>
                      </CTableDataCell>
                      
                    </CTableRow>
                  {backendData !==[]?backendData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.name}</div>
                        <div className="small text-medium-emphasis">
                          Email: {item.email}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            {item.role}
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
                          onClick={() => deleteAdmin(item.id, index)}
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
                              type="password"
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
                              onClick={() => updateAdmin(id)}
                            >
                              Save changes
                            </CButton>
                          </CModalFooter>
                        </CModal>
                      </>
                    </CTableRow>
                  )):(<div/>)}
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
              type="password"
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
