import { useState, useCallback, useRef } from 'react';

// Validation rules
const validationRules = {
  required: (value) => value.trim() !== '' || 'This field is required',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address',
  minLength: (min) => (value) => value.length >= min || `Minimum ${min} characters required`,
  maxLength: (max) => (value) => value.length <= max || `Maximum ${max} characters allowed`,
  passwordMatch: (password) => (confirmPassword) => confirmPassword === password || 'Passwords do not match',
  phone: (value) => /^[\d\s\-\+\(\)]+$/.test(value) || 'Please enter a valid phone number',
  url: (value) => /^https?:\/\/.+/.test(value) || 'Please enter a valid URL'
};

// Custom hook for form validation
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstErrorRef = useRef(null);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const fieldRules = validationSchema[name];
    if (!fieldRules) return '';

    const rules = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
    
    for (const rule of rules) {
      let validator;
      
      if (typeof rule === 'string') {
        validator = validationRules[rule];
      } else if (typeof rule === 'function') {
        validator = rule;
      } else if (typeof rule === 'object' && rule.type) {
        validator = validationRules[rule.type];
        if (rule.params) {
          validator = validator(...rule.params);
        }
      }

      if (validator) {
        const result = validator(value);
        if (result !== true) {
          return result;
        }
      }
    }

    return '';
  }, [validationSchema]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let firstErrorField = null;

    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        if (!firstErrorField) {
          firstErrorField = field;
        }
      }
    });

    setErrors(newErrors);
    
    // Auto-focus first error field
    if (firstErrorField && firstErrorRef.current) {
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.focus();
      }
    }

    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema, validateField]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: fieldValue }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  // Handle blur event
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    const isValid = validateForm();
    
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
    return isValid;
  }, [values, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  // Set error for a specific field
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
    isValid: Object.keys(errors).length === 0
  };
};

// Helper function to create validation schemas
export const createValidationSchema = (schema) => schema;

// Export validation rules for external use
export { validationRules };
