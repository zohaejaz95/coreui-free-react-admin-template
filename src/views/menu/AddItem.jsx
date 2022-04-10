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

const AddItem = () => {
  const [backendData, setBackendData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [seletedCategory, setSelectedCategory] = useState([]);
  const [prom, setProm] = useState([]);
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [small, setSmall] = useState(0);
  const [large, setLarge] = useState(0);
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [points, setPoints] = useState(null);
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
    getAllMenuItems();
    //get all branches
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
    //get all categories
    axios
      .get(url + "/get/all/category", headerConfig)
      .then((res) => {
        if (res.status === 200) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
    return () => console.log("unmounting...");
  }, []);

  function getMenuItemsByCategory(categoryID) {
    //backendData.filter()
    console.log(categoryID);
    setSelectedCategory(categoryID);
    if (categoryID === "all") {
      getAllMenuItems();
    } else {
      getItemsOnSelectedCategory();
    }
  }

  function getItemsOnSelectedCategory() {
    axios
      .get(url + "/get/menu/category/" + seletedCategory, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          setBackendData(res.data);
          //setSelectedCategory(res.data);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function getAllMenuItems() {
    axios
      .get(url + "/get/menu/all/items", headerConfig)
      .then((res) => {
        if (res.status === 200) {
          let data = res.data;
          console.log(data);
          setBackendData(data);
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
    setCategory("");
    setPrice(null);
    setDiscount(null);
    setPoints(null);
  }
  function updateMenuItem() {
    let body = {
      name: name,
      image: image,
      category: category,
      points: points,
      discount: Number(discount),
      price: price,
      small: small,
      large: large,
    };
    //console.log(body, id);
    axios
      .put(url + "/update/menu/items/" + id, body, headerConfig)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (seletedCategory === "all") getItemsOnSelectedCategory();
          else getAllMenuItems();
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
    setID(data.id);
    setName(data.name);
    setImage(data.image);
    setCategory(data.category);
    setPoints(data.points);
    setPrice(data.price);
    setDiscount(data.discount);
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
      .get(url + "/delete/menu/items/" + id, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED");
          getAllMenuItems();
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  function addMenuItem() {
    let body = {
      name: name,
      image: image,
      category: category,
      points: points,
      discount: Number(discount),
      price: price,
      small: small,
      large: large,
    };
    console.log(body)
    axios
      .post(url + "/add/menu/items", body, headerConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE RECEIVED: ", res);
          getAllMenuItems();
          //setDefaultValues();
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
              Menu Items
              {/* <CFormSelect
                // multiple={true}
                aria-label="Select Branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {branches.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </CFormSelect> */}
              <CFormSelect
                style={{ width: "30%", marginLeft: 10 }}
                // multiple={true}
                className="float-end"
                aria-label="Select Category"
                value={seletedCategory}
                onChange={(e) => getMenuItemsByCategory(e.target.value)}
              >
                <option value="all">All Items</option>
                {categories.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
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
                      <div>
                        <strong>Category</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Price </strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Points </strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Discount </strong>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>Discounted Price</strong>
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
                        <div>{item.category.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>AED {item.price}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div> {item.points}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.discount}%</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          AED {item.price - (item.price * item.discount) / 100}
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
                            <CModalTitle>Update Item</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Name
                              </CInputGroupText>
                              <CFormInput
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Item Name"
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
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Standard Size Price
                              </CInputGroupText>
                              <CFormInput
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Item Price"
                                aria-label="Price"
                                aria-describedby="basic-addon1"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Small Size Price
                              </CInputGroupText>
                              <CFormInput
                                type="number"
                                value={small}
                                onChange={(e) => setSmall(e.target.value)}
                                placeholder="Item Price"
                                aria-label="Price"
                                aria-describedby="basic-addon1"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Large Size Price
                              </CInputGroupText>
                              <CFormInput
                                type="number"
                                value={large}
                                onChange={(e) => setLarge(e.target.value)}
                                placeholder="Item Price"
                                aria-label="Price"
                                aria-describedby="basic-addon1"
                              />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Discount
                              </CInputGroupText>
                              <CFormInput
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder="Discount"
                                aria-label="Discount"
                                aria-describedby="basic-addon1"
                              />
                              <CInputGroupText id="basic-addon1">
                                %
                              </CInputGroupText>
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">
                                Points
                              </CInputGroupText>
                              <CFormInput
                                type="number"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                placeholder="Item Points"
                                aria-label="Points"
                                aria-describedby="basic-addon1"
                              />
                            </CInputGroup>
                            <CFormSelect
                              // multiple={true}
                              aria-label="Select Category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            >
                              <option unselectable="true">
                                  Select Category
                                </option>
                              {categories.map((item, index) => (
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
                              onClick={() => updateMenuItem()}
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
            <CModalTitle>Add Item</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item Name"
                aria-label="Name"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
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
              <CInputGroupText id="basic-addon1">
                Standard Size Price
              </CInputGroupText>
              <CFormInput
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Item Price"
                aria-label="Price"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">
                Small Size Price
              </CInputGroupText>
              <CFormInput
                type="number"
                value={small}
                onChange={(e) => setSmall(e.target.value)}
                placeholder="Item Price"
                aria-label="Price"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">
                Large Size Price
              </CInputGroupText>
              <CFormInput
                type="number"
                value={large}
                onChange={(e) => setLarge(e.target.value)}
                placeholder="Item Price"
                aria-label="Price"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Discount</CInputGroupText>
              <CFormInput
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Discount"
                aria-label="Discount"
                aria-describedby="basic-addon1"
              />
              <CInputGroupText id="basic-addon1">%</CInputGroupText>
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1">Points</CInputGroupText>
              <CFormInput
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Item Points"
                aria-label="Points"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
            <CFormSelect
              // multiple={true}
              aria-label="Select Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option unselectable="true">
                                  Select Category
                                </option>
              {categories.map((item, index) => (
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
            <CButton color="primary" onClick={() => addMenuItem()}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    </>
  );
};

export default AddItem;
