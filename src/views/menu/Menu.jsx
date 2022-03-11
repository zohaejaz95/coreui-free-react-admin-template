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
//import Select from "react-select";
//import makeAnimated from "react-select/animated";

const Menu = () => {
  //const animatedComponents = makeAnimated();
  const [backendData, setBackendData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [filteredBranch, setFilteredBranch] = useState("");
  const [prom, setProm] = useState([]);
  const [id, setID] = useState([]);
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
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getAllCategories();
    axios
      .get(url + "/get/all/branches", headerConfig)
      .then((res) => {
        if (res.status === 200) {
          setBranches(res.data);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    return () => console.log("unmounting...");
  }, []);

  function getBranchCategoryByID(branchID) {
    if (branchID === "all") {
      getAllCategories();
      setFilteredBranch("");
    } else {
      setFilteredBranch(branchID);
      axios
        .get(url + "/get/category/branch/" + branchID, headerConfig)
        .then((res) => {
          if (res.status === 200) {
            let data = res.data;
            const promise = data.map((item, index) => {
              let arr = [];
              const prom = item.branch.map((br, i) => {
                axios
                  .get(url + "/get/branches/" + br, headerConfig)
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
                  //setProm(prom);
                });
              }, 1000);
            });
            setTimeout(() => {
              Promise.all(promise).then(function () {
                setBackendData(data);
                console.log(backendData)
              });
            }, 3000);
          }
          console.log(backendData)
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
        });
    }
  }

  function getAllCategories() {
    axios
      .get(url + "/get/all/category", headerConfig)
      .then((res) => {
        //console.log(res);
        if (res.status === 200) {
          let data = res.data;
          const promise = data.map((item, index) => {
            //console.log(item.branch);
            let arr = [];
            const prom = item.branch.map((br, i) => {
              axios
                .get(url + "/get/branches/" + br, headerConfig)
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
            });
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function setDefaultValues() {
    setID("");
    setName("");
    setImage("");
    setBranch("");
    setPhoneNumber("");
  }
  function updateCustomer(id) {
    //let arr = [];
    //arr.push(selectedBranch)
    let body = {
      name: name,
      image: image,
      branch: selectedBranch,
    };
   // console.log(arr);
    axios
      .put(url + "/update/category/" + id, body, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          if (filteredBranch === "") {
            getAllCategories();
          } else getBranchCategoryByID(branch);
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
    //console.log(backendData);
    setID(data.id);
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

  function deleteCategory(id) {
    axios
      .get(url + "/delete/category/" + id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          //console.log("RESPONSE RECEIVED: ", admins);
          if (filteredBranch === "") {
            getAllCategories();
          } else getBranchCategoryByID(branch);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addCustomer() {
    //let arr = [];
    ///arr.push(branch);
    let body = {
      name: name,
      image: image,
      branch: selectedBranch,
    };
    axios
      .post(url + "/add/category", body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          if (filteredBranch === "") {
            getAllCategories();
          } else getBranchCategoryByID(branch);
          setDefaultValues();
          //console.log("RESPONSE RECEIVED: ", res);
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
              Menu Categories
              <CFormSelect
              style={{width: "30%", marginLeft: 10}}
                className="float-end"
                aria-label="Select Branch"
                value={filteredBranch}
                onChange={(e) => getBranchCategoryByID(e.target.value)}
              >
                <option value="all">All Branches</option>
                {
                  branches.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))
                }
              </CFormSelect>
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
                  <CTableRow>
                    <CTableDataCell>
                      <div>
                        <strong>Sr#.</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>Image</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>Name</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                    <div className="clearfix">
                            <div className="float-start">
                              <strong>Branch/es: </strong>
                            </div>
                          </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>Update</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>Delete</strong>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                  {
                    backendData.map((item, index) => (
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
                          
                          {item.branchName ? (
                            item.branchName.map((i, j) => (
                              <div className="clearfix" key={j}>
                                <div className="float-start">
                                  <small className="text-medium-emphasis">
                                    {i}
                                  </small>
                                </div>
                              </div>
                            ))
                          ) : ( 
                            <div className="clearfix" >
                              <div className="float-end">
                                <small className="text-medium-emphasis">
                                  {item.branchName}
                                </small>
                              </div>
                            </div>
                          )}
                          {/* {item.branchName.map((i, j) => (
                              <div className="clearfix" key={j}>
                                <div className="float-start">
                                  <small className="text-medium-emphasis">
                                    {i}
                                  </small>
                                </div>
                              </div>
                            ))} */}
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
                            onClick={() => deleteCategory(item.id)}
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
                              {/* <CInputGroup className="mb-3">
                              <CFormInput type="file" id="inputGroupFile01" />
                              <CInputGroupText
                                component="label"
                                htmlFor="inputGroupFile02"
                              >
                                Upload Image
                              </CInputGroupText>
                            </CInputGroup> */}
                              <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon2">
                                  Image
                                </CInputGroupText>
                                <CFormInput
                                  value={image}
                                  onChange={(e) => setImage(e.target.value)}
                                  placeholder="Image Link"
                                  aria-label="Image Link"
                                  aria-describedby="basic-addon2"
                                />
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
                              {/* <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={branches !== []?}
                              /> */}
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
                  }
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

            {/* <CInputGroup className="mb-3">
              <CFormInput
                type="file"
                id="inputGroupFile01"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <CInputGroupText component="label" htmlFor="inputGroupFile02">
                Upload Image
              </CInputGroupText>
            </CInputGroup> */}
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon2">Image</CInputGroupText>
              <CFormInput
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image Link"
                aria-label="Image Link"
                aria-describedby="basic-addon2"
              />
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
