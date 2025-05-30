import { useState } from "react";
import { toast } from "react-toastify";
import "../assets/css/RequestForgotPassword.css";

export const RequestForgotPassword = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:5000/customer/request-forgot-password`,{    
          method : "POST",
          headers: {
          "Content-Type": "application/json",
        }, 
        body : JSON.stringify({"email" : email}),
      });

      const res_data = await response.json();

      if(response.ok){
        toast.success(res_data.msg, { theme: "dark" });
        setEmail("");
      }
      else{
        toast.error(res_data.msg, { theme: "dark" });
      }
      } catch (e) {
          console.log("Request for forgot Error : ",e);   
      }
    }

    return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot your password</h2>
        <p>Please enter the email address you'd like your password reset information sent to</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Request reset link</button>
        </form>
        <a href="/login" className="back-to-login">Back To Login</a>
      </div>
    </div>
  );
}