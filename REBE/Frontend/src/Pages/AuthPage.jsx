import React from "react";
import LoginInput from "../components/LoginInput";
import RegisterInput from "../components/RegisterInput";
import { useNavigate } from "react-router-dom";
import "../styles/auth2.css";
import { login, register } from "../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function AuthPage({ loginSuccess }) {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = React.useState(false);
    const Alert = withReactContent(Swal);

    async function onLoginHandler({ email, password }) {
        const { error, data } = await login({ email, password });

        // ambil warna sesuai tema
        const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
        const surface = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim();

        if (!error) {
            // loginSuccess(data);
            // navigate("/");
            await Alert.fire({
                title: "Login Success!",
                text: "Welcome back 👋",
                icon: "success",
                backdrop: false,
                color: primary,
                confirmButtonColor: primary,
            });
            loginSuccess(data);
            navigate("/");
        } else {
            Alert.fire({
                title: "Login Failed",
                text: "Authentication failed. Please enter your email address and password correctly 😣",
                icon: "error",
                backdrop: false,
                color: primary,
                confirmButtonColor: primary,
            });
        }
    }

    async function onRegisterHandler(user) {
        const { error } = await register(user);

        // ambil warna sesuai tema
        const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
        const surface = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim();

        if (!error) {
            // setIsRegister(false);
            await Alert.fire({
                title: "Success Create Account!",
                text: "Please login to continue 🚀",
                icon: "success",
                background: false,
                color: primary,
                confirmButtonColor: primary,
            });

            setIsRegister(false);
        } else {
            Alert.fire({
                title: "Faild Register",
                text: "Please register again 😁",
                icon: "error",
                background: false,
                color: primary,
                confirmButtonColor: primary,
            });
        }
    }

    return (
        <div>
            <header>AI Learning Insight</header>
            <div className="auth-wrapper">
                <div className={`auth-container ${isRegister ? "register-mode" : ""}`}>
                    {/* Login */}
                    <div className="form-section login-section">
                        <h2>Welcome Back</h2>
                        <p className="subtitle">Sign in to continue your AI journey</p>
                        <div className="login-input">
                            <LoginInput login={onLoginHandler} />
                        </div>
                    </div>

                    {/* Panel */}
                    <div className="door-panel">
                        <div className="door-content">
                            {!isRegister ? (
                                <>
                                    <h3>New Here?</h3>
                                    <p>Join us and explore AI learning insights!</p>
                                    <button onClick={() => setIsRegister(true)}>Sign Up</button>
                                </>
                            ) : (
                                <>
                                    <h3>Already have an account?</h3>
                                    <p>Sign in and continue your AI journey.</p>
                                    <button onClick={() => setIsRegister(false)}>Sign In</button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Register */}
                    <div className="form-section register-section">
                        <h2>Create Account</h2>
                        <p className="subtitle">Join us and start learning smarter</p>
                        <div className="register-input">
                            <RegisterInput register={onRegisterHandler} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
