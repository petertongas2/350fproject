import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';
import type { VotingOption } from '../types';

interface VotingSectionProps {
  votingOptions: VotingOption[];
  onVote: (optionId: string, candidateId: string) => void;
  votedOptions?: Set<string>;
}

export default function VotingSection({ 
  votingOptions, 
  onVote, 
  votedOptions = new Set() 
}: VotingSectionProps) {
  const [selectedOption, setSelectedOption] = useState<VotingOption | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

  const handleCandidateSelect = (candidateId: string) => {
    if (!selectedOption || votedOptions.has(selectedOption.id)) return;

    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      if (newSelected.size < selectedOption.maxSelections) {
        newSelected.add(candidateId);
      }
    }
    setSelectedCandidates(newSelected);
  };

  const handleVoteSubmit = () => {
    if (!selectedOption || votedOptions.has(selectedOption.id)) return;
    selectedCandidates.forEach(candidateId => {
      onVote(selectedOption.id, candidateId);
    });
    setSelectedCandidates(new Set());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Available Voting Topics</h2>
        <p className="mt-2 text-gray-600">Select a topic to cast your vote</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {votingOptions.map((option) => (
          <div key={option.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
              <p className="text-gray-600 mt-2">{option.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Maximum selections: {option.maxSelections}
              </p>

              {votedOptions.has(option.id) ? (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700">You have already voted in this topic</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedOption(selectedOption?.id === option.id ? null : option)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {selectedOption?.id === option.id ? 'Hide Candidates' : 'View Candidates'}
                  </button>

                  {selectedOption?.id === option.id && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {option.candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedCandidates.has(candidate.id)
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                            onClick={() => handleCandidateSelect(candidate.id)}
                          >
                            <img
                              src={candidate.imageUrl}
                              alt={candidate.name}
                              className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                            <p className="text-sm text-gray-500 mt-2">{candidate.description}</p>
                          </div>
                        ))}
                      </div>

                      {selectedCandidates.size > 0 && (
                        <div className="flex justify-end">
                          <button
                            onClick={handleVoteSubmit}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Submit Votes ({selectedCandidates.size}/{option.maxSelections})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}