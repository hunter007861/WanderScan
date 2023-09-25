import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { loginSuccess, logout, userLoaded, userLoading } from '../slice/loginSlice';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDispatch, useSelector } from 'react-redux';
import { Axios } from '../AxiosConfig';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [details, setDetails] = useState({
        userID: '',
        password: ''
    });

    const loading = useSelector((state) => state.login.isloading);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async () => {
        console.log(details);
        await dispatch(userLoading());
        await Axios.post('/user/login', details)
            .then(async (res) => {
                console.log(res);
                if ((res.data.status = 200)) {
                    await dispatch(loginSuccess(res.data));
                    await Axios.get('/user/dashboard', {
                        headers: {
                            'User-Authorization': res.data.token,
                            'Content-Type': 'application/json'
                        }
                    }).then(async (resp) => {
                        dispatch(userLoaded(resp.data));
                        navigate('/');
                    });
                } else {
                    dispatch(logout());
                    console.log('loginFailed');
                }
            })
            .catch((err) => {
                dispatch(logout());
                console.log(err);
            });
    };

    return (
        <div className="login-body">
            <div className="login-wrapper">
                <div className="login-panel">
                    <img src="assets/layout/images/logo-dark.svg" className="logo" alt="diamond-layout" />
                    {loading ? (
                        <div className="login-form">
                            <ProgressSpinner />
                        </div>
                    ) : (
                        <div className="login-form">
                            <h2>Login</h2>
                            <p>
                                Dont have an account? <a href="/">Signup</a>
                            </p>
                            <InputText
                                placeholder="Email"
                                onChange={(e) => {
                                    setDetails({ ...details, userID: e.target.value });
                                }}
                            />
                            <Password
                                placeholder="Password"
                                onChange={(e) => {
                                    setDetails({ ...details, password: e.target.value });
                                }}
                            />
                            <Button label="Login" type="button" onClick={onSubmit}></Button>
                        </div>
                    )}

                    <p>
                        A problem? <a href="/">Click here</a> and let us help you.
                    </p>
                </div>
                <div className="login-image">
                    <div className="login-image-content">
                        <h1>Access to your</h1>
                        <h1>Wander Scan</h1>
                        <h1>Account</h1>
                        <h3>
                            Wander Scan is an innovative web application designed to enhance<br/>
                             the museum experience for both visitors and curators. <br />
                            This application simplifies the process of accessing detailed information<br/>
                             about museum artifacts by leveraging QR code technology.
                        </h3>
                    </div>
                    <div className="image-footer">
                        <p>Connect Our Social Media.</p>
                        <div className="icons">
                            <i className="pi pi-github"></i>
                            <i className="pi pi-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
