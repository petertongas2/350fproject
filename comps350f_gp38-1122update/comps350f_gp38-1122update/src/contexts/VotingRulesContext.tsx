import React, { createContext, useContext, useState, useEffect } from 'react';
import { VotingService } from '../services/votingService';
import type { VotingOption } from '../types';

interface VotingRulesContextType {
  votingOptions: VotingOption[];
  addVotingOption: (option: Omit<VotingOption, 'id'>) => Promise<void>;
  updateVotingOption: (option: VotingOption) => Promise<void>;
  removeVotingOption: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const VotingRulesContext = createContext<VotingRulesContextType | undefined>(undefined);

export function VotingRulesProvider({ children }: { children: React.ReactNode }) {
  const [votingOptions, setVotingOptions] = useState<VotingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVotingOptions();
  }, []);

  async function loadVotingOptions() {
    try {
      const options = await VotingService.getAllVotingOptions();
      setVotingOptions(options);
    } catch (err) {
      setError('Failed to load voting options');
      console.error('Error loading voting options:', err);
    } finally {
      setLoading(false);
    }
  }

  const addVotingOption = async (option: Omit<VotingOption, 'id'>) => {
    try {
      const newOption = await VotingService.addVotingOption(option);
      setVotingOptions([...votingOptions, newOption]);
    } catch (err) {
      setError('Failed to add voting option');
      console.error('Error adding voting option:', err);
    }
  };

  const updateVotingOption = async (option: VotingOption) => {
    try {
      await VotingService.updateVotingOption(option);
      setVotingOptions(votingOptions.map(opt => 
        opt.id === option.id ? option : opt
      ));
    } catch (err) {
      setError('Failed to update voting option');
      console.error('Error updating voting option:', err);
    }
  };

  const removeVotingOption = async (id: string) => {
    try {
      await VotingService.removeVotingOption(id);
      setVotingOptions(votingOptions.filter(opt => opt.id !== id));
    } catch (err) {
      setError('Failed to remove voting option');
      console.error('Error removing voting option:', err);
    }
  };

  return (
    <VotingRulesContext.Provider value={{
      votingOptions,
      addVotingOption,
      updateVotingOption,
      removeVotingOption,
      loading,
      error
    }}>
      {children}
    </VotingRulesContext.Provider>
  );
}

export function useVotingRules() {
  const context = useContext(VotingRulesContext);
  if (context === undefined) {
    throw new Error('useVotingRules must be used within a VotingRulesProvider');
  }
  return context;
}