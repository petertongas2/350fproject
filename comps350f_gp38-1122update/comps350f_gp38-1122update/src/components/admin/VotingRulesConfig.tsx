import React, { useState } from 'react';
import { Settings, Save, Plus, Trash2 } from 'lucide-react';
import { useVotingRules } from '../../contexts/VotingRulesContext';
import { useTranslation } from 'react-i18next';
import type { VotingOption } from '../../types';

export default function VotingRulesConfig() {
  const { t } = useTranslation();
  const { votingOptions, addVotingOption, updateVotingOption } = useVotingRules();
  const [newOption, setNewOption] = useState<Partial<VotingOption>>({});

  const handleAddOption = () => {
    if (newOption.title && newOption.description && newOption.maxSelections) {
      addVotingOption({
        name: newOption.title,
        title: newOption.title,
        description: newOption.description,
        maxSelections: newOption.maxSelections,
        candidates: [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'single',
        status: 'draft',
        createdBy: 'system',
        updatedAt: new Date().toISOString()
      });
      setNewOption({});
    }
  };

  const handleUpdateOption = (id: string, updates: Partial<VotingOption>) => {
    const option = votingOptions.find(opt => opt.id === id);
    if (option) {
      updateVotingOption({
        ...option,
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">{t('admin.votingRules')}</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Add New Voting Option */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Add New Voting Topic</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Topic Title</label>
              <input
                type="text"
                value={newOption.title || ''}
                onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newOption.description || ''}
                onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Selections</label>
              <input
                type="number"
                min="1"
                value={newOption.maxSelections || ''}
                onChange={(e) => setNewOption({ 
                  ...newOption, 
                  maxSelections: Math.max(1, parseInt(e.target.value) || 1)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              onClick={handleAddOption}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Voting Topic</span>
            </button>
          </div>
        </div>

        {/* Existing Voting Options */}
        <div className="space-y-4">
          {votingOptions.map((option) => (
            <div key={option.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-gray-900">{option.title}</h4>
                <button
                  onClick={() => (option.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={option.description}
                    onChange={(e) => handleUpdateOption(option.id, { description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maximum Selections</label>
                  <input
                    type="number"
                    min="1"
                    value={option.maxSelections}
                    onChange={(e) => handleUpdateOption(option.id, { 
                      maxSelections: Math.max(1, parseInt(e.target.value) || 1)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Candidates: {option.candidates.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}