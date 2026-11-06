import React, { useState, useEffect } from 'react';
import { 
  Leaf, Recycle, Building2, ShieldCheck, Users, ArrowLeft, Menu, X, CheckCircle2, Globe, Award, Lock, Search, ChevronRight, UploadCloud, Filter, Download, ShoppingCart, FileText, Briefcase, CheckSquare, UserCheck, Truck, Utensils, Battery, Phone, MapPin, TrendingUp, FileCheck, LogOut, User, Key, Edit2, PhoneCall, Info, Home, GraduationCap, HeartPulse, Factory, Coins, CalendarClock, QrCode, Camera, Folder, FileBadge, Printer, AlertTriangle, FileBox, Eye, Share2, MoreVertical, BarChart3, Zap
} from 'lucide-react';

// ==========================================
// 1. SHARED UI COMPONENTS
// ==========================================

const Badge = ({ children, color = "green" }) => {
  const colors = {
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    slate: "bg-slate-100 text-slate-800 border-slate-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

const Button = ({ children, primary = false, onClick, className = "", icon: Icon, type="button", disabled=false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
      disabled 
        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
        : primary
          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
    } ${className}`}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

const Card = ({ title, children, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {title && <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>}
    <div className="text-slate-600 leading-relaxed">
      {children}
    </div>
  </div>
);

// ==========================================
// 2. MARKETING & HOME SECTIONS
// ==========================================

const Navbar = ({ onNavigate, onLoginClick, onAuthAction, isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">EcoNexus</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="text-sm font-medium text-slate-600 hover:text-emerald-600">Home</button>
            <button onClick={() => onNavigate('epr')} className="text-sm font-medium text-slate-600 hover:text-emerald-600">EPR Details</button>
            <button onClick={() => onNavigate('carbon')} className="text-sm font-medium text-slate-600 hover:text-emerald-600">Carbon Details</button>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Button primary onClick={onAuthAction} className="!py-2 !px-4 text-sm">
                  Go to Dashboard
                </Button>
                <button onClick={onLogout} className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium" title="Logout">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Button primary onClick={onAuthAction} className="!py-2 !px-4 text-sm">
                Login / Register
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 rounded hover:bg-slate-100">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-xl z-50 left-0">
          <div className="flex flex-col gap-4">
            <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="text-left font-medium text-slate-600 p-2 border-b border-slate-50">Home</button>
            <button onClick={() => { onNavigate('epr'); setIsOpen(false); }} className="text-left font-medium text-slate-600 p-2 border-b border-slate-50">EPR Details</button>
            <button onClick={() => { onNavigate('carbon'); setIsOpen(false); }} className="text-left font-medium text-slate-600 p-2 border-b border-slate-50">Carbon Details</button>
            
            <Button primary onClick={() => { onAuthAction(); setIsOpen(false); }}>
              {isLoggedIn ? "Go to Dashboard" : "Login / Register"}
            </Button>

            {isLoggedIn && (
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }} 
                className="text-left font-medium text-red-600 p-2 flex items-center gap-2 hover:bg-red-50 rounded"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onRegister, onLogin, onAuthAction, onLearnMore, isLoggedIn }) => (
  <div className="relative overflow-hidden bg-slate-50 pt-16 pb-24 lg:pt-32 lg:pb-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          India's Environmental OS
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Unified Compliance, Waste, & <br/>
          <span className="text-emerald-600">Credit Infrastructure</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          One platform for Institutions to manage waste and for Recyclers to source feedstock. Verify compliance, generate EPR credits, and prepare for Carbon Markets.
        </p>
        <div className="flex flex-col items-center gap-4 justify-center">
          {isLoggedIn ? (
             <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button primary onClick={onAuthAction} className="w-full sm:w-auto px-8 py-3 text-lg">
                  Go to Dashboard
                </Button>
                <Button onClick={onLearnMore} className="w-full sm:w-auto px-8 py-3 text-lg">
                  About Platform
                </Button>
             </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button primary onClick={onRegister} className="w-full sm:w-auto px-8 py-3 text-lg">
                  Get Started
                </Button>
                <Button onClick={onLearnMore} className="w-full sm:w-auto px-8 py-3 text-lg">
                  About Platform
                </Button>
              </div>
              <button onClick={onAuthAction} className="text-sm font-semibold text-slate-500 hover:text-emerald-600 underline mt-2">
                Already registered? Login to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AboutPlatform = () => (
  <div className="py-20 bg-white" id="about-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Unified Ecosystem</h2>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          EcoNexus bridges the gap between waste generators and waste processors, providing digital rails for the entire environmental lifecycle.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-colors group">
           <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
             <GraduationCap className="text-emerald-600 group-hover:text-white" size={24} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-3">Educational Campuses</h3>
           <p className="text-slate-500 text-sm mb-4 font-medium uppercase tracking-wide">Schools • Colleges • Universities</p>
           <ul className="space-y-3 text-slate-600">
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> Automate Green Audits & Reporting.</li>
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> Monetize recyclable campus waste.</li>
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> Student engagement in sustainability.</li>
             <li className="flex gap-2 items-start font-semibold text-emerald-800 bg-emerald-50 p-1 rounded"><CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" /> Boost NAAC & NIRF Sustainability Scores.</li>
           </ul>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors group">
           <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
             <HeartPulse className="text-blue-600 group-hover:text-white" size={24} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-3">Healthcare Facilities</h3>
           <p className="text-slate-500 text-sm mb-4 font-medium uppercase tracking-wide">Hospitals • Clinics • Pharmacies</p>
           <ul className="space-y-3 text-slate-600">
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" /> Track Bio-Medical waste disposal.</li>
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" /> Infection control compliance logs.</li>
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" /> Safe disposal digital certification.</li>
             <li className="flex gap-2 items-start font-semibold text-blue-800 bg-blue-50 p-1 rounded"><CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" /> NABH & JCI Environmental Compliance.</li>
           </ul>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-purple-400 transition-colors group">
           <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
             <Factory className="text-purple-600 group-hover:text-white" size={24} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-3">Processing Partners</h3>
           <p className="text-slate-500 text-sm mb-4 font-medium uppercase tracking-wide">Recyclers • Refurbishers • Dismantlers</p>
           <ul className="space-y-3 text-slate-600">
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5" /> Source verified bulk feedstock.</li>
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5" /> EPR Credit issuance engine.</li>
             <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5" /> Digital chain-of-custody proofs.</li>
             <li className="flex gap-2 items-start font-semibold text-purple-800 bg-purple-50 p-1 rounded"><CheckCircle2 size={18} className="text-purple-600 shrink-0 mt-0.5" /> CPCB/SPCB & ISO Audit Readiness.</li>
           </ul>
        </div>

      </div>

      <div className="mt-16 bg-slate-900 rounded-2xl p-8 text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
         <div>
            <div className="text-4xl font-bold text-emerald-400 mb-1">120+</div>
            <div className="text-sm text-slate-400">Institutions</div>
         </div>
         <div>
            <div className="text-4xl font-bold text-blue-400 mb-1">4.5k</div>
            <div className="text-sm text-slate-400">Tons Processed</div>
         </div>
         <div>
            <div className="text-4xl font-bold text-purple-400 mb-1">1.2M</div>
            <div className="text-sm text-slate-400">EPR Credits</div>
         </div>
         <div>
            <div className="text-4xl font-bold text-orange-400 mb-1">50+</div>
            <div className="text-sm text-slate-400">Partner Facilities</div>
         </div>
      </div>
    </div>
  </div>
);

const CreditOpportunities = ({ onNavigate }) => (
  <div className="py-12 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900">Explore Credit Opportunities</h2>
        <p className="text-slate-500">Monetize your waste and sustainability efforts.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div onClick={() => onNavigate('epr')} className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Award size={32} />
            </div>
            <Badge color="green">LIVE NOW</Badge>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">EPR Credits</h3>
          <p className="text-slate-600 mb-4">
            Earn revenue by generating Extended Producer Responsibility credits for Plastic, E-Waste, and Batteries.
          </p>
          <div className="text-emerald-600 font-semibold flex items-center gap-1">
            Check Market Rates & Eligibility <ChevronRight size={16} />
          </div>
        </div>

        <div onClick={() => onNavigate('carbon')} className="bg-white p-8 rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Globe size={32} />
            </div>
            <Badge color="purple">COMING 2026</Badge>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">Carbon Credits</h3>
          <p className="text-slate-600 mb-4">
            Prepare for India's CCTS market. Start building your data baseline today for future trading.
          </p>
          <div className="text-purple-600 font-semibold flex items-center gap-1">
            View Roadmap & Requirements <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WhyChooseUs = () => (
  <div className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose EcoNexus?</h2>
        <p className="text-lg text-slate-600">We transform environmental compliance from a cost center into a revenue generator and strategic asset.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Audit-Ready Instantly",
            desc: "Generate NAAC, NABH, and Green Audit reports with one click. No more last-minute paperwork scrambling.",
            icon: FileCheck,
            color: "emerald"
          },
          {
            title: "Monetize Your Waste",
            desc: "Directly connect with recyclers to sell high-value waste. Track revenue and generate EPR credits automatically.",
            icon: Coins,
            color: "blue"
          },
          {
            title: "Future-Proof Compliance",
            desc: "Stay ahead of 2026 Carbon Market regulations. Build your baseline data today for future credit trading.",
            icon: Globe,
            color: "purple"
          }
        ].map((feature, i) => (
          <div key={i} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Products = () => (
  <div className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Product Suite</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="X Audit Engine">
          <FileCheck className="w-8 h-8 text-emerald-600 mb-4" />
          <p className="mb-4">Automated NAAC/NABH compliant reporting engine.</p>
        </Card>
        <Card title="Waste Flow Tracker">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
          <p className="mb-4">Real-time GPS tracking from institution to recycler.</p>
        </Card>
        <Card title="Recycler Verification">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
          <p className="mb-4">Compliance scoring and facility validation module.</p>
        </Card>
      </div>
    </div>
  </div>
);

const EPRDetails = ({ onBack }) => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Back to Home
      </button>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600"><Award size={40}/></div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">EPR Credit Marketplace</h2>
            <p className="text-slate-500">Live Trading & Issuance Platform</p>
          </div>
        </div>
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">What is EPR?</h3>
            <p className="text-slate-600 leading-relaxed">
              Extended Producer Responsibility (EPR) is a government mandate where Producers (brands) are responsible for the end-of-life disposal of their products. They fulfill this by purchasing <strong>EPR Credits</strong> from certified Recyclers and Waste Processors.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Coins className="text-emerald-600"/> Current Market Rates (Estimated)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr><th className="px-6 py-4">Waste Category</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Est. Value (₹/kg)</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="px-6 py-4 font-medium">Plastic Waste</td><td className="px-6 py-4">Cat I (Rigid/PET)</td><td className="px-6 py-4 text-emerald-700 font-bold">₹12 - ₹15</td></tr>
                  <tr><td className="px-6 py-4 font-medium">E-Waste</td><td className="px-6 py-4">ITEW (Computers/Phones)</td><td className="px-6 py-4 text-emerald-700 font-bold">₹25 - ₹45</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

const CarbonDetails = ({ onBack }) => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Back to Home
      </button>
      <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-purple-900/50 rounded-xl text-purple-400"><Globe size={40}/></div>
            <div>
              <div className="flex items-center gap-3 mb-1"><h2 className="text-3xl font-bold">Carbon Markets</h2><Badge color="purple">COMING 2026</Badge></div>
              <p className="text-slate-400">Carbon Credit Trading Scheme (CCTS)</p>
            </div>
          </div>
          <div className="space-y-8">
            <section><h3 className="text-xl font-bold text-white mb-3">Why Wait for 2026?</h3><p className="text-slate-300 leading-relaxed">The Indian government is establishing its domestic carbon market (CCTS). While full trading activates in 2026, the <strong>validation phase starts now</strong>.</p></section>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClockIcon = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div><div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-white"><Leaf className="w-6 h-6" /><span className="text-xl font-bold">EcoNexus</span></div><p className="text-sm">India’s Integrated Environmental Compliance & Waste Platform.</p></div>
        <div><h4 className="text-white font-semibold mb-4">Quick Links</h4><ul className="space-y-2 text-sm"><li>About Us</li><li>EPR Credits</li><li>Carbon Markets</li></ul></div>
        <div><h4 className="text-white font-semibold mb-4">Contact</h4><ul className="space-y-2 text-sm"><li>Bangalore, India</li><li>hello@econexus.in</li><li>+91 999 999 9999</li></ul></div>
      </div>
      <div className="border-t border-slate-800 mt-8 pt-8 text-sm text-center">© 2024 EcoNexus Platform. All rights reserved.</div>
    </div>
  </footer>
);

// ==========================================
// 3. AUTHENTICATION SCREENS
// ==========================================

const LoginScreen = ({ onLogin, onSwitchToRegister, onBack, error }) => {
  const [formData, setFormData] = useState({ userId: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.userId, formData.password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 text-white/80 hover:text-white z-10 flex items-center gap-1 font-medium bg-black/20 rounded-full pr-3">
            <ArrowLeft size={18} /> Back
        </button>
        <div className="p-8 text-center bg-slate-900 text-white">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Login to EcoNexus Platform</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <ShieldCheck size={16} /> {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="Enter your ID"
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                />
                <User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Key className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <Button primary type="submit" className="w-full">Login</Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">New here? </span>
            <button onClick={onSwitchToRegister} className="text-emerald-600 font-bold hover:underline">Register Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegistrationFlow = ({ onCancel, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    role: 'institution',
    name: '',
    location: '',
    studentCount: '',
    staffCount: '',
    institutionType: 'College',
    cpcbNo: '',
    monthlyCapacity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if(formData.userId && formData.password) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, type: formData.role, id: Date.now() };
    onComplete(finalData); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        <button 
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            className="absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition z-10 flex items-center gap-1 font-medium pr-3"
        >
            <ArrowLeft size={18} /> Back
        </button>

        <div className="p-8 bg-slate-900 text-white text-center pt-16">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="opacity-90">Step {step} of 2: {step === 1 ? "Credentials" : "Profile Details"}</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={step === 1 ? handleNext : handleSubmit}>
            
            {step === 1 && (
              <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">I am a...</label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`p-6 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${formData.role === 'institution' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input type="radio" name="role" value="institution" checked={formData.role === 'institution'} onChange={handleChange} className="hidden" />
                            <Building2 size={32} className={formData.role === 'institution' ? 'text-emerald-600' : 'text-slate-400'} />
                            <span className={`font-bold text-sm ${formData.role === 'institution' ? 'text-emerald-800' : 'text-slate-600'}`}>Institution</span>
                        </label>
                        <label className={`p-6 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${formData.role === 'recycler' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input type="radio" name="role" value="recycler" checked={formData.role === 'recycler'} onChange={handleChange} className="hidden" />
                            <Recycle size={32} className={formData.role === 'recycler' ? 'text-blue-600' : 'text-slate-400'} />
                            <span className={`font-bold text-sm ${formData.role === 'recycler' ? 'text-blue-800' : 'text-slate-600'}`}>Recycler</span>
                        </label>
                    </div>
                </div>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Create User ID</label><input required name="userId" value={formData.userId} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white" placeholder="Username" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Create Password</label><input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white" placeholder="Password" /></div>
                </div>
                <Button primary type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Next Step</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700">Name</label><input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700">Location</label><input required name="location" value={formData.location} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" /></div>
                    {formData.role === 'institution' ? (<><div><label className="block text-sm font-medium text-slate-700">Students</label><input required name="studentCount" value={formData.studentCount} onChange={handleChange} type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" /></div><div><label className="block text-sm font-medium text-slate-700">Staff</label><input required name="staffCount" value={formData.staffCount} onChange={handleChange} type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" /></div></>) : (<><div><label className="block text-sm font-medium text-slate-700">License No.</label><input required name="cpcbNo" value={formData.cpcbNo} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" /></div><div><label className="block text-sm font-medium text-slate-700">Capacity (Tons)</label><input required name="monthlyCapacity" value={formData.monthlyCapacity} onChange={handleChange} type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" /></div></>)}
                </div>
                <Button primary type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Finish Registration</Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. DASHBOARD COMPONENTS
// ==========================================

const PopulationEditor = ({ initialData, onSave, onBack }) => {
    const [counts, setCounts] = useState({ 
        students: initialData.studentCount || 0, 
        staff: initialData.staffCount || 0 
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
                <ArrowLeft size={16} /> Back to Overview
            </button>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Users className="text-blue-600" />
                    Update Population Metrics
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Total Students</label>
                        <input 
                            type="number" 
                            className="w-full text-3xl font-bold px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={counts.students}
                            onChange={(e) => setCounts({...counts, students: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Faculty & Staff</label>
                        <input 
                            type="number" 
                            className="w-full text-3xl font-bold px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={counts.staff}
                            onChange={(e) => setCounts({...counts, staff: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button primary onClick={() => onSave(counts)} className="w-full justify-center bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                    <Button onClick={onBack} className="w-full justify-center">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

const WasteLogView = ({ logs, onAddLog, onBack }) => {
    const [newLog, setNewLog] = useState({ type: 'Food Waste', amount: '' });

    const handleAdd = () => {
        if(newLog.amount) {
            onAddLog(newLog);
            setNewLog({ ...newLog, amount: '' });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Log Daily Waste Generation</h3>
                <div className="space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Waste Category</label><select className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50" value={newLog.type} onChange={(e) => setNewLog({...newLog, type: e.target.value})}><option>Food Waste</option><option>E-Waste</option><option>Plastic</option><option>Paper</option><option>Bio-Medical</option></select></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Weight Generated (kg)</label><input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50" placeholder="0.00" value={newLog.amount} onChange={(e) => setNewLog({...newLog, amount: e.target.value})} /></div>
                    <div className="flex justify-end pt-4"><Button primary onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 px-6">Log Entry</Button></div>
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100"><Button icon={UploadCloud} className="text-xs">Upload Proof</Button><Button icon={QrCode} className="text-xs">Generate QR</Button></div>
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-2xl mx-auto"><div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">Recent Waste Generation Logs</div>{logs.length > 0 ? (<div className="divide-y divide-slate-100">{logs.map(log => (<div key={log.id} className="p-4 flex justify-between items-center hover:bg-slate-50"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${log.type === 'Food Waste' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{log.type === 'Food Waste' ? <Utensils size={18} /> : <Recycle size={18} />}</div><div><div className="font-medium text-slate-900">{log.type}</div><div className="text-xs text-slate-500">{log.date}</div></div></div><div className="font-mono font-bold text-slate-700">{log.amount} kg</div></div>))}</div>) : (<div className="p-8 text-center text-slate-500">No waste logs yet. Start logging above.</div>)}</div>
        </div>
    );
};

const ProcessedWasteView = ({ onBack }) => {
    const [partners, setPartners] = useState([
        { id: 1, type: "Food Waste", method: "Biogas Generation", partner: "City Biogas Unit 4", contact: "+91 9988776655", status: "Active" },
        { id: 2, type: "Food Waste", method: "Pig Farming Feed", partner: "Green Earth Piggeries", contact: "+91 9988776644", status: "Available" },
        { id: 3, type: "E-Waste", method: "Metal Extraction", partner: "Urban E-Cycle Hub", contact: "+91 9988776633", status: "Active" },
        { id: 4, type: "Plastic", method: "Pyrolysis (Oil)", partner: "Polymer Pro Ltd", contact: "+91 9988776622", status: "Active" },
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Waste Processing & Recycling Network</h3>
                <p className="text-emerald-700 text-sm">Below is the breakdown of how different waste categories are processed. Contact partners directly to schedule pickups.</p>
            </div>

            <div className="grid gap-4">
                {partners.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${p.type === 'Food Waste' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {p.type === 'Food Waste' ? <Utensils size={20} /> : <Recycle size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{p.type} <span className="text-slate-400 font-normal">via</span> {p.method}</div>
                                <div className="text-sm text-slate-500">Partner: <span className="font-medium text-slate-700">{p.partner}</span></div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Badge color={p.status === 'Active' ? 'green' : 'blue'}>{p.status}</Badge>
                            <Button className="flex-1 md:flex-none" icon={PhoneCall} onClick={() => alert(`Calling ${p.partner} at ${p.contact}...`)}>
                                Contact
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EvidenceVaultView = ({ onBack }) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4"><ArrowLeft size={16} /> Back to Dashboard</button>
        <div className="flex justify-between items-center"><div><h3 className="text-xl font-bold text-slate-900">Evidence Vault</h3><p className="text-sm text-slate-500">Central repository for compliance documents.</p></div><Button icon={UploadCloud}>Upload New</Button></div>
        <div className="grid md:grid-cols-4 gap-6">
            {['Waste Logs Proofs', 'MoUs & Contracts', 'Certificates', 'Audit Photos'].map((folder, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md cursor-pointer group text-center"><Folder size={48} className="text-blue-400 mb-3 mx-auto group-hover:text-blue-600 transition-colors" /><h4 className="font-bold text-slate-900">{folder}</h4><p className="text-xs text-slate-500 mt-1">Files Available</p></div>
            ))}
        </div>
    </div>
);

const AuditReportView = ({ onBack }) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4"><ArrowLeft size={16} /> Back to Dashboard</button>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Generate Compliance Reports</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
            {[{ title: "NAAC Criterion 7 Report", desc: "Environmental Consciousness and Sustainability Audit", icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" }, { title: "Green Audit Report", desc: "Complete campus green cover and waste management audit", icon: Leaf, color: "text-green-600", bg: "bg-green-50" }, { title: "Energy Audit Report", desc: "Power consumption and renewable energy usage stats", icon: Battery, color: "text-yellow-600", bg: "bg-yellow-50" }].map((report, i) => (
                <div key={i} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50">
                    <div className="flex items-center gap-4"><div className={`p-4 rounded-xl ${report.bg} ${report.color}`}><report.icon size={24} /></div><div><h4 className="font-bold text-slate-900">{report.title}</h4><p className="text-sm text-slate-500">{report.desc}</p></div></div>
                    <Button icon={Printer} className="w-full sm:w-auto" onClick={() => alert("Generating PDF...")}>Generate PDF</Button>
                </div>
            ))}
        </div>
    </div>
);

const InstitutionOverviewTab = ({ userData, totalWaste, pendingProofsCount, onEditPop, onLogWaste, onRecycleWaste }) => {
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid md:grid-cols-1 gap-6">
                <button onClick={onEditPop} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users size={24} /></div>
                        <Edit2 size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-4xl font-bold text-slate-900 mb-1">{userData.studentCount} <span className="text-lg font-normal text-slate-500">Students</span></h3>
                    <h4 className="text-xl font-bold text-slate-700 mb-4">{userData.staffCount} <span className="text-sm font-normal text-slate-500">Faculty/Staff</span></h4>
                    <p className="text-sm text-blue-600 font-medium">Click to update counts →</p>
                </button>

                <button onClick={onLogWaste} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-orange-400 hover:shadow-md transition-all text-left group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><TrendingUp size={24} /></div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <h3 className="text-4xl font-bold text-slate-900 mb-1">{totalWaste} <span className="text-lg font-normal text-slate-500">kg</span></h3>
                    <p className="text-slate-500 mb-4">Waste Generated</p>
                    <p className="text-sm text-orange-600 font-medium">Log new entry →</p>
                </button>

                <button onClick={onRecycleWaste} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all text-left group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Recycle size={24} /></div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h3 className="text-4xl font-bold text-slate-900 mb-1">0 <span className="text-lg font-normal text-slate-500">kg</span></h3>
                    <p className="text-slate-500 mb-4">Waste Processed</p>
                    <p className="text-sm text-emerald-600 font-medium">View partners →</p>
                </button>
            </div>

            {pendingProofsCount > 0 && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Pending Proof Uploads</h4>
                        <Badge color="amber">Action Required</Badge>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center text-sm">
                            <div>
                                <div className="font-medium text-slate-900">Log #9921 • 25kg Plastic</div>
                                <div className="text-xs text-slate-500">Missing Proof</div>
                            </div>
                            <Button onClick={onLogWaste} className="!py-1 !px-3 text-xs" icon={UploadCloud}>Upload</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RecyclerOverviewTab = ({ userData, totalProcessed = 0 }) => (
    <div className="space-y-8 animate-in fade-in">
         <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4"><div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Factory size={20} /></div></div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalProcessed} <span className="text-lg font-normal text-slate-500">kg</span></h3>
                <p className="text-slate-500 text-sm">Total Waste Processed</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4"><div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Award size={20} /></div></div>
                 <h3 className="text-3xl font-bold text-slate-900 mb-1">12,450</h3>
                 <p className="text-slate-500 text-sm">EPR Credits Issued</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4"><div className="p-2 rounded-lg bg-purple-50 text-purple-600"><BarChart3 size={20} /></div></div>
                 <h3 className="text-3xl font-bold text-slate-900 mb-1">85%</h3>
                 <p className="text-slate-500 text-sm">Capacity Utilization</p>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">Recent Inflow Sources</div>
            <div className="divide-y divide-slate-100">
                <div className="p-4 flex justify-between items-center"><div className="font-medium">St. Xavier's College</div><div className="text-sm text-slate-500">Plastic • 450kg</div><div className="text-xs text-slate-400">Oct 24</div></div>
                <div className="p-4 flex justify-between items-center"><div className="font-medium">City Hospital</div><div className="text-sm text-slate-500">Bio-Medical • 120kg</div><div className="text-xs text-slate-400">Oct 22</div></div>
            </div>
         </div>
         <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white relative overflow-hidden">
             <div className="relative z-10">
                 <h4 className="font-bold mb-2 flex items-center gap-2"><Globe size={18} /> Carbon Offset Potential</h4>
                 <p className="text-sm text-slate-400">Your processing has diverted <strong>45 Tons</strong> of CO2 equivalent this year.</p>
             </div>
         </div>
    </div>
);

const DashboardView = ({ userData, onLogout, onUpdateUser, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [logs, setLogs] = useState([]); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddLog = (log) => {
      const newLog = { ...log, id: Date.now(), date: new Date().toLocaleDateString(), unit: 'kg', status: 'Logged' };
      setLogs([newLog, ...logs]);
  };

  const totalWaste = logs.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  
  const pendingProofsCount = logs.length > 0 ? 1 : 0; // Mock for visual

  const handleUpdateCounts = (newCounts) => {
      onUpdateUser({
          ...userData,
          studentCount: newCounts.students,
          staffCount: newCounts.staff
      });
      setActiveTab('Overview'); 
  };

  const isRecycler = userData.type === 'recycler';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex
        ${isSidebarOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-500" />
            <span className="font-bold text-white">EcoNexus</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Menu</div>
            <button onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'Overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Home size={20}/> Overview</button>
            
            {!isRecycler && (
                <>
                <button onClick={() => { setActiveTab('Log Waste'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'Log Waste' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><FileText size={20}/> Log Waste</button>
                <button onClick={() => { setActiveTab('Processed Waste'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'Processed Waste' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Recycle size={20}/> Processed Waste</button>
                <button onClick={() => { setActiveTab('Proof Vault'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'Proof Vault' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Folder size={20}/> Proof Vault</button>
                <button onClick={() => { setActiveTab('Audit Reports'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'Audit Reports' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><FileBadge size={20}/> Audit Reports</button>
                </>
            )}
            
            <div className="my-4 border-t border-slate-800"></div>
            <button onClick={onGoHome} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-slate-400 hover:text-white"><Globe size={20} /> Home Website</button>
        </div>
        <div className="p-4 border-t border-slate-800"><button onClick={onLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors"><LogOut size={16}/> Logout</button></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0"><div className="flex items-center gap-4"><div className="md:hidden"><button onClick={() => setIsSidebarOpen(true)}><Menu className="text-slate-600" /></button></div><h2 className="font-bold text-slate-800 text-lg">{userData.name} Dashboard</h2></div><div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300">{userData.name[0]}</div></header>
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {activeTab === 'Overview' && (
              isRecycler 
              ? <RecyclerOverviewTab userData={userData} /> 
              : <InstitutionOverviewTab userData={userData} totalWaste={totalWaste} pendingProofsCount={pendingProofsCount} onEditPop={() => setActiveTab('EditPopulation')} onLogWaste={() => setActiveTab('Log Waste')} onRecycleWaste={() => setActiveTab('Processed Waste')} />
          )}
          {activeTab === 'EditPopulation' && <PopulationEditor initialData={userData} onSave={handleUpdateCounts} onBack={() => setActiveTab('Overview')} />}
          {activeTab === 'Log Waste' && <WasteLogView logs={logs} onAddLog={handleAddLog} onBack={() => setActiveTab('Overview')} />}
          {activeTab === 'Processed Waste' && <ProcessedWasteView onBack={() => setActiveTab('Overview')} />}
          {activeTab === 'Proof Vault' && <EvidenceVaultView onBack={() => setActiveTab('Overview')} />}
          {activeTab === 'Audit Reports' && <AuditReportView onBack={() => setActiveTab('Overview')} />}
        </main>
      </div>
    </div>
  );
};

// --- APP CONTROLLER ---
export default function EcoNexusApp() {
  const [view, setView] = useState('home'); 
  const [registeredUsers, setRegisteredUsers] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => { const savedUsers = localStorage.getItem('econexus_users'); if (savedUsers) { setRegisteredUsers(JSON.parse(savedUsers)); } }, []);
  const handleNavigate = (page) => setView(page);
  const handleNavbarAction = () => { if (currentUser) { setView('dashboard'); } else { setView('login'); } };
  const handleLogin = (userId, password) => { if(userId === 'recycler' && password === 'demo') { setCurrentUser({ id: 'rec-demo', name: 'Demo Recycler', type: 'recycler', userId: 'recycler', monthlyCapacity: 500 }); setView('dashboard'); return; } if(userId === 'demo' && password === 'demo') { setCurrentUser({ id: 'demo', name: 'Demo College', type: 'Institution', userId: 'demo', studentCount: 3000, staffCount: 150 }); setView('dashboard'); return; } const user = registeredUsers.find(u => u.userId === userId && u.password === password); if (user) { setCurrentUser(user); setLoginError(''); setView('dashboard'); } else { setLoginError('Invalid User ID or Password.'); } };
  const handleRegister = (userData) => { const newUsers = [...registeredUsers, userData]; setRegisteredUsers(newUsers); localStorage.setItem('econexus_users', JSON.stringify(newUsers)); setCurrentUser(userData); setView('dashboard'); };
  const handleUpdateUser = (updatedData) => { setCurrentUser(updatedData); const newUsers = registeredUsers.map(u => u.id === updatedData.id ? updatedData : u); setRegisteredUsers(newUsers); localStorage.setItem('econexus_users', JSON.stringify(newUsers)); };
  const handleLogout = () => { setCurrentUser(null); setView('home'); };

  if (view === 'dashboard' && currentUser) { return <DashboardView userData={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} onGoHome={() => setView('home')} />; }
  if (view === 'login') { return <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setView('register')} onBack={() => setView('home')} error={loginError} />; }
  if (view === 'register') { return <RegistrationFlow onCancel={() => setView('login')} onComplete={handleRegister} />; }

  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen animate-in fade-in duration-500">
      <Navbar onNavigate={handleNavigate} onLoginClick={handleNavbarAction} onAuthAction={handleNavbarAction} isLoggedIn={!!currentUser} onLogout={handleLogout} />
      {view === 'home' && (<><Hero onRegister={() => setView('register')} onLogin={() => setView('login')} onAuthAction={handleNavbarAction} onLearnMore={() => document.getElementById('about-section').scrollIntoView({behavior: 'smooth'})} isLoggedIn={!!currentUser} /><CreditOpportunities onNavigate={handleNavigate} /><AboutPlatform /><WhyChooseUs /></>)}
      {view === 'solutions' && <Solutions />}
      {view === 'products' && <Products />}
      {view === 'epr' && <EPRDetails onBack={() => setView('home')} />}
      {view === 'carbon' && <CarbonDetails onBack={() => setView('home')} />}
      <Footer />
    </div>
  );
}