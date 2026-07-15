'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import CampaignCard from '@/components/CampaignCard';
import TestimonialSlider from '@/components/TestimonialSlider';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lightbulb, Shield, TrendingUp, Users, Target, Zap } from 'lucide-react';

export default function HomePage() {
  const [topCampaigns, setTopCampaigns] = useState([]);

  useEffect(() => {
    api.getTopCampaigns().then(setTopCampaigns).catch(console.error);
  }, []);

  const features = [
    {
      icon: Lightbulb,
      title: 'Innovative Projects',
      description: 'Discover and fund cutting-edge projects across technology, art, community, and more.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your contributions are protected with industry-standard security and admin oversight.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor campaign updates and see the real-time impact of your support.',
    },
  ];

  const steps = [
    { icon: Users, title: 'Sign Up', description: 'Create your account as a Supporter or Creator in seconds.' },
    { icon: Target, title: 'Explore or Launch', description: 'Browse campaigns or start your own with our easy-to-use tools.' },
    { icon: Zap, title: 'Fund or Raise', description: 'Contribute to projects you believe in or watch your campaign grow.' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '$2M+', label: 'Total Raised' },
    { value: '500+', label: 'Funded Projects' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <HeroSlider />

      {/* Top Funded Campaigns */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Top Funded Campaigns</h2>
          <p className="text-gray-500 text-center mb-10">Support the projects making the biggest impact</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </div>

        {topCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No campaigns available yet. Be the first to create one!</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/explore" className="btn-outline">
            View All Campaigns
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
            <p className="text-gray-500 text-center mb-12">Get started in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-10 mb-4 relative z-10">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Why CrowdPulse?</h2>
          <p className="text-gray-500 text-center mb-12">Built for creators and supporters who want to make a difference</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-200 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">What Our Users Say</h2>
          <p className="text-gray-500 text-center mb-10">Join thousands of satisfied creators and supporters</p>
        </motion.div>

        <TestimonialSlider />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Make an Impact?</h2>
            <p className="text-gray-400 mb-8 text-lg">Join CrowdPulse today and be part of the future of crowdfunding.</p>
            <div className="flex justify-center gap-4">
              <Link href="/register" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors">
                Get Started Free
              </Link>
              <Link href="/explore" className="border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white font-semibold px-8 py-3.5 rounded-lg transition-colors">
                Browse Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
