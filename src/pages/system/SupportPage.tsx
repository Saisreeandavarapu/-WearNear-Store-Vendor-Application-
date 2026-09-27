import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { SupportTicket } from '../../types';

export const SupportPage: React.FC = () => {
  const { supportTickets, addSupportTicket, replyToSupportTicket } = useData();
  const { success } = useToast();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(supportTickets[0]);
  const [replyText, setReplyText] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // New ticket state
  const [category, setCategory] = useState<SupportTicket['category']>('Order');
  const [subject, setSubject] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    replyToSupportTicket(selectedTicket.id, replyText);
    setReplyText('');
    success('Message Sent', 'Your query was forwarded to WearNear Merchant Helpdesk.');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !initialMessage) return;

    addSupportTicket({
      category,
      subject,
      priority: 'MEDIUM',
      status: 'OPEN',
      initialMessage
    });

    setIsNewTicketOpen(false);
    setSubject('');
    setInitialMessage('');
    success('Ticket Opened', 'Our merchant desk will respond within 30 minutes.');
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Merchant Help Desk & Live Support"
          subtitle="Dedicated 24/7 technical and operations escalation desk for store partners."
          breadcrumbs={[{ label: 'System' }, { label: 'Support Desk' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNewTicketOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" /> Open New Ticket
            </motion.button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Tickets Sidebar / List */}
          <div className="lg:col-span-5 space-y-2.5">
            <h3 className="text-xs font-bold text-[#687085] uppercase tracking-wider mb-2">
              Active Support Cases ({supportTickets.length})
            </h3>
            <div className="space-y-2">
              {supportTickets.map((tk) => (
                <div
                  key={tk.id}
                  onClick={() => setSelectedTicket(tk)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTicket?.id === tk.id
                      ? 'bg-white border-[#172B82] shadow-sm'
                      : 'bg-white/80 border-[#DDD7CA] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#172B82]">
                      {tk.ticketNumber}
                    </span>
                    <StatusBadge status={tk.status} size="sm" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#172033] truncate">
                    {tk.subject}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#687085] mt-1">
                    <span>{tk.category}</span>
                    <span>{tk.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Ticket Conversation Thread */}
          {selectedTicket && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-6 shadow-xs flex flex-col justify-between min-h-[440px]">
              <div>
                <div className="pb-3 border-b border-[#DDD7CA] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#172B82]">
                      {selectedTicket.ticketNumber}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <StatusBadge status={selectedTicket.status} size="sm" />
                </div>

                <div className="space-y-3 py-4 max-h-80 overflow-y-auto">
                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs ${
                        msg.sender === 'VENDOR'
                          ? 'bg-[#172B82]/5 border border-[#172B82]/20 ml-6 text-[#172033]'
                          : 'bg-[#FFFCF5] border border-[#DDD7CA] mr-6 text-[#172033]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px] text-[#687085]">
                        <span className="font-bold text-[#172033]">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Reply Input */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-[#DDD7CA] flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message or escalation..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="wn-input text-xs"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="wn-btn-primary text-xs shrink-0 px-4 min-h-[44px]"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          )}
        </div>

        {/* New Ticket BottomSheet */}
        <BottomSheet
          isOpen={isNewTicketOpen}
          onClose={() => setIsNewTicketOpen(false)}
          title="Open Support Ticket"
          subtitle="Direct escalation to WearNear Merchant Helpdesk"
        >
          <form onSubmit={handleCreateTicket} className="space-y-3.5 py-1">
            <div>
              <label className="wn-label">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="wn-input text-xs"
              >
                <option value="Order">Order & Delivery</option>
                <option value="Payment">Payment & Settlement</option>
                <option value="Catalog">Product Catalog & Images</option>
                <option value="Technical">App / Bug Assistance</option>
              </select>
            </div>

            <div>
              <label className="wn-label">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                className="wn-input text-xs"
              />
            </div>

            <div>
              <label className="wn-label">Detailed Explanation *</label>
              <textarea
                rows={3}
                required
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="Provide order number, date, or screenshots..."
                className="wn-input text-xs resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                className="wn-btn-secondary text-xs flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="wn-btn-primary text-xs flex-1">
                Submit Ticket
              </button>
            </div>
          </form>
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
