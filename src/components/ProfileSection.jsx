import React from 'react';
import { User, IdCard, Calendar as CalendarIcon, Mail, Phone, MapPin } from 'lucide-react';

export default function ProfileSection({ voter }) {
    if (!voter) {
        return (
            <div>
                <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Voter Profile</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-white/10 rounded"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-12 bg-white/10 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Voter Profile</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Official Voter Details</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-white/10 rounded">
                        <User className="w-5 h-5 text-blue-300 mr-3"/>
                        <span className="font-semibold text-blue-200 mr-auto">Full Name</span>
                        <span className="font-bold uppercase">
                            {voter.fullName || voter.name || 'Not provided'}
                        </span>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded">
                        <IdCard className="w-5 h-5 text-blue-300 mr-3"/>
                        <span className="font-semibold text-blue-200 mr-auto">Voter ID</span>
                        <span className="font-mono font-bold">{voter.voterId || 'N/A'}</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded">
                        <CalendarIcon className="w-5 h-5 text-blue-300 mr-3"/>
                        <span className="font-semibold text-blue-200 mr-auto">Date of Birth</span>
                        <span className="font-bold">{formatDate(voter.dateOfBirth)}</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded">
                        <Mail className="w-5 h-5 text-blue-300 mr-3"/>
                        <span className="font-semibold text-blue-200 mr-auto">Email</span>
                        <span className="font-bold">{voter.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded">
                        <Phone className="w-5 h-5 text-blue-300 mr-3"/>
                        <span className="font-semibold text-blue-200 mr-auto">Phone</span>
                        <span className="font-bold">{voter.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded">
                        <MapPin className="w-5 h-5 text-blue-300 mr-3"/>
                        <span className="font-semibold text-blue-200 mr-auto">Constituency</span>
                        <span className="font-bold uppercase text-right">
                            {voter.constituency || 'Not assigned'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}