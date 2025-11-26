import React from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function RegisterInput({ register }) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const Alert = withReactContent(Swal);

    const onNameChangeHandler = (event) => { setName(event.target.value) };
    const onEmailChangeHandler = (event) => (setEmail(event.target.value));
    const onPasswordChangeHandler = (event) => (setPassword(event.target.value));
    const onConfirmPasswordChangeHandler = (event) => (setConfirmPassword(event.target.value));

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

            // alert('Password tidak sama dengan konfirmasi password')
            Alert.fire({
                title: "Failed",
                text: "Password doesn't match with confirm password 🤞",
                icon: "error",
                backdrop: false,
                color: primary,
                confirmButtonColor: primary,
            })
            return;
        };
        register({
            name,
            email,
            password,
            confirmPassword,
        })
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <form onSubmit={onSubmitHandler} className="register-form">
            <label htmlFor="register-name">Name</label>
            <input type="text" id="register-name" placeholder="testo" value={name} onChange={onNameChangeHandler} />
            <label htmlFor="register-email">Email</label>
            <input type="email" id="register-email" placeholder="email@gmail.com" value={email} onChange={onEmailChangeHandler} />
            {/* PASSWORD */}
            <label htmlFor="register-password">Password</label>
            <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} id="register-password" placeholder="******" value={password} onChange={onPasswordChangeHandler} />
                <button type="button" className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>

            {/* CONFIRM PASSWORD */}
            <label htmlFor="register-confirmpassword">Confirm Password</label>
            <div className="password-wrapper">
                <input type={showConfirm ? "text" : "password"} id="register-confirmpassword" placeholder="******" value={confirmPassword} onChange={onConfirmPasswordChangeHandler} />
                <button type="button" className="password-toggle-icon" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            <button>Register</button>
        </form>
    )
}

RegisterInput.propTypes = {
    register: PropTypes.func.isRequired,
}

export default RegisterInput;