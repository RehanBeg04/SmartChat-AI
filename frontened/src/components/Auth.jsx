import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../context/Authcontext";
import { toast } from "react-toastify";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ Fullname: "", email: "", password: "" });
  const router = useNavigate();


  const { loginform, signupform } = useContext(Authcontext);

  const handlevalue = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await loginform(formData.email, formData.password);
        setFormData({
          email: "",
          password: ""

        })
        if (res.status == 200) {
          router("/chat");
        }
      } else {
        const res = await signupform(formData.Fullname, formData.email, formData.password);
        setFormData({
          Fullname: "",
          email: "",
          password: "",
        })
        if (res.status == 200) {
          setIsLogin(true)
          router("/auth")
        }
      }

    } catch (err) {
      toast.error(err.response.data.message);
      router("/auth");
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700  p-4">
      <div className="bg-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
        </h2>

        <form className="space-y-4" onSubmit={handlesubmit}>
          {!isLogin && (
            <input
              type="text"
              name="Fullname"
              placeholder="Full Name"
              onChange={handlevalue}
              value={formData.Fullname}
              className="w-full px-4 py-2 border-1 border-black rounded-lg text-gray-700 focus:outline-none"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handlevalue}
            className="w-full px-4 py-2 border-1 border-black rounded-lg text-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handlevalue}
            value={formData.password}
            className="w-full px-4 py-2 border-1 border-black rounded-lg focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-gray-700 hover:underline font-semibold"
            onClick={() => { setIsLogin(!isLogin) }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth
