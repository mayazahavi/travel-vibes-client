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
import useForm from "../hooks/useForm";
import * as authService from "../services/authService";
import { validateLogin } from "../utils/validation";
import styles from "../styles/Auth.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [showSuccess, setShowSuccess] = useState(false);

  // ... hooks ...

  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    validateLogin
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/my-trips");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (formValues) => {
    dispatch(loginStart());

    try {
      const data = await authService.login(formValues.email, formValues.password);
      setShowSuccess(true);
      // Show success message for 1.5 seconds before updating Redux (which triggers redirect)
      setTimeout(() => {
        dispatch(loginSuccess(data));
      }, 1500);
    } catch (err) {
      dispatch(loginFailure(err.message || "Invalid email or password"));
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
          <h2 className={`title is-3 ${styles.successTitle}`}>Success!</h2>
          <p className={`subtitle is-5 ${styles.successSubtitle}`}>Logging you in...</p>
        </div>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <button
            type="submit"
            className={`button is-primary ${styles.submitButton} ${loading ? "is-loading" : ""
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

