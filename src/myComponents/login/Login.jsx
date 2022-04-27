import React, { useEffect, useState, useRef } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { adminLogin, getToken, setToken, setRole } from "../../routes/login";
import { useHistory } from "react-router-dom";
const axios = require("axios");
import { getBaseURL } from "src/routes/login";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendData, setBackendData] = useState("");
  const [isLoggedIn, logginIn] = useState(false);
  const [toast, addToast] = useState(0);
  const toaster = useRef();

  const history = useHistory();
  const baseURL = getBaseURL();

  const exampleToast = (
    <CToast title="Login Failed">
      <CToastHeader closeButton>
        <strong className="me-auto">Login Failed</strong>
        <small>Try again</small>
      </CToastHeader>
      <CToastBody>Invalid Email or Password</CToastBody>
    </CToast>
  );

  // useEffect(() => {
  //   fetch(baseURL + "/get/admin/620b8614537f736bdb308858", { mode: "cors" })
  //     .then((response) => console.log(response))
  //     .then((data) => {
  //       setBackendData(data);
  //       console.log(data);
  //     });
  // }, []);
  // useEffect(() => {
  //   //sessionStorage.removeItem("token")
  //   if (sessionStorage.getItem("token")) {
  //     history.push("/dashboard");
  //   } else {
  //     history.push("/login");
  //   }
  // });
  function login() {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post(
        baseURL + "/login/admin",
        {
          email: email,
          password: password
        },
        // { mode: "cors" },
        // axiosConfig
      )
      .then((res) => {
        if (res.status === 200) {
          setToken(res.data.accessToken);
          setRole(res.data.admin.role);
          console.log("RESPONSE RECEIVED: ", res);
          //return res;
          history.push("/dashboard");
        } else {
          console.log("LOGIN UNSUCCESSFUL!");
          //sessionStorage.removeItem("token");
          //return res;
        }
      })
      .catch((err) => {
        //sessionStorage.removeItem("token");
        console.log("AXIOS ERROR: ", err);
        //return false
      });
    // adminLogin(email, password)

    //  console.log(sessionStorage.getItem("token"))
    //  if (sessionStorage.getItem("token")) {
    //    history.push("/dashboard");
    //   }
    //   else{
    //   }

    //console.log(adminLogin(email, password));
    // else {
    //   console.log("Login Failed")
    //   addToast(exampleToast);
    //   return (
    //     <>
    //       <CToaster ref={toaster} push={toast} placement="top-end" />
    //     </>
    //   );
    // }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1 style={{ color: "#742013" }}>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          style={{
                            backgroundColor: "#742013",
                            borderColor: "#742013",
                          }}
                          className="px-4"
                          onClick={login}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white py-5"
                style={{ width: "44%", backgroundColor: "#ddc16d" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Restaurant Name</h2>
                    <p>
                      {backendData}
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    {/* <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
