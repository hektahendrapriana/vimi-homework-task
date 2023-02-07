import axios from "axios";
import { defaultConf } from "./DefaultConf";

export default () => {
  const token = sessionStorage.getItem('token');

  const instanceLogin = axios.create({
    baseURL: defaultConf.url,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const instanceDefault = axios.create({
    baseURL: defaultConf.url,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      Authorization: "",
    },
  });
  if (token) {
    return instanceLogin;
  } else {
    return instanceDefault;
  }
};
