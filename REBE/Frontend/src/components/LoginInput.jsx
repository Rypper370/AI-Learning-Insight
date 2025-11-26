import React from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginInput({ login }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const onEmailChangeHandler = (event) => { setEmail(event.target.value) }
    const onPasswordChangeHandler = (event) => { setPassword(event.target.value) }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        login({
            email,
            password,
        });
        setEmail("");
        setPassword("");
    };

    return (
        <form onSubmit={onSubmitHandler} className="login-form">
            <label htmlFor="login-email">Email</label>
            <input type="email" id="login-email" placeholder="email@gmail.com" value={email} onChange={onEmailChangeHandler} />
            <label htmlFor="login-password">Password</label>
            <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} id="login-password" placeholder="******" value={password} onChange={onPasswordChangeHandler} />
                <button type="button" className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            <button>Enter</button>
        </form>
    )
}

LoginInput.propTypes = {
    login: PropTypes.func.isRequired,
}

export default LoginInput;