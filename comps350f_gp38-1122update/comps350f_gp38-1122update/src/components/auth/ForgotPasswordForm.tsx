import React, { useState } from 'react';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
}

export default function ForgotPasswordForm({ onSubmit, onBack }: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setSuccessMessage('Password reset email has been sent. Please check your inbox.');
      setEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <KeyRound className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {t('auth.resetPassword')}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.resetPasswordInstructions')}
        </p>
      </div>

      {successMessage ? (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.sending') : t('auth.sendResetInstructions')}
            </button>
          </div>
        </form>
      )}

      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('common.backToLogin')}
        </button>
      </div>
    </div>
  );
}