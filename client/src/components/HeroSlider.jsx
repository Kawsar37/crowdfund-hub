'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    title: 'Fund the Future',
    subtitle: 'Back projects that matter. From cutting-edge technology to community-driven causes, your support makes dreams a reality.',
    gradient: 'from-primary-600 to-primary-900',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&h=900&fit=crop',
  },
  {
    title: 'Empower Creators',
    subtitle: 'Launch your campaign and connect with thousands of supporters who believe in your vision.',
    gradient: 'from-emerald-600 to-emerald-900',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop',
  },
  {
    title: 'Build Together',
    subtitle: 'Join a global community of innovators, dreamers, and changemakers building what\'s next.',
    gradient: 'from-accent-600 to-accent-900',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&h=900&fit=crop',
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      effect="fade"
      loop
      className="h-[600px] md:h-[700px]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`} />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link href="/explore" className="bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                      Explore Campaigns
                    </Link>
                    <Link href="/register" className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors">
                      Start a Campaign
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
