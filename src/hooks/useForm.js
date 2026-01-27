import { useState, useCallback } from "react";

/**
 * A custom hook for managing form state and validation.
 * 
 * @param {Object} initialValues - Initial state of the form
 * @param {Function} validate - A function that returns an errors object
 * @returns {Object} - { values, errors, handleChange, handleSubmit, setValues, setErrors }
 */
const useForm = (initialValues = {}, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));

        setErrors((prev) => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const handleSubmit = useCallback((onSubmit) => {
        return (e) => {
            if (e) e.preventDefault();

            const validationErrors = validate ? validate(values) : {};
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                onSubmit(values);
            }
        };
    }, [values, validate]);

    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({ ...prev, [name]: error }));
    }, []);

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        setValues,
        setErrors,
        setFieldError
    };
};

export default useForm;
