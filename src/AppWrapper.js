import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { Error } from './pages/Error';
import { NotFound } from './pages/NotFound';
import { Access } from './pages/Access';
import { useDispatch, useSelector } from 'react-redux';
import { Axios } from './AxiosConfig';
import { loginSuccess, logout, userLoaded, userLoading } from './slice/loginSlice';
import Artifact from './pages/Artifact';

const AppWrapper = () => {
    let location = useLocation();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.login.isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        
        dispatch(userLoading());
        Axios.get("/user/gettoken")
            .then(async (resp) => {
                await dispatch(loginSuccess(resp.data))
                await Axios.get("/user/dashboard", {
                    headers: {
                        "User-Authorization": resp.data.token,
                        "Content-Type": 'application/json'
                    }
                })
                    .then((res) => {
                        dispatch(userLoaded(res.data));
                        navigate("/")
                    }).catch(err => {
                        dispatch(logout())
                        console.log(err)
                    })
            }).catch(err => {
                dispatch(logout())
                console.log(err)
            })
        // eslint-disable-next-line
    }, [])

    const tokenRefresh = () => {
        Axios.get("/user/gettoken")
            .then(async (resp) => {
                await dispatch(loginSuccess(resp.data))
            }).catch(err => {
                console.log(err)
            })
        setTimeout(() => {
            tokenRefresh()
        }, (900 * 1000) - 500)

    }

    useEffect(() => {
        tokenRefresh();
    }, [])

    return (
        <div>
            {isLogin ?
                <Routes>
                    <Route path="*" element={<App />} />
                </Routes> :
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/error" element={<Error />} />
                    <Route path="/notfound" element={<NotFound />} />
                    <Route path="/access" element={<Access />} />
                    <Route path="/artifact/:id" element={<Artifact />} />

                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            }
        </div>
    );
};

export default AppWrapper;
