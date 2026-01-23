import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation support
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.initialValues - Initial form values
 * @param {Function} config.onSubmit - Async submit handler function(values) => Promise
 * @param {Function} [config.validate] - Validation function(values) => errors object or null
 * @param {boolean} [config.clearErrorOnChange=true] - Clear errors when user types
 *
 * @returns {Object} Form state and handlers
 */
export function useForm({
  initialValues,
  onSubmit,
  validate,
  clearErrorOnChange = true,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear errors on change if enabled
    if (clearErrorOnChange) {
      setError(null);
      setErrors(prev => {
        if (prev[name]) {
          const { [name]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, [clearErrorOnChange]);

  // Set a single field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Set a single field error
  const setFieldError = useCallback((name, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage,
    }));
  }, []);

  // Clear a single field error
  const clearFieldError = useCallback((name) => {
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Run validation and return whether form is valid
  const runValidation = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Set first error as the main error for simple error display
      const firstError = Object.values(validationErrors)[0];
      setError(firstError);
      return false;
    }

    setErrors({});
    setError(null);
    return true;
  }, [validate, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    setError(null);
    setErrors({});

    // Run validation if provided
    if (!runValidation()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err; // Re-throw so caller can handle if needed
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, values, runValidation]);

  // Reset form to initial values
  const reset = useCallback((newInitialValues) => {
    setValues(newInitialValues || initialValues);
    setErrors({});
    setError(null);
    setTouched({});
  }, [initialValues]);

  // Reset a single field to its initial value
  const resetField = useCallback((name) => {
    setValues(prev => ({
      ...prev,
      [name]: initialValues[name],
    }));
    clearFieldError(name);
    setTouched(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, [initialValues, clearFieldError]);

  // Check if a field has been touched
  const isTouched = useCallback((name) => {
    return !!touched[name];
  }, [touched]);

  // Get field error (only if touched, for better UX)
  const getFieldError = useCallback((name, showOnlyIfTouched = false) => {
    if (showOnlyIfTouched && !touched[name]) {
      return null;
    }
    return errors[name] || null;
  }, [errors, touched]);

  return {
    // State
    values,
    errors,
    error,
    isSubmitting,
    touched,

    // Handlers
    handleChange,
    handleSubmit,

    // Field operations
    setFieldValue,
    setFieldError,
    clearFieldError,
    getFieldError,
    isTouched,

    // Form operations
    setError,
    setErrors,
    setValues,
    reset,
    resetField,
    runValidation,
  };
}
