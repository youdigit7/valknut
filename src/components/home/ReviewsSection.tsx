import React from 'react';
import { Star } from 'lucide-react';

interface ReviewData {
  stars: number;
  title: string;
  text: string;
  name: string;
  location: string;
}

const reviews: ReviewData[] = [
  {
    stars: 5,
    title: 'HEAVIEST TEE I OWN',
    text: 'The 240 GSM feels like armour and the print hasn\'t cracked after 20 washes. Packaging alone feels like a luxury drop.',
    name: 'DINUK P.',
    location: 'COLOMBO'
  },
  {
    stars: 5,
    title: 'FIT IS UNREAL',
    text: 'Ordered from the UK, arrived in 6 days with tracking updates by SMS the whole way. Sizing guide was accurate.',
    name: 'SARA K.',
    location: 'LONDON'
  },
  {
    stars: 4,
    title: 'WORTH THE LIMITED RUN',
    text: 'The Ragnarok hoodie is the best fleece I\'ve bought this year. Only wish more colours dropped at once.',
    name: 'MARCUS V.',
    location: 'MELBOURNE'
  }
];

const ReviewCard: React.FC<{ review: ReviewData }> = ({ review }) => {
  return (
    <div className="bg-[#12141e] border border-white/5 rounded p-6 space-y-4">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < review.stars ? 'text-[#d4af37] fill-[#d4af37]' : 'text-slate-600'} 
          />
        ))}
      </div>
      
      {/* Title */}
      <h4 className="text-sm font-black text-white uppercase tracking-[0.1em] font-syne">
        {review.title}
      </h4>
      
      {/* Text */}
      <p className="text-slate-400 text-xs leading-relaxed">
        {review.text}
      </p>

      {/* Photo Placeholder */}
      <div className="aspect-video bg-[#0e1017] border border-white/5 rounded flex flex-col items-center justify-center">
        <span className="text-[#d4af37] text-[10px] tracking-[0.2em] uppercase font-bold mb-1">IMAGE</span>
        <span className="text-slate-400 text-[10px] font-bold">Customer photo review (admin approved)</span>
        <span className="text-slate-500 text-[9px] mt-1">Optional photo/video attached by the reviewer.</span>
      </div>
      
      {/* Attribution */}
      <p className="text-slate-500 text-[11px] font-bold tracking-[0.15em] uppercase">
        {review.name} · {review.location}
      </p>
    </div>
  );
};

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-[#d4af37] text-[11px] font-bold tracking-[0.25em] uppercase block mb-2">
            REAL REVIEWS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-syne tracking-tight">
            WHAT THEY SAY
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};
