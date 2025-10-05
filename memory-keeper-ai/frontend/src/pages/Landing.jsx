import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiMic, FiCpu, FiHeart, FiCheckCircle, FiArrowRight, FiUsers, FiBook, FiStar, FiShield, FiZap, FiTrendingUp } from 'react-icons/fi';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FiMic className="w-8 h-8" />,
      title: 'Record Your Story',
      description: 'Voice or text recording with live transcription. No downloads needed.',
      detail: 'Enterprise-grade audio capture with AI-powered transcription'
    },
    {
      icon: <FiCpu className="w-8 h-8" />,
      title: 'AI Enhancement',
      description: 'Transform raw memories into beautiful stories with AI magic.',
      detail: 'Advanced natural language processing for authentic storytelling'
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: 'Share Forever',
      description: 'Stories preserved forever. Family can access from anywhere.',
      detail: 'Secure cloud infrastructure with 99.9% uptime guarantee'
    }
  ];
  
  const benefits = [
    { text: '100% Free Forever', icon: <FiShield /> },
    { text: 'AI-Powered Enhancement', icon: <FiCpu /> },
    { text: 'Voice & Transcription', icon: <FiMic /> },
    { text: 'Sentiment Analysis', icon: <FiTrendingUp /> },
    { text: 'Image Generation', icon: <FiZap /> },
    { text: 'Family Sharing', icon: <FiUsers /> },
    { text: 'Analytics Dashboard', icon: <FiTrendingUp /> },
    { text: 'Search & Filter', icon: <FiBook /> }
  ];

  const stats = [
    { number: '10,000+', label: 'Stories Preserved', icon: <FiBook /> },
    { number: '5,000+', label: 'Active Users', icon: <FiUsers /> },
    { number: '50,000+', label: 'Memories Captured', icon: <FiHeart /> },
    { number: '99.9%', label: 'Uptime SLA', icon: <FiShield /> }
  ];

  const testimonials = [
    {
      text: "An invaluable tool for preserving our family's oral history. The AI transcription accuracy is remarkable, and the interface is exceptionally intuitive.",
      author: "Dr. Sarah Mitchell",
      role: "Clinical Psychologist",
      rating: 5
    },
    {
      text: "As a genealogist, I've used many archival tools. This platform's combination of technology and user experience is unmatched in the industry.",
      author: "Robert Chen",
      role: "Professional Genealogist",
      rating: 5
    },
    {
      text: "The sentiment analysis and AI enhancement features helped us document my father's memoirs with incredible clarity and emotional depth.",
      author: "Maria Kowalski",
      role: "Research Analyst",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <FiBook className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900 tracking-tight">
                Memory Keeper
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="px-5 py-2 text-slate-700 hover:text-slate-900 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-slate-100/40 to-transparent blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                <FiShield className="w-4 h-4 mr-2" />
                Enterprise-Grade Memory Preservation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight"
            >
              Preserve Family Legacy
              <br />
              <span className="text-slate-600">With Intelligence</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Professional-grade platform combining AI technology with intuitive design 
              to capture, enhance, and preserve generational stories with unmatched accuracy.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Preserving Stories
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center gap-8 text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                <span>Enterprise features</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-slate-400 mb-3">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                Platform Capabilities
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight"
            >
              Professional Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Sophisticated tools designed for capturing and preserving family narratives
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="h-full bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{feature.description}</p>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-white text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                  Complete Solution
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight text-slate-900 tracking-tight">
                Enterprise Features.
                <br />
                <span className="text-slate-600">Zero Cost.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Professional-grade AI capabilities with sophisticated analytics, 
                providing enterprise-level functionality without enterprise pricing.
              </p>
              
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                      {benefit.icon}
                    </div>
                    <span className="font-medium text-slate-700">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: currentTestimonial === index ? 1 : 0,
                      scale: currentTestimonial === index ? 1 : 0.95,
                      zIndex: currentTestimonial === index ? 10 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white border border-slate-200 rounded-2xl p-10 shadow-xl"
                  >
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 fill-slate-900 text-slate-900" />
                      ))}
                    </div>
                    
                    <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.author}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="h-80" />
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === index
                        ? 'bg-slate-900 w-8'
                        : 'bg-slate-300 w-2 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Ready to Preserve Your
              <br />
              Family's Legacy?
            </h2>
            <p className="text-xl text-slate-300 mb-4 leading-relaxed">
              Join thousands of professionals documenting their family histories
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-10 flex-wrap text-slate-400">
              <div className="flex items-center gap-2">
                <FiUsers className="w-5 h-5" />
                <span className="font-medium">5,000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBook className="w-5 h-5" />
                <span className="font-medium">10,000+ stories</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="w-5 h-5" />
                <span className="font-medium">99.9% uptime</span>
              </div>
            </div>
            
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl group"
            >
              Get Started Free
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="mt-6 text-slate-400 text-sm">
              No credit card required • Forever free • Enterprise features included
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <FiBook className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Memory Keeper
                </span>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed max-w-md">
                Professional platform for preserving family stories with enterprise-grade 
                AI technology and intuitive design.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-slate-900">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Security', 'Support'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-slate-900">Company</h3>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2025 Memory Keeper. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="text-slate-600 hover:text-slate-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-slate-600 hover:text-slate-900 transition-colors">
                Terms of Service
              </a>
              <a href="#security" className="text-slate-600 hover:text-slate-900 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Landing;