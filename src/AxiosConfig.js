import axios from "axios";
import { useSelector } from 'react-redux';


const Axios = axios.create({
    baseURL: "http://192.168.0.115:5000",
    headers: { 
        "Content-Type": 'application/json',
    },
    withCredentials:true
})

const AuthToken = () => {
    const token = useSelector(state => state.login.token);

    if (token) {
      Axios.defaults.headers["User-Authorization"] = token;
    }
  
    return Axios;
}


export { Axios, AuthToken }
