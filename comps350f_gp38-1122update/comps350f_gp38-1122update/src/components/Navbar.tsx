import React from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => Promise<void>;
  children?: React.ReactNode;
}

export default function Navbar({ user, onLogout, children }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-indigo-600">
              {t('common.welcome')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {children}
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user.name} {user.isAdmin && `(${t('common.admin')})`}
                </span>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}