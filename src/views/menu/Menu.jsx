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

const Menu = () => {
  const [backendData, setBackendData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [prom, setProm] = useState([]);
  //const [branchName , getBranchById] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [branch, setBranch] = useState("");
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
        url + "/get/all/category",
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let data = res.data;
          const promise = data.map((item, index) => {
            console.log(item.branch);
            let arr = [];
            const prom = item.branch.map((br, i) => {
              axios
                .get(
                  url + "/get/branches/" + br,
                  { mode: "cors" },
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((resp) => {
                  if (resp.status === 200) {
                    arr.push(resp.data.name);
                  }
                  setBackendData(data);
                })
                .catch((err) => {
                  console.log("AXIOS ERROR: ", err);
                });
            });
            setTimeout(() => {
              Promise.all(prom).then(function () {
                data[index].branchName = arr;
                setBackendData(data);
                setProm(prom);
              });
            }, 1000);
          });

          setTimeout(() => {
            Promise.all(promise).then(function () {
              setBackendData(data);
              console.log(data[0].branchName);
            });
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });

    axios
      .get(
        url + "/get/all/branches",
        { mode: "cors" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          //console.log("RESPONSE RECEIVED: ", res);
          setBranches(res.data);
          //console.log(res);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    //console.log(backendData);
    return () => console.log("unmounting...");
  }, []);

  function setDefaultValues() {
    setName("");
    setImage("");
    setBranch("");
    setPhoneNumber("");
  }
  function updateCustomer(id) {
    let body = {
      name: name,
      image: image,
      branch: branch,
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
        image: image,
        branch: branch,
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
    console.log(backendData);
    setName(data.name);
    setImage(data.image);
    setBranch(data.branch);
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
      image: image,
      branch: branch,
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
              Menu Categories
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
                        <div>{index + 1}.</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.image} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>Branch/es: </strong>
                          </div>
                        </div>
                        {item.branchName ? (
                          item.branchName.map((i, j) => (
                            <div className="clearfix">
                              <div className="float-start">
                                <small className="text-medium-emphasis">
                                  {i}
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="clearfix">
                            <div className="float-end">
                              <small className="text-medium-emphasis">
                                {item.branch}
                              </small>
                            </div>
                          </div>
                        )}
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
                                placeholder="Category Name"
                                aria-label="Name"
                                aria-describedby="basic-addon1"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CFormInput type="file" id="inputGroupFile01" />
                              <CInputGroupText
                                component="label"
                                htmlFor="inputGroupFile02"
                              >
                                Upload Image
                              </CInputGroupText>
                            </CInputGroup>
                            <CFormSelect
                              aria-label="Select Branch"
                              value={selectedBranch}
                              onChange={(e) =>
                                setSelectedBranch(e.target.value)
                              }
                            >
                              {branches.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
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
            <CModalTitle>Add Admin</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                aria-label="Name"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CFormInput
                type="file"
                id="inputGroupFile01"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <CInputGroupText component="label" htmlFor="inputGroupFile02">
                Upload Image
              </CInputGroupText>
            </CInputGroup>
            <CFormSelect
              aria-label="Select Branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {branches.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
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

export default Menu;
