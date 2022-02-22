import { useHistory } from "react-router-dom";
const axios = require("axios");
const baseURL = "http://localhost:5000";
var token = "";
var role = "";

export function  getBaseURL(){
  return baseURL;
}
export const makeAPICall = async () => {
  try {
    const response = await fetch("http://localhost:5000/", { mode: "cors" });
    const data = await response.json();
    console.log({ data });
  } catch (e) {
    console.log(e);
  }
};
// const api = axios.create({
//   baseURL: `http://localhost:5000`,
// });
let headerConfig = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Basic ${token}`,
  },
};

export function getToken() {
  return sessionStorage.getItem("token");
}

export function setToken(access_token) {
  sessionStorage.setItem("token", access_token);
  //console.log(sessionStorage.getItem("token"));
  token = access_token;
}

export function setRole(adminRole) {
  sessionStorage.setItem("role", adminRole);
  role = adminRole;
}

export function adminLogin(email, password) {
  sessionStorage.clear()
  //sessionStorage.removeItem("token");
  //sessionStorage.removeItem("role");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };
  axios
    .get(
      baseURL + "/login/admin/" + email + "/" + password,
      { mode: "cors" },
      axiosConfig
    )
    .then((res) => {
      if (res.status === 200) {
        setToken(res.data.accessToken);
        setRole(res.data.admin.role);
        console.log("RESPONSE RECEIVED: ", res);
        return res
      } else {
        console.log("LOGIN UNSUCCESSFUL!");
        //sessionStorage.removeItem("token");
        return res
      }
    })
    .catch((err) => {
      //sessionStorage.removeItem("token");
      console.log("AXIOS ERROR: ", err);
      //return false
    });
}
