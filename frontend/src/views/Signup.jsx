import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
// axiosClient

function Signup() {
    const nameRef = createRef();
    const emailRef = createRef();
    const passwordRef = createRef();
    const passwordConfirmationRef = createRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };
    return (
        <div className="container">
            <div className="login-form">
                <p className="h3">Register</p>
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <div className="inputgroup">
                        <label htmlFor="name" className="placeholder">
                            Name
                        </label>
                        <input type="text" required ref={nameRef} />
                    </div>
                    <div className="inputgroup">
                        <label htmlFor="email" className="placeholder">
                            Email
                        </label>
                        <input type="text" required ref={emailRef} />
                    </div>
                    <div className="inputgroup">
                        <label htmlFor="email" className="placeholder">
                            Password
                        </label>
                        <input type="password" ref={passwordRef} required />
                    </div>
                    <div className="inputgroup">
                        <label
                            htmlFor="confirm password"
                            className="placeholder"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirm password"
                            ref={passwordConfirmationRef}
                            required
                        />
                    </div>

                    <button type="submit">Register</button>
                </form>
                <p className="message">
                    Have an Account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
