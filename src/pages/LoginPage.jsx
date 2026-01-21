import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../store/slices/authSlice";
import styles from "../styles/Auth.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/my-trips");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());

    // Simulate API call for now (will be replaced with real API later)
    try {
      // Mock login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser = {
        id: "1",
        name: "Test User",
        email: formData.email,
      };
      const mockToken = "mock-jwt-token";

      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    } catch (err) {
      dispatch(loginFailure("Invalid email or password"));
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.overlay}></div>
      <div className={styles.authCard}>
        <h1 className={`title is-3 ${styles.title}`}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue your journey</p>

        {error && (
          <div className="notification is-danger is-light mb-4">
            <button
              className="delete"
              onClick={() => dispatch(clearError())}
            ></button>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className="control has-icons-left">
              <input
                className={`input ${formErrors.email ? "is-danger" : ""}`}
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
            {formErrors.email && (
              <p className="help is-danger">{formErrors.email}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className="control has-icons-left">
              <input
                className={`input ${formErrors.password ? "is-danger" : ""}`}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
            {formErrors.password && (
              <p className="help is-danger">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`button is-primary ${styles.submitButton} ${
              loading ? "is-loading" : ""
            }`}
            disabled={loading}
          >
            Sign In
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Start your journey
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

