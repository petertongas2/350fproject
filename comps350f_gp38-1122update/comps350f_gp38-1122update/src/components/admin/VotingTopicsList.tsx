import React, { useState } from 'react';
import type { VotingOption } from '../../types';
import CandidateManagement from './CandidateManagement';
import { VotingService } from '../../services/votingService';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';

interface VotingTopicsListProps {
  votingOptions: VotingOption[];
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  onRemoveOption: (id: string) => void;
}

export default function VotingTopicsList({
  votingOptions,
  selectedOptionId,
  onSelectOption,
  onRemoveOption
}: VotingTopicsListProps) {
  const { t } = useTranslation();
  const [resettingTopics, setResettingTopics] = useState<Set<string>>(new Set());

  const handleRestartVoting = async (optionId: string) => {
    try {
      setResettingTopics(prev => new Set(prev).add(optionId));
      await VotingService.resetVotingTopic(optionId);
    } catch (error) {
      console.error('Error resetting voting topic:', error);
    } finally {
      setResettingTopics(prev => {
        const newSet = new Set(prev);
        newSet.delete(optionId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{t('voting.VotingTopics')}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {votingOptions.map((option) => (
          <div key={option.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{option.title}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
                <p className="text-sm text-gray-500">{t('voting.maxSelections')}: {option.maxSelections}</p>
                <p className="text-sm text-gray-500">
                  {t('voting.totalVotes')}: {option.candidates.reduce((sum, c) => sum + c.votes, 0)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRestartVoting(option.id)}
                  disabled={resettingTopics.has(option.id)}
                  className={`px-4 py-2 text-white rounded-md text-sm flex items-center space-x-2 ${
                    resettingTopics.has(option.id)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${resettingTopics.has(option.id) ? 'animate-spin' : ''}`} />
                  <span>{t('admin.restartVoting')}</span>
                </button>
                <button
                  onClick={() => onSelectOption(option.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  {t('candidates.manage')}
                </button>
                <button
                  onClick={() => onRemoveOption(option.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  {t('voting.RemoveTopic')}
                </button>
              </div>
            </div>
            {selectedOptionId === option.id && (
              <CandidateManagement selectedOption={option} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}