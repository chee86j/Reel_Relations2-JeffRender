import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { attemptLogin } from "../store";
import { addUserProfile } from "../store/user.js";
import {
  usernameValidator,
  passwordValidator,
  emailValidator,
} from "../utils/util";
import { GithubIcon } from "lucide-react";

const LoginRegister = (props) => {
  const handleLoginFromCheckout = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let auth = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [githubState] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    // Store state in localStorage to verify when GitHub redirects back
    if (githubState) {
      localStorage.setItem('githubState', githubState);
    }

    // Check for GitHub OAuth code and state in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('githubState');

    if (code && state && state === storedState) {
      // Clear state from localStorage
      localStorage.removeItem('githubState');
      // Handle GitHub OAuth callback
      handleGitHubCallback(code);
    }
  }, [githubState]);

  const handleGitHubCallback = async (code) => {
    try {
      const response = await fetch('/api/auth/github?code=' + code);
      if (response.ok) {
        const html = await response.text();
        // Create a temporary div to execute the script
        const div = document.createElement('div');
        div.innerHTML = html;
        const script = div.querySelector('script');
        if (script) {
          eval(script.textContent);
        }
      } else {
        setError('GitHub authentication failed');
      }
    } catch (err) {
      setError('Failed to authenticate with GitHub');
      console.error('GitHub auth error:', err);
    }
  };

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const login = async (ev) => {
    ev.preventDefault();
    const response = await dispatch(attemptLogin(credentials)).then(
      (result) => {
        if (result.payload.id) {
          navigate("/");
        } else if (response.error) {
          setError(response.payload.message);
        }
      }
    );
  };

  const register = async (ev) => {
    ev.preventDefault();

    if (!username || !password || !email) {
      setError("Username, password, and email are required.");
      return;
    }

    if (!usernameValidator(username)) {
      setError("Must Contain 2-15 Alphanumeric Characters or Underscores");
      return;
    }

    if (!passwordValidator(password)) {
      setError(
        "Must Start w/Letter & Contain 2-14 Alphanumeric Characters or Underscores"
      );
      return;
    }

    if (!emailValidator(email)) {
      setError("Invalid email format.");
      return;
    }

    const newUser = {
      username,
      password,
      email,
      isAdmin: false,
      place: {},
      avatar: "",
    };

    try {
      const result = await dispatch(addUserProfile(newUser));
      
      if (result.error) {
        // Handle registration error
        setError(result.payload.error);
        return;
      }

      const credentials = {
        username,
        password,
      };

      const loginResponse = await dispatch(attemptLogin(credentials));
      
      if (loginResponse.error) {
        setError("Registration successful but login failed. Please try logging in manually.");
        return;
      }

      setUsername("");
      setPassword("");
      setEmail("");
      handleLoginFromCheckout;
      navigate("/");
      
    } catch (error) {
      setError(error.message || "Error occurred during registration.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 py-8">
      <div className="w-full max-w-md backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-300 text-sm">
            {isLogin
              ? "Sign in to continue to Reel Relations"
              : "Join the Reel Relations community"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={login} className="space-y-4">
            <div className="space-y-4">
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  placeholder="Username"
                  value={credentials.username}
                  name="username"
                  onChange={onChange}
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                />
              </div>
            </div>
            <button className="w-full py-3 px-4 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg text-white font-medium transition duration-200">
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={register} className="space-y-4">
            <div className="space-y-4">
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <button className="w-full py-3 px-4 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg text-white font-medium transition duration-200">
              Create Account
            </button>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-slate-300 bg-transparent">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={`https://github.com/login/oauth/authorize?client_id=${window.CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/github/callback')}&scope=user:email&state=${githubState}`}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition duration-200"
            >
              <GithubIcon size={20} className="mr-2" />
              <span>Continue with GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-300 hover:text-teal-400 transition duration-200"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
