import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Vote, Lock, User, AlertCircle, CheckCircle, Globe, Clock, Users, Award, Mail, RefreshCw } from 'lucide-react';
import axios from '../api/axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ voterID: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(1); // Step 1: VoterID, Step 2: OTP
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Track mouse position for subtle animation
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Timer effect for resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, canResend]);

  const startResendTimer = () => {
    setResendTimer(30);
    setCanResend(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateVoterID = () => {
    const newErrors = {};
    if (!formData.voterID.trim()) newErrors.voterID = 'Voter ID is required';
    else if (formData.voterID.length < 8) newErrors.voterID = 'Voter ID must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};
    if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
    else if (formData.otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';
    else if (!/^\d+$/.test(formData.otp)) newErrors.otp = 'OTP must contain only numbers';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Backend integration for sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateVoterID()) return;

    setIsLoading(true);
    try {
      // Send OTP request to backend
      const response = await axios.post('/voters/send-otp', { voterID: formData.voterID });

      if (response.data.success) {
        setOtpSent(true);
        setCurrentStep(2);
        startResendTimer();
      } else {
        // If voter ID not found or other error
        setErrors({ voterID: response.data.message || 'Voter ID not found or invalid.' });
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        setErrors({ voterID: 'Voter ID not authorized.' });
      } else {
        setErrors({ voterID: 'Server error. Please try again later.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Backend integration for verifying OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;
    setIsLoading(true);
    try {
      const response = await axios.post('/voters/verify-otp', { voterID: formData.voterID, otp: formData.otp });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);  // JWT
        localStorage.setItem("voterId", formData.voterID);   // store voterID
        alert("Login successful!");
        window.location.href = "/user-dashboard";
      } else {
        setErrors({ otp: response.data.message || 'Invalid OTP' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ otp: 'Server error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      const response = await axios.post('/voters/send-otp', { voterID: formData.voterID });

      if (response.data.success) startResendTimer();
      else setErrors({ otp: response.data.message || 'Failed to resend OTP' });
    } catch (error) {
      console.error(error);
      setErrors({ otp: 'Server error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => `${seconds.toString().padStart(2, '0')}`;

  // Stats for left panel
  const stats = [
    { icon: Users, label: 'Active Voters', value: '1.2M+' },
    { icon: Shield, label: 'Security Level', value: '99.9%' },
    { icon: Globe, label: 'Global Elections', value: '500+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)` }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md space-y-8">
            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Vote className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                SecureVote
              </h1>
              <p className="text-xl text-blue-200">Next-Generation Voting Platform</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-6">Why Choose SecureVote?</h2>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Bank-Grade Security', desc: 'Military-grade encryption & blockchain verification' },
                  { icon: Clock, title: 'Real-Time Results', desc: 'Instant vote counting with live transparency' },
                  { icon: Award, title: 'Certified Platform', desc: 'ISO 27001 certified with government approval' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-sm text-blue-200">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-xl">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">SecureVote</h1>
              <p className="text-blue-200">Online Voting System</p>
            </div>

            {/* Security banner */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 mb-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm text-white">
                  <span className="font-semibold">256-bit SSL Secured:</span> Your vote is encrypted & anonymous
                </div>
              </div>
            </div>

            {/* Login form */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentStep === 1 ? 'Verify Identity' : 'Enter OTP'}
                </h2>
                <p className="text-blue-200">
                  {currentStep === 1 ? 'Enter your voter ID to continue' : 'Enter the 6-digit code sent to your registered device'}
                </p>
              </div>

              <div className="space-y-6">
                {/* Voter ID input */}
                {currentStep === 1 && (
                  <div className="space-y-2">
                    <label htmlFor="voterID" className="block text-sm font-semibold text-white">Voter Identification</label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${focusedField === 'voterID' ? 'text-blue-400' : 'text-gray-400'}`}>
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        id="voterID"
                        name="voterID"
                        type="text"
                        value={formData.voterID}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('voterID')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-300 transition-all duration-300 hover:bg-white/15 focus:bg-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/25 ${errors.voterID ? 'border-red-400 bg-red-500/10' : focusedField === 'voterID' ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/30 hover:border-white/50'}`}
                        placeholder="Enter your voter ID"
                      />
                      {errors.voterID && <div className="absolute inset-y-0 right-0 pr-4 flex items-center"><AlertCircle className="h-5 w-5 text-red-400 animate-pulse" /></div>}
                    </div>
                    {errors.voterID && <p className="text-red-400 text-sm">{errors.voterID}</p>}
                  </div>
                )}

                {/* OTP input */}
                {currentStep === 2 && (
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-semibold text-white">OTP</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type={showOtp ? 'text' : 'password'}
                        value={formData.otp}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('otp')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-300 transition-all duration-300 hover:bg-white/15 focus:bg-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/25 ${errors.otp ? 'border-red-400 bg-red-500/10' : focusedField === 'otp' ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/30 hover:border-white/50'}`}
                        placeholder="Enter OTP"
                      />
                      <button type="button" onClick={() => setShowOtp(!showOtp)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white">
                        {showOtp ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      {errors.otp && <div className="absolute inset-y-0 right-0 pr-10 flex items-center"><AlertCircle className="h-5 w-5 text-red-400 animate-pulse" /></div>}
                    </div>
                    {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-4">
                  {currentStep === 1 && (
                    <button onClick={handleSendOTP} disabled={isLoading} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  )}
                  {currentStep === 2 && (
                    <>
                      <button onClick={handleVerifyOTP} disabled={isLoading} className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                        {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                      </button>
                      <div className="flex justify-between items-center mt-4 text-sm text-blue-200">
                        <span>
                          {canResend ? <button onClick={handleResendOTP} className="underline hover:text-white">Resend OTP</button> : `Resend in ${formatTime(resendTimer)}s`}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 text-center text-blue-200 text-xs">
                &copy; 2025 SecureVote. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
