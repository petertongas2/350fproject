import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import VotingSection from './components/VotingSection';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { VotingService } from './services/votingService';
import { useVotingRules } from './contexts/VotingRulesContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import type { BallotRecord, User } from './types';

export function App() {
  const { user, error, loading, login, register, resetPassword, logout, updateUser } = useAuth();
  const { votingOptions, updateVotingOption } = useVotingRules();
  const [showLogin, setShowLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const handleVote = async (optionId: string, candidateId: string) => {
    if (!user || user.votedOptions.has(optionId)) return;

    const ballot: BallotRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      optionId,
      candidateId,
      timestamp: new Date(),
      verified: false,
    };

    try {
      // Record the vote in the database
      await VotingService.recordVote({
        id: ballot.id,
        userId: ballot.userId,
        optionId,
        candidateId
      });

      // Update local state
      const option = votingOptions.find(opt => opt.id === optionId);
      if (option) {
        const updatedCandidates = option.candidates.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, votes: candidate.votes + 1 }
            : candidate
        );

        updateVotingOption({
          ...option,
          candidates: updatedCandidates
        });
      }

      // Update user's votedOptions
      const updatedVotedOptions = new Set(user.votedOptions);
      updatedVotedOptions.add(optionId);
      const updatedUser: User = {
        ...user,
        votedOptions: updatedVotedOptions
      };
      await updateUser(updatedUser);
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  const handleRestartVoting = async () => {
    try {
      await VotingService.resetAllVotes();
      
      if (user) {
        const updatedUser: User = {
          ...user,
          votedOptions: new Set<string>()
        };
        await updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error restarting voting:', error);
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={logout}>
          <LanguageSelector />
        </Navbar>
        {!user ? (
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="absolute top-20 right-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md">
                {error}
              </div>
            )}
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('common.welcome')}
                </h1>
              </div>
              {showForgotPassword ? (
                <ForgotPasswordForm
                  onSubmit={handleResetPassword}
                  onBack={() => {
                    setShowForgotPassword(false);
                    setShowLogin(true);
                  }}
                />
              ) : showLogin ? (
                <LoginForm
                  onLogin={login}
                  onToggleForm={() => setShowLogin(false)}
                  onForgotPassword={() => {
                    setShowLogin(false);
                    setShowForgotPassword(true);
                  }}
                />
              ) : (
                <RegisterForm
                  onRegister={register}
                  onToggleForm={() => setShowLogin(true)}
                />
              )}
            </div>
          </div>
        ) : (
          <main className="container mx-auto px-4 py-8">
            {user.isAdmin ? (
              <AdminDashboard
                votingOptions={votingOptions}
                onRestartVoting={handleRestartVoting}
              />
            ) : (
              <VotingSection
                votingOptions={votingOptions}
                onVote={handleVote}
                votedOptions={user.votedOptions}
              />
            )}
          </main>
        )}
      </div>
    </LanguageProvider>
  );
}