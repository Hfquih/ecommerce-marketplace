import axios from "axios";

export default function ApiClient(){
   return axios.create({baseURL: import.meta.env.VITE_API_URL , withCredentials: true});
}