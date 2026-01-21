import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../store/slices/authSlice";
import styles from "../styles/Auth.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/create-trip"); // Redirect to create trip after registration
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
    
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(registerStart());

    // Simulate API call for now
    try {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration
      const mockUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
      };
      const mockToken = "mock-jwt-token";

      dispatch(registerSuccess({ user: mockUser, token: mockToken }));
    } catch (err) {
      dispatch(registerFailure("Registration failed. Please try again."));
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.overlay}></div>
      <div className={styles.authCard}>
        <h1 className={`title is-3 ${styles.title}`}>Create Account</h1>
        <p className={styles.subtitle}>Join us and start planning your adventures</p>

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
            <label className={styles.label}>Full Name</label>
            <div className="control has-icons-left">
              <input
                className={`input ${formErrors.name ? "is-danger" : ""}`}
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
            {formErrors.name && (
              <p className="help is-danger">{formErrors.name}</p>
            )}
          </div>

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

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className="control has-icons-left">
              <input
                className={`input ${formErrors.confirmPassword ? "is-danger" : ""}`}
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-check-circle"></i>
              </span>
            </div>
            {formErrors.confirmPassword && (
              <p className="help is-danger">{formErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={`button is-primary ${styles.submitButton} ${
              loading ? "is-loading" : ""
            }`}
            disabled={loading}
          >
            Create Account
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

