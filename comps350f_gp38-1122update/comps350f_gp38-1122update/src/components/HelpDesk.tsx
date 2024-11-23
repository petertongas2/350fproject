import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Send } from 'lucide-react';

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  timestamp: string;
}

export default function HelpDesk() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      userId: 'current-user', // In real app, get from auth context
      subject,
      message,
      status: 'open',
      timestamp: new Date().toISOString()
    };
    setTickets([newTicket, ...tickets]);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

        {tickets.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tickets</h3>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{ticket.subject}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'open' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}