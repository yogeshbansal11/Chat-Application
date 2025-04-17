// import axios from "axios"
// import { HOST } from "../../utils/constants";

// export const apiClient = axios.create({
//   baseURL : HOST,
// })



import axios from "axios";
import { HOST } from "../../utils/constants";

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, // ✅ include cookies like JWT
});
