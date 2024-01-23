import Axios from "axios";
let token = localStorage.getItem("accessToken") || "";

const axios = Axios.create({
  // baseURL: `https://api.zerozb.me/api/v1`, // live

  baseURL:
    process.env.NODE_ENV === "development"
      ? `http://192.168.0.242:4317/api/v1`
      : `https://api-zero-me.zelbet.net/api/v1`, // live

  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axios;
