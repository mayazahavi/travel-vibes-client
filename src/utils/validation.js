/**
 * Validation rules that can be shared between Client and Server (in a real app).
 * Currently used by the Client for frontend validation.
 */

export const validateRegistration = (values) => {
    const errors = {};

    if (!values.name || !values.name.trim()) {
        errors.name = "Full name is required";
    }

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if (values.confirmPassword !== undefined && values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

export const validateLogin = (values) => {
    const errors = {};

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!values.password) {
        errors.password = "Password is required";
    }

    return errors;
};
