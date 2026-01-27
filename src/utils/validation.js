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

export const validateTrip = (values) => {
    const errors = {};

    // Trip name
    if (!values.name || !values.name.trim()) {
        errors.name = "Trip name is required";
    } else if (values.name.trim().length < 3) {
        errors.name = "Trip name must be at least 3 characters";
    }

    // Destination
    if (!values.destination || !values.destination.trim()) {
        errors.destination = "Destination is required";
    }

    // Start date
    if (!values.startDate) {
        errors.startDate = "Start date is required";
    }

    // End date
    if (!values.endDate) {
        errors.endDate = "End date is required";
    } else if (
        values.startDate &&
        new Date(values.endDate) < new Date(values.startDate)
    ) {
        errors.endDate = "End date must be after start date";
    }

    // Vibe
    if (!values.vibe) {
        errors.vibe = "Travel vibe is required";
    }

    // Travelers
    if (!values.travelers || values.travelers < 1) {
        errors.travelers = "At least 1 traveler is required";
    }

    return errors;
};
