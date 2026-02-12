import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface UseContactFormReturn {
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
  submitForm: (data: ContactFormData) => Promise<void>;
  resetForm: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/.netlify/functions' 
    : 'http://localhost:8888/.netlify/functions');

export const useContactForm = (): UseContactFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(responseData.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  return {
    isSubmitting,
    submitStatus,
    errorMessage,
    submitForm,
    resetForm,
  };
};
