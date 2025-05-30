import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import "../assets/css/RequestForgotPassword.css";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ForgotPassword = () => {

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');

    const [isValid, setIsValid] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (id && token) {
            setIsValid(true);
            console.log('ID:', id);
            console.log('Token:', token);
        } else {
            setIsValid(false);
        }
    }, [id, token]);

    if (isValid === false) {
        return <div>Invalid or expired reset link.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/customer/forgot-password?id=${id}&token=${token}`, {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({"password" : password}),
            });

            const res_data = await response.json();
            if(response.ok){
                setPassword("");
                toast.success(res_data.msg , {theme : "dark"});
                navigate("/login");
            }
            else{
                toast.error(res_data.msg, {theme : "dark"});   
            }
        } catch (e) {
            console.log("Forgot-password error : ", e);       
        }
    }


    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Reset your password</h2>
                <p>Please enter the new Password</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Reset Password</button>
                </form>
                <a href="/login" className="back-to-login">Back To Login</a>
            </div>
        </div>
    )
}