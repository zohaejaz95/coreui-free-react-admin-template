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
import DeliveryDetails from "./DeliveryDetails";

const Delivery = () => {
  const [backendData, setBackendData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [location, setLocation] = useState("");
  const [instructions, setInstructions] = useState("");
  const [branch, setBranch] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisibleNew] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [status, setStatus] = useState("");
  const url = getBaseURL();
  const statuses = ["active", "completed"];
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
      .get(url + "/get/order/type/Delivery", headerConfig)
      .then((res) => {
        // console.log(res);
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
      .put(url + "/update/order/" + id, body, headerConfig)
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
    setCount(data.customer.rewards);
    setLocation(data.location);
    setBranch(data.branch);
    setSelectedBranch(data.branch);
    setInstructions(data.instructions);
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
    setCount(data.customer.rewards);
    setBranch(data.branch);
    setSelectedBranch(data.branch);
    setVisible3(!visible3);
  }

  function viewDetails(data) {
    setDetailsData(data);
    console.log(data);
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
          getOrders();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addPayment(order_id) {
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
    };
    axios
      .post(url + "/add/payment", pay, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          alert(res.data.id);
        }
        //setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addOrder() {
    let custId = "";
    console.log(email);
    axios
      .get(url + "/get/customer/email/" + email, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          custId = res.data.id;
          console.log("RESPONSE RECEIVED: ", res);
          alert(res.data.email);
        }
        setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    setTimeout(() => {
      let body = {
        type: "Delivery",
        customer: custId,
        location: location,
        branch: selectedBranch,
        instructions: instructions,
        time: new Date(),
        status: "active",
        orderNumber: Math.floor(100000 + Math.random() * 900000),
      };
      console.log(body);
      axios
        .post(url + "/add/order", body, headerConfig)
        .then((res) => {
          if (res.status === 200) {
            console.log("RESPONSE RECEIVED: ", res);
            getOrders();
          }
          setDefaultValues();
          addPayment(res.data.id);
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
        });
    }, 1500);
  }

  function updateOrderStatus() {
    getPoints();
    axios
      .put(url + "/update/order/" + id + "/status/" + status, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          //console.log("RESPONSE RECEIVED: ", res);
          getOrders();
        }
        setDefaultValues();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function getPoints() {
    axios
      .get(url + "/get/cart/order/" + id, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          let data = resp.data;
          addRewards(data);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addRewards(data) {
    let counter = 0;
    console.log(data[0].customer)
    const prom = data.map((element) => {
      counter = counter + element.item.quantity * element.item.id.points;
    });
    setTimeout(() => {
      Promise.all(prom).then(function () {
        let total = count + counter;
        setCount(total);
        if (status === "completed") {
          axios
            .put(
              url + "/update/customer/rewards/" + data[0].customer,
              { rewards: total },
              headerConfig
            )
            .then((resp) => {
              if (resp.status === 200) {
                //let data = resp.data;
                console.log("Rewards Updated!");
                addCreditHistory(data[0].customer, counter)
              }
            })
            .catch((err) => {
              console.log("AXIOS ERROR: ", err);
            });
        }
      });
    }, 1000);
  }

  function addCreditHistory(customer, amount) {
    let order = {
      customer: customer,
      amount: amount,
      order: id,
    };
    console.log(order)
    axios
      .post(url + "/add/credit/order", order, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          //let data = resp.data;
          console.log("History Record Updated!", resp);
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
              Delivery
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
                <DeliveryDetails details={detailsData}></DeliveryDetails>
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
                                <option>Select Branch</option>
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
            <CModalTitle>Add Order</CModalTitle>
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
            <CFormSelect
              aria-label="Select Branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option>Select Branch</option>
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

export default Delivery;
