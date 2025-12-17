import { Link } from "react-router-dom";
import { Shield, User, Lock, Info, Vote, ArrowRight } from "lucide-react";

export default function DemoInstructions() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white px-6 py-16">

            <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">

                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="relative text-center mb-12">
                    <div className="mx-auto w-18 h-18 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl">
                        <Vote className="w-9 h-9 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        SecureVote <span className="text-blue-300">Live Demo</span>
                    </h1>

                    <p className="text-blue-200 mt-4 max-w-2xl mx-auto">
                        This is a live demonstration of an online voting system showcasing
                        secure authentication, role-based access, and voting workflow logic.
                    </p>
                </div>

                {/* Sections */}
                <div className="relative space-y-10">

                    {/* How it works */}
                    <Section
                        icon={Shield}
                        title="How the System Works"
                    >
                        <ul className="list-disc list-inside space-y-2 text-blue-100">
                            <li>Voters authenticate using a pre-registered Voter ID stored in user database.</li>
                            <li>OTP is generated securely on the backend.</li>
                            <li>After verification, voters can cast their vote.</li>
                            <li>Admins manage elections, candidates, and voters.</li>
                        </ul>
                        <p className="mt-4 text-xs text-blue-300">
                            ⚠️ OTP is displayed on-screen only for demonstration purposes.
                        </p>
                    </Section>

                    {/* Voter Login */}
                    <Section
                        icon={User}
                        title="Voter Login (Demo)"
                    >
                        <p className="text-blue-100">
                            Voter records are <span className="text-white font-semibold">pre-stored</span> in the database.
                            No registration is required.
                            <br />
                            Use any one of the <span className="text-white font-semibold">sample Voter ID</span> below to log in as a voter.
                        </p>

                        <div className="mt-5">
                            <p className="text-sm text-blue-300 mb-3">Sample Voter IDs:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {["VOTER001", "VOTER002", "VOTER003", "VOTER004","VOTER005","VOTER006","VOTER007","VOTER008","VOTER009","VOTER0010"].map(id => (
                                    <div
                                        key={id}
                                        className="bg-black/40 border border-white/20 rounded-lg py-2 text-center font-mono tracking-widest text-white hover:bg-black/60 transition"
                                    >
                                        {id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* Admin Login */}
                    <Section
                        icon={Lock}
                        title="Admin Login (Demo)"
                    >
                        <p className="text-blue-100 mb-4">
                            The admin panel is completely separate from the voter interface and cannot be accessed by voters.
                            <br />
                            Demo credentials are provided only to demonstrate administrative functionality.
                        </p>

                        <div className="bg-black/40 border border-white/20 rounded-xl p-4 font-mono text-sm space-y-1">
                            <p><span className="text-blue-300">URL:</span> /admin</p>
                            <p><span className="text-blue-300">Admin ID:</span> admin001</p>
                            <p><span className="text-blue-300">Password:</span> admin123</p>
                        </div>
                    </Section>

                    {/* Disclaimer */}
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6">
                        <h3 className="flex items-center gap-2 text-yellow-300 font-semibold mb-3">
                            <Info size={18} /> Demo Disclaimer
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-yellow-100 text-sm">
                            <li>Project is for demonstration & evaluation only</li>
                            <li>OTP is displayed on-screen only for demonstration purposes and not via sms.</li>
                            <li>Credentials are pre-configured</li>
                            <li>Production systems would add more security layers</li>
                        </ul>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="relative flex flex-col sm:flex-row justify-center gap-5 mt-14">
                    <Link
                        to="/login"
                        onClick={() => localStorage.setItem("seenInstructions", "true")}
                        className="group px-9 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center gap-2"
                    >
                        Proceed to Voter Login
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/admin"
                        onClick={() => localStorage.setItem("seenInstructions", "true")}
                        className="px-9 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
                    >
                        Go to Admin Panel
                    </Link>
                </div>

                {/* Footer */}
                <div className="relative text-center text-xs text-blue-300 mt-12">
                    © 2025 SecureVote · Live Demonstration Environment
                </div>

            </div>
        </div>
    );
}

/* ---------- Reusable Section Component ---------- */
function Section({ icon: Icon, title, children }) {
    return (
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Icon size={16} />
                </div>
                {title}
            </h2>
            {children}
        </section>
    );
}
