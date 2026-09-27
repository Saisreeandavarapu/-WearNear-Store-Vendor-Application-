import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const ReviewsPage: React.FC = () => {
  const { reviews } = useData();
  const { success } = useToast();

  const [starFilter, setStarFilter] = useState<number | 'ALL'>('ALL');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});

  const filtered = reviews.filter(
    (rev) => starFilter === 'ALL' || rev.rating === starFilter
  );

  const handleReply = (id: string) => {
    if (!replyInput[id]) return;
    success('Reply Published', 'Store response posted to customer review.');
    setReplyInput({ ...replyInput, [id]: '' });
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Customer Ratings & Reviews"
          subtitle="Verified consumer testimonials for delivered garments and in-store pickup quality."
          breadcrumbs={[{ label: 'Operations' }, { label: 'Reviews' }]}
        />

        {/* Rating Overview Strip */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center p-3 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA]">
              <span className="text-2xl sm:text-3xl font-black text-[#172033]">4.85</span>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <span className="text-[10px] text-[#687085] block mt-1">428 Verified Ratings</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#172033]">Boutique Quality Score</h4>
              <p className="text-xs text-[#687085] mt-0.5">94% of shoppers rate 5-stars</p>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              onClick={() => setStarFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold min-h-[34px] ${
                starFilter === 'ALL' ? 'bg-[#172B82] text-white' : 'bg-[#FFFCF5] border border-[#DDD7CA]'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setStarFilter(rating)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 min-h-[34px] ${
                  starFilter === rating ? 'bg-[#172B82] text-white' : 'bg-[#FFFCF5] border border-[#DDD7CA]'
                }`}
              >
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {filtered.map((rev) => (
            <motion.div
              key={rev.id}
              variants={staggerItem}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs sm:text-sm text-[#172033]">
                      {rev.customerName}
                    </h5>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-[#DDD7CA]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#687085] mt-0.5">
                    Product: <strong>{rev.productName}</strong> • Verified Buyer
                  </p>
                </div>
                <span className="text-[10px] text-[#687085]">{rev.date}</span>
              </div>

              <p className="text-xs text-[#172033] leading-relaxed italic bg-[#FFFCF5] p-3 rounded-xl border border-[#DDD7CA]/50">
                "{rev.comment}"
              </p>

              {rev.storeReply && (
                <div className="ml-4 p-3 rounded-xl bg-[#172B82]/5 border border-[#172B82]/15 text-xs">
                  <div className="flex items-center gap-1.5 text-[#172B82] font-bold mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Store Response:</span>
                  </div>
                  <p className="text-[#172033]">{rev.storeReply}</p>
                </div>
              )}

              {/* Reply Box */}
              {!rev.storeReply && (
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a public thank you or sizing note to customer..."
                    value={replyInput[rev.id] || ''}
                    onChange={(e) =>
                      setReplyInput({ ...replyInput, [rev.id]: e.target.value })
                    }
                    className="wn-input text-xs"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReply(rev.id)}
                    className="wn-btn-primary text-xs shrink-0 px-4 min-h-[44px]"
                  >
                    Reply
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};
