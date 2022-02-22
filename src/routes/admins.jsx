const axios = require("axios");
const baseURL = "http://localhost:5000";

export function getAllAdmins() {
    console.log(sessionStorage.getItem("token"))
    let token = sessionStorage.getItem("token");
    console.log(token)
    const headerConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          //Authorization: token,
          'authorization': token
          //'Authorization': `token ${token}`
        },
      };
  let data;
  axios
    .get(baseURL + "/get/all/admin/", { mode: "cors" },{headers:  { Authorization: `Bearer ${token}` }})
    .then((res) => {
      if (res.status === 200) {
        console.log("RESPONSE RECEIVED: ", res);
        data= res.data
      }
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    });
    return data
}
