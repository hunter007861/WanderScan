import axios from "axios";
import { useSelector } from 'react-redux';

const AuthToken = () => {
   // eslint-disable-next-line
  const aa = useSelector(state => state.login.token)
}

const Axios = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "User-Authorization": AuthToken.aa,
        "Content-Type": 'application/json',
    },
    withCredentials:true
})

export { Axios, AuthToken }
