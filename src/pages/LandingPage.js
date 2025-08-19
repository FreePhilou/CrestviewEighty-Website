import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, User, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/portal');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginForm(true);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const demoCredentials = [
    { role: 'Admin (Simple)', email: 'admin', password: 'admin' },
    { role: 'Admin (Full)', email: 'admin@crestvieweighty.com', password: 'admin123' },
    { role: 'Board Member', email: 'board@crestvieweighty.com', password: 'board123' },
    { role: 'Member', email: 'member@crestvieweighty.com', password: 'member123' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/landing-background.png")',
        }}
      ></div>
      
      {/* Header Banner */}
      <div className="relative z-10 backdrop-blur-xl bg-gradient-to-r from-white/85 via-gray-50/80 to-white/85 border-b border-gray-200/30 shadow-xl">
        <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/title-logo.png" 
              alt="Crestview Eighty Logo" 
              className="h-12 mr-4 object-contain bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            />
            <h1 className="text-2xl font-bold text-slate-800 drop-shadow-sm">CRESTVIEW EIGHTY</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2">
            <Link 
              to="/map" 
              className="bg-white text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}
            >
              MAP
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}
            >
              CONTACT
            </Link>
            <Link 
              to="/portal" 
              className="bg-white text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}
            >
              LOGIN
            </Link>
          </nav>
        </header>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen -mt-16">
        {/* Central Login Button / Form */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!showLoginForm ? (
              <motion.button
                key="login-button"
                onClick={handleLoginClick}
                initial={{ scale: 1, rotateY: 0 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ 
                  scale: 0.8, 
                  rotateY: 90, 
                  opacity: 0,
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateX: 5,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative backdrop-blur-lg bg-gradient-to-r from-blue-600/80 to-teal-600/80 hover:from-blue-700/90 hover:to-teal-700/90 text-white font-bold py-6 px-16 rounded-2xl border border-white/20 shadow-xl text-xl"
                style={{ 
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <span className="relative">Login</span>
              </motion.button>
            ) : (
              <motion.div
                key="login-form"
                initial={{ 
                  scale: 0.6, 
                  rotateY: -90, 
                  opacity: 0,
                  rotateX: 20
                }}
                animate={{ 
                  scale: 1, 
                  rotateY: 0, 
                  opacity: 1,
                  rotateX: 0,
                  transition: { 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    staggerChildren: 0.1
                  }
                }}
                exit={{ 
                  scale: 0.6, 
                  rotateY: 90, 
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                className="backdrop-blur-xl bg-white/95 rounded-2xl border border-white/30 shadow-2xl p-8 w-96"
                style={{ 
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Close Button */}
                <motion.button
                  onClick={closeLoginForm}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Header */}
                <motion.div 
                  className="text-center mb-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Member Portal</h2>
                  <p className="text-gray-600">Sign in to access your account</p>
                </motion.div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <motion.div 
                    className="relative"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all backdrop-blur-sm bg-white/80"
                      required
                    />
                  </motion.div>

                  {/* Password Field */}
                  <motion.div 
                    className="relative"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all backdrop-blur-sm bg-white/80"
                      required
                    />
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>

                  {/* Demo Credentials */}
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-gray-600 mb-3 text-center">Demo Credentials:</p>
                    <div className="space-y-2">
                      {demoCredentials.map((cred, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setEmail(cred.email);
                            setPassword(cred.password);
                          }}
                          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
                        >
                          <div className="font-medium text-gray-800">{cred.role}</div>
                          <div className="text-gray-600 text-xs">{cred.email}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;