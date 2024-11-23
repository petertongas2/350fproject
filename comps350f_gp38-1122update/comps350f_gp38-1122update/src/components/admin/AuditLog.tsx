import React, { useState, useEffect } from 'react';
import { Clock, User, CheckCircle, Search } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { VotingService } from '../../services/votingService';
import type { BallotRecord, VotingOption } from '../../types';

interface AuditLogProps {
  votingOptions: VotingOption[];
}

interface EnhancedBallot extends BallotRecord {
  userName?: string;
  topicName?: string;
  candidateName?: string;
}

export default function AuditLog({ votingOptions }: AuditLogProps) {
  const [enhancedBallots, setEnhancedBallots] = useState<EnhancedBallot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBallots = async () => {
      try {
        setLoading(true);
        const ballots = await VotingService.getAllBallots();
        
        const enhanced = await Promise.all(
          ballots.map(async (ballot) => {
            try {
              const userData = await AuthService.getUserData(ballot.userId);
              const option = votingOptions.find(opt => opt.id === ballot.optionId);
              const candidate = option?.candidates.find(c => c.id === ballot.candidateId);

              return {
                ...ballot,
                userName: userData?.displayName || 'Unknown User',
                topicName: option?.name || 'Unknown Topic',
                candidateName: candidate?.name || 'Unknown Candidate'
              };
            } catch (error) {
              console.error('Error enhancing ballot:', error);
              return {
                ...ballot,
                userName: 'Unknown User',
                topicName: 'Unknown Topic',
                candidateName: 'Unknown Candidate'
              };
            }
          })
        );

        setEnhancedBallots(enhanced.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        ));
      } catch (error) {
        console.error('Error fetching ballots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBallots();
  }, [votingOptions]);

  const filteredBallots = enhancedBallots.filter(ballot => 
    ballot.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ballot.topicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ballot.candidateName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Voting Activity Log</h3>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search by user, topic, or candidate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-auto">
        {filteredBallots.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            No voting records found
          </div>
        ) : (
          filteredBallots.map((ballot) => (
            <div key={ballot.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {ballot.userName}
                    </span>
                    <p className="text-sm text-gray-500">
                      voted for {ballot.candidateName} in {ballot.topicName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {ballot.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <CheckCircle className={`w-4 h-4 ${ballot.verified ? 'text-green-500' : 'text-yellow-500'}`} />
                <span className={`text-sm ${ballot.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {ballot.verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}