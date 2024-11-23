import React, { useState } from 'react';
import { Edit2, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import type { Candidate, VotingOption } from '../../types';
import { useVotingRules } from '../../contexts/VotingRulesContext';
import { useTranslation } from 'react-i18next';

interface CandidateManagementProps {
  selectedOption: VotingOption;
}

export default function CandidateManagement({ selectedOption }: CandidateManagementProps) {
  const { t } = useTranslation();
  const { updateVotingOption } = useVotingRules();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Candidate>>({});

  const isAtMaxCandidates = selectedOption.candidates.length >= selectedOption.maxSelections;

  const handleEdit = (candidate: Candidate) => {
    setEditingId(candidate.id);
    setEditForm(candidate);
  };

  const handleSave = () => {
    if (editingId && editForm.name && editForm.position && editForm.description && editForm.imageUrl) {
      const updatedCandidates = selectedOption.candidates.map(candidate =>
        candidate.id === editingId
          ? { ...editForm, id: editingId, votes: candidate.votes } as Candidate
          : candidate
      );

      updateVotingOption({
        ...selectedOption,
        candidates: updatedCandidates
      });

      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAdd = () => {
    if (isAtMaxCandidates) {
      return;
    }

    if (editForm.name && editForm.position && editForm.description && editForm.imageUrl) {
      const newCandidate: Candidate = {
        ...editForm,
        id: crypto.randomUUID(),
        votes: 0
      } as Candidate;

      updateVotingOption({
        ...selectedOption,
        candidates: [...selectedOption.candidates, newCandidate]
      });

      setShowAddForm(false);
      setEditForm({});
    }
  };

  const handleDelete = (candidateId: string) => {
    updateVotingOption({
      ...selectedOption,
      candidates: selectedOption.candidates.filter(c => c.id !== candidateId)
    });
  };

  const renderForm = (isEditing: boolean) => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('candidates.cName')}</label>
        <input
          type="text"
          value={editForm.name || ''}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('candidates.cPosition')}</label>
        <input
          type="text"
          value={editForm.position || ''}
          onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('candidates.cDescription')}</label>
        <textarea
          value={editForm.description || ''}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('candidates.ImageURL')}</label>
        <input
          type="url"
          value={editForm.imageUrl || ''}
          onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => {
            setEditingId(null);
            setShowAddForm(false);
            setEditForm({});
          }}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          {t('candidates.cancel')}
        </button>
        <button
          onClick={isEditing ? handleSave : handleAdd}
          className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          <Save className="w-4 h-4" />
          <span>{isEditing ? t('common.saveChanges') : t('candidates.addcandidate')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {t('candidates.managecandidates')} {selectedOption.name}
        </h3>
        {!showAddForm && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {selectedOption.candidates.length} / {selectedOption.maxSelections} candidates
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              disabled={isAtMaxCandidates}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${
                isAtMaxCandidates
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('candidates.addcandidate')}</span>
            </button>
          </div>
        )}
      </div>
      
      {isAtMaxCandidates && !editingId && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              Maximum number of candidates ({selectedOption.maxSelections}) has been reached.
            </p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {showAddForm && !isAtMaxCandidates && renderForm(false)}
        
        <div className="space-y-4">
          {selectedOption.candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-4">
              {editingId === candidate.id ? (
                renderForm(true)
              ) : (
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-900">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.position}</p>
                    <p className="text-sm text-gray-500">{candidate.description}</p>
                    <p className="text-sm text-gray-500">{t('voting.CurrentVotes')}: {candidate.votes}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(candidate)}
                      className="p-2 text-gray-400 hover:text-indigo-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(candidate.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}