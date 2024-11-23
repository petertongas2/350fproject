import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, RefreshCw, Plus } from 'lucide-react';
import type { VotingOption } from '../types';
import AuditLog from './admin/AuditLog';
import VotingReport from './admin/VotingReport';
import VotingTopicsList from './admin/VotingTopicsList';
import { useVotingRules } from '../contexts/VotingRulesContext';
import { VotingService } from '../services/votingService';
import { useTranslation } from 'react-i18next';

interface AdminDashboardProps {
  votingOptions: VotingOption[];
  onRestartVoting: () => void;
}

export default function AdminDashboard({ 
  votingOptions,
  onRestartVoting,
}: AdminDashboardProps) {
  const { t } = useTranslation();
  const { addVotingOption, removeVotingOption } = useVotingRules();
  const [activeTab, setActiveTab] = useState<'audit' | 'report'>('audit');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  const [newOptionForm, setNewOptionForm] = useState({
    name: '',
    description: '',
    maxSelections: '1'
  });

  const handleRestartVoting = async () => {
    try {
      await VotingService.resetAllVotes();
      onRestartVoting();
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  };

  const handleAddOption = () => {
    const maxSelections = parseInt(newOptionForm.maxSelections, 10);
    if (!newOptionForm.name || !newOptionForm.description || isNaN(maxSelections)) {
      return;
    }

    const newOption: VotingOption = {
      id: crypto.randomUUID(),
      name: newOptionForm.name,
      title: newOptionForm.name,
      description: newOptionForm.description,
      maxSelections: Math.max(1, maxSelections),
      candidates: [],
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'single',
      status: 'active',
      createdBy: 'system',
      updatedAt: new Date().toISOString()
    };
    addVotingOption(newOption);
    setShowNewOptionForm(false);
    setNewOptionForm({ name: '', description: '', maxSelections: '1' });
  };

  const totalVotes = votingOptions.reduce((sum, option) => 
    sum + option.candidates.reduce((total, candidate) => total + candidate.votes, 0), 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowNewOptionForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('admin.AddVotingTopic')}</span>
          </button>
          <button
            onClick={handleRestartVoting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('admin.restartVoting')}</span>
          </button>
        </div>
      </div>

      {/* New Option Form */}
      {showNewOptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.AddVotingTopic')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('voting.TopicName')}</label>
                <input
                  type="text"
                  value={newOptionForm.name}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('voting.Description')}</label>
                <textarea
                  value={newOptionForm.description}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('voting.maxSelections')}</label>
                <input
                  type="number"
                  min="1"
                  value={newOptionForm.maxSelections}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, maxSelections: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewOptionForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  {t('candidates.cancel')}
                </button>
                <button
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                  disabled={!newOptionForm.name || !newOptionForm.description || !newOptionForm.maxSelections}
                >
                  {t('voting.addtopic')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Topics List */}
      <VotingTopicsList
        votingOptions={votingOptions}
        selectedOptionId={selectedOptionId}
        onSelectOption={setSelectedOptionId}
        onRemoveOption={removeVotingOption}
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('audit')}
            className={`${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <FileText className="w-5 h-5 mr-2" />
            {t('admin.audit')}
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`${
              activeTab === 'report'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            {t('admin.reports')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'audit' && <AuditLog votingOptions={votingOptions} />}
      {activeTab === 'report' && (
        <VotingReport votingOptions={votingOptions} totalVotes={totalVotes} />
      )}
    </div>
  );
}