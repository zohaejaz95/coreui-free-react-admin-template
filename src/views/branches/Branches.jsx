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
  const [id, setID] = useState("");
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
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getAllBranches();
    return () => console.log("unmounting...");
  }, []);

  function getAllBranches() {
    axios
      .get(url + "/get/all/branches", headerConfig)
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

  function setDefaultValues() {
    setName("");
    setAddress("");
    setCity("");
    setState("");
    setFloor(0);
    setLocation("");
    setImage("");
    setID("");
  }
  function updateBranch(id) {
    var regex = new RegExp("@(.*),(.*)");
    var lat_long_match = location.match(regex);
    var lat = lat_long_match[1];
    var long = lat_long_match[2];
    let body = {
      name: name,
      address: address,
      city: city,
      state: state,
      floor: floor,
      image: image,
      location: {
        lat: lat,
        lng: long,
      },
    };
    console.log(body);
    axios
      .put(url + "/update/branch/" + id, body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          getAllBranches();
          //setDefaultValues();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }
  function viewModal(data) {
    // if (visible) {
    // } else {
    //   setDefaultValues();
    // }
    setDefaultValues();
    setName(data.name);
    setAddress(data.address);
    setCity(data.city);
    setState(data.state);
    setFloor(data.floor);
    setLocation(
      "https://www.google.com/maps/place//@" +
        data.location.lat +
        "," +
        data.location.lng
    );
    setImage(data.image);
    setID(data.id);
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
      .get(url + "/delete/branch/" + id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED");
          getAllBranches();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function uploadImage() {}

  function addBranch() {
    var regex = new RegExp("@(.*),(.*),");
    var lat_long_match = location.match(regex);
    var lat = lat_long_match[1];
    var long = lat_long_match[2];
    let body = {
      name: name,
      address: address,
      city: city,
      state: state,
      floor: floor,
      image: image,
      location: {
        lat: lat,
        lng: long,
      },
    };
    console.log(body);
    axios
      .post(url + "/add/branch", body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          getAllBranches();
        }
        //setDefaultValues();
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
                  <CTableRow>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Sr#.</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div>
                        <strong>Image</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Name</strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>City</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>Location</strong>
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
                  {backendData !== [] ? (
                    backendData.map((item, index) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>
                          <div className="clearfix">
                            <div className="float-start">
                              <strong>{index + 1}</strong>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={item.image} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="clearfix">
                            <div className="float-start">
                              <strong>{item.name}</strong>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.city + ", " + item.state}</div>
                          <div className="small text-medium-emphasis">
                            Address: {item.address + ", floor: " + item.floor}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            className="float-end"
                            href={
                              "https://www.google.com/maps/dir//" +
                              item.location.lat +
                              "," +
                              item.location.lng
                            }
                          >
                            Location
                          </CButton>
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
                              <CModalTitle>Update Branch</CModalTitle>
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
                              <CInputGroup className="mb-3">
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
                                onClick={() => updateBranch(id)}
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
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon2">Location</CInputGroupText>
              <CFormInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                aria-label="Location"
                aria-describedby="basic-addon2"
              />
            </CInputGroup>
            {/* <CInputGroup className="mb-3">
              <CFormInput type="file" id="inputGroupFile01" />
              <CInputGroupText component="label" htmlFor="inputGroupFile02">
                Upload Image
              </CInputGroupText>
                          </CInputGroup>*/}
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
