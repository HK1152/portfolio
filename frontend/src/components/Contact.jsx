import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from './SectionHeading';
import { Send, Upload, Mail, Phone, MapPin } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';
import { useContext } from 'react';
import cvFile from '../assets/file/kavya patel CV(27Feb26).pdf';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { cvData } = useContext(PortfolioContext);

  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // 1. Trigger Google Sign-in Popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = user.email;

      // 2. Send data to backend
      const response = await axios.post('http://localhost:5000/api/contact', {
        name: formData.name,
        email: userEmail,
        message: formData.message
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', message: '' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        setSubmitStatus(`Error: ${error.response.data.message || 'Server error'}`);
      } else {
        setSubmitStatus(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-neutral-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading 
          title="Get In Touch" 
          subtitle="Have a project in mind or want to collaborate? Let's talk."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" ref={ref}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <p className="text-neutral-400 mb-8">
                Feel free to reach out to me directly through email or connect with me professionally on LinkedIn.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Email</p>
                    <a href={`mailto:${cvData.personalInfo.email}`} className="text-white font-medium hover:text-emerald-400 transition-colors break-all">
                      {cvData.personalInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Phone</p>
                    <a href={`tel:${cvData.personalInfo.phone}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                      {cvData.personalInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 text-purple-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Location</p>
                    <p className="text-white font-medium">
                      Gandhinagar, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resume Callout */}
            <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-neutral-800 rounded-3xl p-8 flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold mb-2">Want my full CV?</h4>
                <p className="text-neutral-400 text-sm">Download the PDF version here.</p>
              </div>
              <a 
                href="/kavya_cv.pdf" 
                download="Kavya_Patel_CV.pdf"
                className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors border border-white/10"
              >
                <Upload className="rotate-180" size={24} />
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl relative"
          >
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-4 right-4 z-20 p-4 bg-emerald-500/10 border border-emerald-500/50 backdrop-blur-md text-emerald-400 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Send size={16} />
                  </div>
                  <div className="text-sm font-medium">
                    <p className="text-white font-bold">Message Sent!</p>
                    <p className="opacity-80">I'll get back to you as soon as possible.</p>
                  </div>
                </motion.div>
              )}
              
              {submitStatus && submitStatus.startsWith('Error') && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-4 right-4 z-20 p-4 bg-red-500/10 border border-red-500/50 backdrop-blur-md text-red-400 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="text-sm font-medium">
                    <p className="text-white font-bold">Failed to Send</p>
                    <p className="opacity-80">{submitStatus.replace('Error: ', '')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-2xl font-bold text-white mb-6 pt-2">Send Me a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="How can I help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                  isSubmitting 
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {isSubmitting ? (
                  'Processing...'
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google & Send
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
