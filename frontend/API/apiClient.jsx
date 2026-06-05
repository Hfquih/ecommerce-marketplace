import axios from "axios";

export default function ApiClient(){
   const client = axios.create({baseURL: import.meta.env.VITE_API_URL , withCredentials: true});
   console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
   console.log("BASE_URL =", client.defaults.baseURL);

   return client
}