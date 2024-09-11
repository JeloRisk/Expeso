import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
// axiosClient;
function Login() {
    const emailRef = createRef();
    const passwordRef = createRef();
    const { setUser, setToken, setRole } = useStateContext();
    const [message, setMessage] = useState(null);
    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                setRole(data.roles);
                console.log(data.roles);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessage(response.data.message);
                }
            });
    };
    return (
        <div className="container">
            <div className="login-form">
                <p className="h3">Sign in</p>
                {message && (
                    <div className="alert">
                        <p>{message}</p>
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <div className="inputgroup">
                        <label htmlFor="email" className="placeholder">
                            Email
                        </label>
                        <input type="email" required ref={emailRef} />
                    </div>
                    <div className="inputgroup">
                        <label htmlFor="email" className="placeholder">
                            Password
                        </label>
                        <input type="password" ref={passwordRef} required />
                    </div>

                    <button type="submit">Login</button>
                </form>
                <p className="message">
                    Not Registered? <Link to="/signup">Create an Account</Link>
                </p>
            </div>

            <div className="welcome-section">
                {/* <h2>Welcome Back!</h2>
                <p>We're excited to see you again. Log in to continue.</p> */}
            </div>
        </div>
    );
}

export default Login;
