import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import type { BallotRecord } from '../../types';

interface BallotVerificationProps {
  ballot: BallotRecord;
}

export default function BallotVerification({ ballot }: BallotVerificationProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {ballot.verified ? (
            <ShieldCheck className="w-5 h-5 text-green-500" />
          ) : (
            <Shield className="w-5 h-5 text-yellow-500" />
          )}
          <span className="text-sm font-medium text-gray-900">
            Ballot ID: {ballot.userId.slice(0, 8)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(ballot.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Status: {ballot.verified ? 'Verified' : 'Pending Verification'}
      </div>
    </div>
  );
}