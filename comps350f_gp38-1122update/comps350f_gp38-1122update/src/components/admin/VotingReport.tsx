import React, { useMemo } from 'react';
import { BarChart, PieChart, Download, ChevronDown, ChevronUp } from 'lucide-react';
import type { VotingOption } from '../../types';
import { useTranslation } from 'react-i18next';

interface VotingReportProps {
  votingOptions: VotingOption[];
  totalVotes: number;
}

interface TopicStats {
  totalVotes: number;
  leadingCandidate: string;
  averageVotes: number;
  votePercentage: number;
}

export default function VotingReport({ votingOptions, totalVotes }: VotingReportProps) {
  const { t } = useTranslation();
  const [expandedTopics, setExpandedTopics] = React.useState<Set<string>>(new Set());

  const topicStats = useMemo(() => {
    return votingOptions.reduce<Record<string, TopicStats>>((acc, option) => {
      const topicTotalVotes = option.candidates.reduce((sum, c) => sum + c.votes, 0);
      const leadingCandidate = option.candidates.length > 0 
        ? option.candidates.reduce((prev, current) => 
            prev.votes > current.votes ? prev : current
          ).name
        : 'No candidates';
      
      acc[option.id] = {
        totalVotes: topicTotalVotes,
        leadingCandidate,
        averageVotes: option.candidates.length > 0 ? topicTotalVotes / option.candidates.length : 0,
        votePercentage: totalVotes > 0 ? (topicTotalVotes / totalVotes) * 100 : 0
      };
      
      return acc;
    }, {});
  }, [votingOptions, totalVotes]);

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const downloadReport = () => {
    const reportData = votingOptions.flatMap(option => {
      const stats = topicStats[option.id];
      return [
        [`Topic: ${option.name}`],
        ['Candidate', 'Position', 'Votes', 'Percentage'],
        ...option.candidates.map(c => [
          c.name,
          c.position,
          c.votes.toString(),
          `${((c.votes / (stats.totalVotes || 1)) * 100).toFixed(2)}%`
        ]),
        [''],
        [`Total Votes: ${stats.totalVotes}`],
        [`Average Votes: ${stats.averageVotes.toFixed(2)}`],
        [`Leading Candidate: ${stats.leadingCandidate}`],
        ['', '', '', '']
      ];
    });

    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voting-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (votingOptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>{t('voting.noTopicsAvailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{t('voting.VotingReport')}</h3>
        <button
          onClick={downloadReport}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Download className="w-4 h-4" />
          <span>{t('voting.ExportCSV')}</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('voting.TotalVotesCast')}</p>
            <p className="text-2xl font-bold text-indigo-600">{totalVotes}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('voting.totalTopics')}</p>
            <p className="text-2xl font-bold text-indigo-600">{votingOptions.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('voting.activeTopics')}</p>
            <p className="text-2xl font-bold text-indigo-600">
              {votingOptions.filter(opt => opt.candidates.length > 0).length}
            </p>
          </div>
        </div>

        {/* Per Topic Reports */}
        <div className="space-y-4">
          {votingOptions.map((option) => {
            const stats = topicStats[option.id];
            const isExpanded = expandedTopics.has(option.id);

            return (
              <div key={option.id} className="border rounded-lg">
                <button
                  onClick={() => toggleTopic(option.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{option.name}</h4>
                    <p className="text-sm text-gray-500">
                      {stats.totalVotes} votes ({stats.votePercentage.toFixed(1)}% of total)
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                          <BarChart className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-medium text-gray-900">{t('voting.VoteDistribution')}</h4>
                        </div>
                        {option.candidates.length > 0 ? (
                          <div className="space-y-4">
                            {option.candidates.map((candidate) => (
                              <div key={candidate.id}>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>{candidate.name}</span>
                                  <span>
                                    {candidate.votes} ({((candidate.votes / (stats.totalVotes || 1)) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ 
                                      width: `${(candidate.votes / (stats.totalVotes || 1)) * 100}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No candidates available</p>
                        )}
                      </div>

                      {/* Summary Stats */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                          <PieChart className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-medium text-gray-900">{t('voting.SummaryStatistics')}</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-md">
                            <p className="text-sm text-gray-600">{t('voting.TotalVotesCast')}</p>
                            <p className="text-xl font-bold text-indigo-600">{stats.totalVotes}</p>
                          </div>
                          <div className="bg-white p-4 rounded-md">
                            <p className="text-sm text-gray-600">{t('voting.LeadingCandidates')}</p>
                            <p className="text-xl font-semibold text-gray-900">{stats.leadingCandidate}</p>
                          </div>
                          <div className="bg-white p-4 rounded-md">
                            <p className="text-sm text-gray-600">{t('voting.AverageVotesperCandidate')}</p>
                            <p className="text-xl font-semibold text-gray-900">
                              {stats.averageVotes.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}