'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Creator',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    quote: 'CrowdPulse helped me raise 500 credits for my art project in just two weeks. The platform is intuitive and the community is incredibly supportive.',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    role: 'Supporter',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    quote: 'I love being able to support innovative projects. The transparency and campaign updates make me feel like I\'m part of something meaningful.',
    rating: 5,
  },
  {
    name: 'Emily Chen',
    role: 'Creator',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    quote: 'As a tech startup founder, CrowdPulse gave me the platform to validate my idea and secure funding from early adopters who believe in my vision.',
    rating: 5,
  },
  {
    name: 'Michael Thompson',
    role: 'Supporter',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    quote: 'The best crowdfunding experience I\'ve had. Clean interface, easy contributions, and great campaign discovery features.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Creator',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    quote: 'From campaign creation to fund withdrawal, everything was seamless. CrowdPulse truly empowers creators to bring their ideas to life.',
    rating: 5,
  },
];

export default function TestimonialSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-12"
    >
      {testimonials.map((testimonial, index) => (
        <SwiperSlide key={index}>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
