import Axios from "axios";
let token = localStorage.getItem("accessToken") || "";

const axios = Axios.create({
  baseURL: `https://lefabre-api.b2gsoft.xyz/api/v1`, // live

  // baseURL:
  //   process.env.NODE_ENV === "development"
  //     ? `http://localhost:6038/api/v1`
  //     : `https://api.le-fabre.com/api/v1`, // live

  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axios;
