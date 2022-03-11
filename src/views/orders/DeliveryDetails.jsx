import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import { getBaseURL } from "src/routes/login";
const axios = require("axios");

const DeliveryDetails = (props) => {
  const [data] = useState(props.details);
  const [menu, setMenu] = useState([]);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const url = getBaseURL();
  const token = sessionStorage.getItem("token");
  const headerConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };

  const [method, setMethod] = useState("");
  const [offer, setOffer] = useState(null);
  const [redeem, setRedeem] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [menuItem, setMenuItem] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [size, setSize] = useState("");
  const [sum, setSum] = useState(null);
  const [points, setPoints] = useState(null);
  const [cartId, setCartId] = useState("");

  useEffect(() => {
    console.log(props);
    setTimeout(() => {
      getCartItems();
      getPayment();
      getMenu();
    }, 1500);

    return () => console.log("unmounting...");
  }, []);

  function getMenu() {
    axios
      .get(url + "/get/menu/all/items", headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          let data = resp.data;
          //items.push(resp.data)
          setMenu(data);
          //console.log(resp);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function getCartItems() {
    axios
      .get(url + "/get/cart/order/" + data.id, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          let data = resp.data;
          //items.push(resp.data)
          setItems(data);
          //console.log(resp);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function getPayment() {
    axios
      .get(url + "/get/payment/order/" + data.id, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          let data = resp.data;
          //items.push(resp.data)
          setPayment(data);
          //console.log(resp);
          setMethod(payment.method);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function updatePaymentStatus() {
    axios
      .put(
        url + "/update/payment/" + payment.id + "/" + !payment.status,
        headerConfig
      )
      .then((resp) => {
        if (resp.status === 200) {
          getPayment();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function calculations() {
    let sum = 0;
    let points = 0;
    items.forEach((item, i) => {
      sum = sum + item.item.id.price * item.item.quantity;
      points = points + item.item.id;
      setSum(sum);
      setPoints(points);
    });
  }

  function addMenuItem() {
    
    let item = {
      item: {
        id: menuItem,
        quantity: quantity,
        size: size,
      },
      customer: data.customer._id,
      order: data.id,
    };
    //console.log(item);
    axios
      .post(url + "/add/cart", item, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          //console.log(resp);
          getCartItems();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    calculatePayment()
  }

  function calculatePayment(){
    calculations();
    let pay = {
      netAmount: payment.deliveryFee + sum - payment.redeem,
      totalPoints: Number(points),
      totalBill: sum,
    };
    //console.log(pay);
    axios
      .put(url + "/update/payment/" + payment.id, pay, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          //console.log(resp);
          getPayment();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function updatePayment() {
    let body = {
      method: method,
      deliveryFee: Number(deliveryFee),
      redeem: Number(redeem),
      offer: Number(offer),
      totalBill: payment.totalBill,
    };
    //console.log(body);
    axios
      .put(url + "/update/admin/payment/" + payment.id, body, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          //console.log(resp);
          getPayment();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function updateitem(item){
    console.log(item)
    setCartId(item.id)
    setMenuItem(item.item.id._id)
    setQuantity(item.item.quantity)
    setSize(item.item.size)
    setVisible3(!visible3)
  }

  function updateMenuItem(){
    calculations();
    let item = {
      item: {
        id: menuItem,
        quantity: quantity,
        size: size,
      },
      customer: data.customer._id,
      order: data.id,
    };
    //console.log(item);
    axios
      .put(url + "/update/cart/"+cartId, item, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          //console.log(resp);
          getCartItems();
          calculatePayment();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function deleteItem(id){
    axios
      .get(url + "/delete/cart/"+id, headerConfig)
      .then((resp) => {
        if (resp.status === 200) {
          //console.log(resp);
          getCartItems();
          calculatePayment();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  return (
    <>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableBody>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>
                <strong>Order Number:</strong>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div>
                <strong>{data.orderNumber}</strong>
              </div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>
                <strong>Instructions:</strong>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{data.instructions}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>
                <strong>Customer Name:</strong>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{data.customer.name}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>
                <strong>Customer Email:</strong>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{data.customer.email}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>
                <strong>Customer Phone Number:</strong>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{data.customer.phoneNumber}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>
                <strong>Customer DoB:</strong>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{data.customer.dob}</div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <div style={{ height: 20 }}></div>
      <div style={{ width: "100%" }}>
        <CButton
          color="primary"
          className="float-end"
          onClick={() => setVisible2(true)}
        >
          Add Items
        </CButton>
      </div>
      <br />
      <br />
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableBody>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Item Name</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Points</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Size</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Quantity</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Price</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Total</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Discounted Price</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Update</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>Delete</div>
            </CTableDataCell>
          </CTableRow>
          {items.map((item, i) => (
            <CTableRow key={i}>
              <CTableDataCell>
                <div>{item.item.id.name}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.item.id.points}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.item.size}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.item.quantity}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>AED {item.item.id.price}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>AED {item.item.id.price * item.item.quantity}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>
                  AED{" "}
                  {item.item.id.price * item.item.quantity -
                    (item.item.id.price *
                      item.item.quantity *
                      item.item.id.discount) /
                      100}
                </div>
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="float-end"
                  onClick={() => updateitem(item)}
                >
                  Update
                </CButton>
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="danger"
                  style={{ color: "white" }}
                  className="float-end"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <div style={{ height: 20 }}></div>
      <div style={{ width: "100%" }}>
        <CButton
          color="primary"
          className="float-end"
          onClick={() => setVisible(true)}
        >
          Update Payment
        </CButton>
      </div>
      <br />
      <br />
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableBody>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Method</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.method}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Offer</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.offer}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Redeem</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.redeem}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Total points</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.totalPoints}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Total Amount</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.totalBill}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Delivery Fee</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.deliveryFee}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Net Amount</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.netAmount}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow v-for="item in tableItems">
            <CTableDataCell>
              <div>Status</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{payment.status ? "Payed" : "Not Payed"}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <div>Change Payment Status</div>
            </CTableDataCell>
            <CTableDataCell>
              <CButton
                color="primary"
                className="float-end"
                onClick={() => updatePaymentStatus()}
              >
                Change
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <>
        <CModal
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Update Payment</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Method</CInputGroupText>
              <CFormSelect
                aria-label="Select Payment Method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="points">Reward Points</option>
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Offer Amount</CInputGroupText>
              <CFormInput
                type="number"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Offer Amount"
                aria-label="offer"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Redeem Amount</CInputGroupText>
              <CFormInput
                type="number"
                value={redeem}
                onChange={(e) => setRedeem(e.target.value)}
                placeholder="Redeem Amount"
                aria-label="redeem"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Delivery Fee</CInputGroupText>
              <CFormInput
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="Delivery Fee"
                aria-label="fee"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => updatePayment()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
      <>
        <CModal
          backdrop="static"
          visible={visible2}
          onClose={() => setVisible2(false)}
        >
          <CModalHeader>
            <CModalTitle>Add to Cart</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Menu Item</CInputGroupText>
              <CFormSelect
                aria-label="Select Menu Item"
                value={menuItem}
                onChange={(e) => setMenuItem(e.target.value)}
              >
                <option unselectable="true">Select Menu Item</option>
                {menu.map((men) => (
                  <option value={men.id} key={men.id}>
                    {men.name}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Quantity</CInputGroupText>
              <CFormInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                aria-label="quantity"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Menu Item</CInputGroupText>
              <CFormSelect
                aria-label="Select Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option unselectable="true">Select Size</option>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
              </CFormSelect>
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible2(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => addMenuItem()}>
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
            <CModalTitle>Add to Cart</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Menu Item</CInputGroupText>
              <CFormSelect
                aria-label="Select Menu Item"
                value={menuItem}
                onChange={(e) => setMenuItem(e.target.value)}
              >
                <option unselectable="true">Select Menu Item</option>
                {menu.map((men) => (
                  <option value={men.id} key={men.id}>
                    {men.name}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Quantity</CInputGroupText>
              <CFormInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                aria-label="quantity"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Menu Item</CInputGroupText>
              <CFormSelect
                aria-label="Select Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option unselectable="true">Select Size</option>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
              </CFormSelect>
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible3(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => updateMenuItem()}>
              Update
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    </>
  );
};

DeliveryDetails.propTypes = {};

export default DeliveryDetails;
