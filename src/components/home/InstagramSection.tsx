import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

const SOCIAL_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial1',
    platform: 'Instagram',
    link: 'https://instagram.com/valknutofficial1'
  },
  {
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial5',
    platform: 'TikTok',
    link: 'https://tiktok.com/@valknutofficial5'
  },
  {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial1',
    platform: 'Instagram',
    link: 'https://instagram.com/valknutofficial1'
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    platform: 'Instagram',
    handle: '@valknutofficial1',
    link: 'https://instagram.com/valknutofficial1'
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial5',
    platform: 'TikTok',
    link: 'https://tiktok.com/@valknutofficial5'
  },
  {
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial1',
    platform: 'Instagram',
    link: 'https://instagram.com/valknutofficial1'
  }
];

export const InstagramSection: React.FC = () => {
  return (
    <section className="min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 bg-[#0A0A0A] border-b border-white/10 w-full flex flex-col justify-center items-center overflow-hidden">
      <Container size="default">
        
        {/* Centered Section Header */}
        <SectionHeading
          align="center"
          eyebrow="COMMUNITY & LOOKBOOK"
          title="FOLLOW THE MOVEMENT"
          subtitle="Tag @valknutofficial1 or use #VALKNUT to be featured on our official channel."
          linkText="VISIT OFFICIAL INSTAGRAM"
          linkHref="https://instagram.com/valknutofficial1"
        />

        {/* Social Media Visual Grid with generous spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 w-full">
          {SOCIAL_POSTS.map((post, idx) => (
            <a 
              key={idx}
              href={post.link} 
              target="_blank" 
              rel="noreferrer"
              className="group relative aspect-square bg-[#12141E] border border-white/10 rounded-[3px] overflow-hidden block hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-2xl"
            >
              <img
                src={post.image}
                alt={`VALKNUT Social Post ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-110 group-hover:brightness-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-wider uppercase mb-1">
                  {post.platform}
                </span>
                <span className="text-white text-xs font-bold truncate max-w-full font-mono">
                  {post.handle}
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
};
