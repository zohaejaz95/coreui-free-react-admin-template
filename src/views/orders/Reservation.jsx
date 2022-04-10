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
import DineInDetails from "./DineInDetails";
import TimePicker from 'react-time-picker';

const Reservation = () => {
  const [backendData, setBackendData] = useState([]);
  const [value, onChange] = useState('10:00');
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [location, setLocation] = useState("");
  const [instructions, setInstructions] = useState("");
  const [branch, setBranch] = useState("");
  const [seats, setSeats] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisibleNew] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [status, setStatus] = useState("");
  const url = getBaseURL();
  const statuses = ["active", "completed", "approved","rejected"];
  const token = sessionStorage.getItem("token");
  const headerConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getOrders();
    return () => console.log("unmounting...");
  }, []);

  function getOrders() {
    axios
      .get(url + "/get/order/type/Reservation", headerConfig)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let data = res.data;
          console.log(data);
          setBackendData(data);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
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
  }

  function setDefaultValues() {
    setEmail("");
    setLocation("");
    //setBranch("");
  }
  function updateOrder(id) {
    let body = {
      instructions: instructions,
      location: location,
      branch: selectedBranch,
    };
    console.log(body);
    axios
      .put(url + "/update/order/"+id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          //setBranches(res.data);
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
    //setEmail(data.email);
    setId(data.id);
    setLocation(data.location);
    setBranch(data.branch);
    setSelectedBranch(data.branch)
    setInstructions(data.instructions)
    setVisible(!visible);
  }

  function statusModel(data) {
    if (visible3) {
    } else {
      setDefaultValues();
    }
    setId(data.id);
    setStatus(data.status);
    setEmail(data.email);
    setLocation(data.location);
    setBranch(data.branch);
    setSelectedBranch(data.branch)
    setVisible3(!visible3);
  }

  function viewDetails(data) {
    setDetailsData(data);
    setShowDetails(true);
  }

  function newOrderModel() {
    if (visible2) {
    } else {
      setDefaultValues();
    }
    setVisibleNew(!visible2);
  }

  function deleteOrder(id) {
    axios
      .get(url + "/delete/order/" + id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          getOrders()
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addInOrderTable(custId, custom){
    let body = {
      type: "Reservation",
      customer: custId,
      location: location,
      branch: selectedBranch,
      instructions: instructions,
      time: new Date(),
      status: "active",
      orderNumber: Math.floor(100000 + Math.random() * 900000),
    };
    //console.log(body);
    axios
      .post(url + "/add/order", body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          //orderId= res.data.id
          getOrders()
          addInDineInTable(custId,res.data.id,custom)
        }
        setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addInDineInTable(custId, orderId, custom){
    let dine = {
      //type: "Reservation",
      seats: seats,
      customer: custId,
      name: custom.name,
      email: custom.email,
      branch: selectedBranch,
      phone: custom.phoneNumber,
      time: value,
      date: new Date(),
      order : orderId
    };
    console.log(dine);
    axios
      .post(url + "/add/dine", dine, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          addPayment(orderId)
        }
        //setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addPayment(order_id){
    let pay = {
      order: order_id,
      totalBill: 0,
      redeem: 0,
      offer: 0,
      totalPoints: 0,
      method: 0,
      status: 0,
      deliveryFee: 0,
      netAmount: 0,
    }
    axios
      .post(url + "/add/payment" , pay,headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          //alert(res.data.id);
        }
        //setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addOrder() {
    //let custId = "";
    //let custom 
    //let orderId = ""
    console.log(email);
    axios
      .get(url + "/get/customer/email/" + email, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          //custId = res.data.id;
          //custom = res.data
          console.log("RESPONSE RECEIVED: ", res);
          alert(res.data.email);
          addInOrderTable(res.data.id, res.data)
        }
        setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    // setTimeout(() => {
      
    // }, 2000);
  }

  function updateOrderStatus() {
    //console.log(item)
    axios
      .put(url + "/update/order/" + id + "/status/" + status, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          getOrders();
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
              Reservation
              <CButton
                color="primary"
                className="float-end"
                onClick={() => newOrderModel()}
              >
                Add Order
              </CButton>
            </CCardHeader>
            <CCardBody>
              {showDetails ? (
                <DineInDetails details={detailsData}></DineInDetails>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableBody>
                    <CTableRow v-for="item in tableItems">
                      <CTableDataCell>
                        <div>Sr#.</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Order Number</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Customer Name</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Location</div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div>Date/Time</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Status</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Status Update</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Update</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Delete</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>Details</div>
                      </CTableDataCell>
                    </CTableRow>
                    {backendData.map((item, index) => (
                      <CTableRow v-for="item in tableItems" key={item.id}>
                        <CTableDataCell>
                          <div>{index + 1}.</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.orderNumber}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div>{item.customer.name}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            className="float-end"
                            //onClick={() => viewModal(item)}
                            href={item.location}
                          >
                            View
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.time}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.status}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            className="float-end"
                            onClick={() => statusModel(item)}
                          >
                            Status
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
                            onClick={() => deleteOrder(item.id)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            className="float-end"
                            onClick={() => viewDetails(item)}
                          >
                            Details
                          </CButton>
                        </CTableDataCell>
                        <>
                          <CModal
                            backdrop="static"
                            visible={visible}
                            onClose={() => setVisible(false)}
                          >
                            <CModalHeader>
                              <CModalTitle>Update Order</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                              <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon1">
                                  Instructions
                                </CInputGroupText>
                                <CFormInput
                                  value={instructions}
                                  onChange={(e) =>
                                    setInstructions(e.target.value)
                                  }
                                  placeholder="Instructions"
                                  aria-label="Instructions"
                                  aria-describedby="basic-addon1"
                                />
                              </CInputGroup>
                              <CInputGroup className="mb-3">
                                <CInputGroupText id="basic-addon1">
                                  Location
                                </CInputGroupText>
                                <CFormInput
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  placeholder="Location Link"
                                  aria-label="Location"
                                  aria-describedby="basic-addon1"
                                />
                              </CInputGroup>
                              <CFormSelect
                                aria-label="Select Branch"
                                value={selectedBranch}
                                onChange={(e) =>
                                  setSelectedBranch(e.target.value)
                                }
                              >
                                <option >
                                    Select Branch
                                  </option>
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
                                onClick={() => updateOrder(item.id)}
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
              )}
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
            <CModalTitle>Add Reservation</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Instructions</CInputGroupText>
              <CFormInput
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions"
                aria-label="Instructions"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Location</CInputGroupText>
              <CFormInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location Link"
                aria-label="Location"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">
                Customer Email
              </CInputGroupText>
              <CFormInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Customer Email"
                aria-label="Customer Email"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">
               Seats
              </CInputGroupText>
              <CFormInput
              type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="Total seats"
                aria-label="seats"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">
                Time
              </CInputGroupText>
              <TimePicker onChange={onChange} value={value} />
            </CInputGroup>
            <CFormSelect
              aria-label="Select Branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option >
                                    Select Branch
                                  </option>
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
            <CButton color="primary" onClick={() => addOrder()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
      <>
        <CModal
          backdrop="static"
          visible={visible3}
          onClose={() => setVisible3(false)}
        >
          <CModalHeader>
            <CModalTitle>Update Status</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormSelect
              aria-label="Select Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </CFormSelect>
          </CModalBody>
          
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible3(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => updateOrderStatus()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    </>
  );
};

export default Reservation;
