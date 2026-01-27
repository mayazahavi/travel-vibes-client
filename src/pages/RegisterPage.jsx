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
import useForm from "../hooks/useForm";
import * as authService from "../services/authService";
import { validateRegistration } from "../utils/validation"; // Shared validation
import styles from "../styles/Auth.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showSuccess, setShowSuccess] = useState(false);

  const { values, errors, handleChange, handleSubmit } = useForm(
    { name: "", email: "", password: "", confirmPassword: "" },
    validateRegistration
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/create-trip"); // Redirect to create trip after registration
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (formValues) => {
    dispatch(registerStart());

    try {
      const data = await authService.register({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password
      });
      setShowSuccess(true);
      setTimeout(() => {
        dispatch(registerSuccess(data));
      }, 1500);
    } catch (err) {
      dispatch(registerFailure(err.message || "Registration failed. Please try again."));
    }
  };

  if (showSuccess) {
    return (
      <div className={styles.authPageWrapper}>
        <div className={styles.overlay}></div>
        <div className={`${styles.authCard} ${styles.authCardCentered}`}>
          <div className={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className={`title is-3 ${styles.successTitle}`}>Welcome!</h2>
          <p className={`subtitle is-5 ${styles.successSubtitle}`}>Creating your account...</p>
        </div>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <div className="control has-icons-left">
              <input
                className={`input ${errors.name ? "is-danger" : ""}`}
                type="text"
                name="name"
                placeholder="John Doe"
                value={values.name}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
            {errors.name && (
              <p className="help is-danger">{errors.name}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className="control has-icons-left">
              <input
                className={`input ${errors.email ? "is-danger" : ""}`}
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={values.email}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
            {errors.email && (
              <p className="help is-danger">{errors.email}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className="control has-icons-left">
              <input
                className={`input ${errors.password ? "is-danger" : ""}`}
                type="password"
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
            {errors.password && (
              <p className="help is-danger">{errors.password}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className="control has-icons-left">
              <input
                className={`input ${errors.confirmPassword ? "is-danger" : ""}`}
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-check-circle"></i>
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="help is-danger">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={`button is-primary ${styles.submitButton} ${loading ? "is-loading" : ""
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
