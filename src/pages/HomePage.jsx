import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Vote, Lock, CheckCircle, Users, BarChart3, ArrowRight, Smartphone, Award, Globe } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShieldCheck,
      title: 'Military-Grade Security',
      description: 'Your vote is protected with end-to-end encryption and blockchain verification'
    },
    {
      icon: Lock,
      title: 'Complete Privacy',
      description: 'Anonymous voting ensures your choices remain confidential and secure'
    },
    {
      icon: CheckCircle,
      title: 'Instant Verification',
      description: 'Real-time vote confirmation with tamper-proof digital receipts'
    },
    {
      icon: Smartphone,
      title: 'Vote Anywhere',
      description: 'Cast your vote securely from any device, anywhere in the world'
    },
    {
      icon: BarChart3,
      title: 'Transparent Results',
      description: 'Live result tracking with auditable and verifiable vote counts'
    },
    {
      icon: Users,
      title: 'Trusted Platform',
      description: 'Used by thousands of voters in secure democratic elections'
    }
  ];

  const stats = [
    { value: '500K+', label: 'Active Voters' },
    { value: '1,200+', label: 'Elections Held' },
    { value: '99.9%', label: 'Uptime' },
    { value: '100%', label: 'Secure' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-blue-800/30 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureVote
              </h1>
              <p className="text-xs text-blue-300">Trusted Digital Democracy</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-semibold">
                🎉 Trusted by 500,000+ voters worldwide
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Democratic Voting
                </span>
              </h1>
              
              <p className="text-xl text-blue-200 leading-relaxed">
                Experience secure, transparent, and accessible voting from anywhere. 
                Your voice matters, and we ensure it's heard safely.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/instructions')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 flex items-center gap-3"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-blue-700/50 rounded-lg font-bold text-lg transition-all duration-300"
                >
                  Learn More
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-blue-300">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-blue-300">Certified Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-blue-300">Global Access</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Voting Animation */}
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-700/30 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <Vote className="w-6 h-6 text-blue-400" />
                      <span className="font-semibold">Active Election</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Vote Securely Cast
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-green-700/30">
                      <div className="text-2xl font-bold text-green-400">98.2%</div>
                      <div className="text-xs text-blue-300">Turnout Rate</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-700/30">
                      <div className="text-2xl font-bold text-purple-400">Real-time</div>
                      <div className="text-xs text-blue-300">Verification</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-slate-900/50 border-y border-blue-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureVote?
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure your democratic rights are protected
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-slate-900/50 border border-blue-800/30 rounded-xl p-6 hover:bg-slate-800/50 hover:border-blue-600/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12 text-center backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Join thousands of voters who trust SecureVote for secure, transparent, and accessible elections.
            </p>
            <button
              onClick={() => navigate('/instructions')}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 inline-flex items-center gap-3"
            >
              Start Voting Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900/80 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">SecureVote</h3>
              </div>
              <p className="text-blue-300 mb-4">
                Empowering democracy through secure, transparent, and accessible digital voting solutions.
              </p>
              <div className="flex gap-4">
                <Lock className="w-5 h-5 text-blue-400" />
                <Award className="w-5 h-5 text-yellow-400" />
                <Globe className="w-5 h-5 text-green-400" />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-300">
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Voter Login</button></li>
                <li><button onClick={() => navigate('/admin')} className="hover:text-white transition-colors">Admin Portal</button></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-300">
                <li><button onClick={() => navigate('/instructions')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/instructions')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/instructions')} className="hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800/30 pt-8 text-center text-blue-400 text-sm">
            <p>&copy; 2025 SecureVote. All rights reserved. Built with security and transparency in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}