import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Star, ShieldCheck, ArrowRight, MessageSquare,
  Menu, X, User, Calendar, ChevronDown, LogOut, Award, BookOpen,
  Sparkles, CheckCircle, Clock, Users, Heart, TrendingUp,
  ChevronRight, BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { matchHobby, HobbyMatch } from './services/aiService';
import { Hobby, Tutor, Space } from './types.ts';

// ─── Navbar ────────────────────────────────────────────────────────────────

const Navbar = ({
  user,
  onNavigate,
  onAuthTrigger,
  onLogout,
  currentPage
}: {
  user: any;
  onNavigate: (page: string) => void;
  onAuthTrigger: () => void;
  onLogout: () => void;
  currentPage: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { label: 'Explore', page: 'explore' },
    { label: 'Spaces', page: 'spaces' },
    { label: 'Resources', page: 'resources' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          className="text-2xl font-display font-bold cursor-pointer flex items-center gap-2"
          onClick={() => onNavigate('home')}
          aria-label="Go to home"
        >
          <div className="w-8 h-8 bg-accent-rose rounded-lg rotate-12 flex items-center justify-center text-white text-sm font-black">H</div>
          Match.<span className="text-zinc-400 font-light">maker</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              className={`text-sm font-semibold transition-colors ${currentPage === page ? 'text-accent-rose' : 'text-zinc-600 hover:text-accent-rose'}`}
              onClick={() => onNavigate(page)}
            >
              {label}
            </button>
          ))}
          <button
            className="text-sm font-bold text-accent-rose px-4 py-2 bg-accent-rose/10 rounded-xl hover:bg-accent-rose/20 transition-all"
            onClick={() => onNavigate('mentor-enroll')}
          >
            Teach a Hobby
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(v => !v)}
                className="flex items-center gap-2 p-1 pl-3 bg-white border border-zinc-100 rounded-full shadow-sm hover:shadow-md transition-all font-display"
                aria-haspopup="true"
                aria-expanded={showProfileMenu}
              >
                <span className="text-sm font-bold">{user.name}</span>
                <div className="w-8 h-8 bg-accent-rose text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name[0].toUpperCase()}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-[55]" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute top-14 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 z-[60]"
                    >
                      <div className="mb-5 pb-5 border-b border-pastel-rose">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-pastel-rose text-accent-rose rounded-xl flex items-center justify-center font-bold">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">{user.role || 'Mentee'}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-zinc-500 font-medium"><BookOpen className="w-3.5 h-3.5" /> Sessions</div>
                            <div className="font-bold">4 Completed</div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-zinc-500 font-medium"><Award className="w-3.5 h-3.5" /> Achievements</div>
                            <div className="font-bold">2 Earned</div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { onLogout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 text-sm font-bold text-zinc-400 hover:text-accent-rose transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={onAuthTrigger} className="btn-primary">Sign Up</button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 transition-transform active:scale-90"
          onClick={() => setIsOpen(v => !v)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white p-6 flex flex-col space-y-4 overflow-hidden"
          >
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                className="text-left font-semibold text-lg py-2 hover:text-accent-rose transition-colors"
                onClick={() => { onNavigate(page); setIsOpen(false); }}
              >
                {label}
              </button>
            ))}
            <button
              className="text-left font-semibold text-lg py-2 text-accent-rose"
              onClick={() => { onNavigate('mentor-enroll'); setIsOpen(false); }}
            >
              Teach a Hobby
            </button>
            {user ? (
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 py-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({user.name})
              </button>
            ) : (
              <button className="btn-primary w-full" onClick={() => { onAuthTrigger(); setIsOpen(false); }}>Join Now</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Modals ────────────────────────────────────────────────────────────────

const SuccessModal = ({
  title, message, details, onClose
}: {
  title: string; message: string; details?: React.ReactNode; onClose: () => void
}) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl max-w-xl w-full text-center relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-rose to-accent-mint" />
      <div className="w-20 h-20 bg-pastel-mint rounded-3xl flex items-center justify-center text-accent-mint mx-auto mb-8">
        <CheckCircle className="w-10 h-10" />
      </div>
      <h2 className="text-3xl md:text-4xl font-display mb-4">{title}</h2>
      <p className="text-zinc-500 font-medium mb-8 leading-relaxed">{message}</p>
      {details && (
        <div className="bg-pastel-rose/50 p-6 rounded-3xl mb-8 text-left border border-white">
          {details}
        </div>
      )}
      <button onClick={onClose} className="btn-primary w-full py-4">Awesome, got it!</button>
    </motion.div>
  </div>
);

const AuthModal = ({ onLogin, onClose }: { onLogin: (name: string, role?: string) => void; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your full name.'); return; }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return; }
    onLogin(trimmed, 'Mentee');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full hover:bg-accent-rose/20 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 bg-pastel-rose text-accent-rose rounded-2xl flex items-center justify-center mb-6">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-3xl md:text-4xl font-display mb-3">Join the community.</h2>
        <p className="text-zinc-500 mb-8 font-medium">Create your free profile to book sessions and track progress.</p>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What's your full name?"
              className={`w-full p-4 bg-pastel-rose rounded-2xl border-2 focus:border-accent-rose outline-none transition-all font-medium ${error ? 'border-red-300' : 'border-transparent'}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            {error && <p className="text-red-400 text-xs font-medium mt-2 ml-1">{error}</p>}
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full py-4 text-lg">
            Create Mentee Profile →
          </button>
          <p className="text-center text-xs text-zinc-400 font-medium">
            By joining, you agree to our <span className="underline cursor-pointer">Terms</span> & <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const BookingModal = ({ tutor, onConfirm, onClose }: { tutor: Tutor; onConfirm: (slot: string) => void; onClose: () => void }) => {
  const slots = ["10:00 AM", "12:30 PM", "4:00 PM", "6:30 PM"];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-xl w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full hover:bg-accent-rose/20 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 mb-8">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-pastel-rose"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=EB8787&color=fff&size=64`; }}
          />
          <div>
            <h2 className="text-xl md:text-2xl font-display">Trial with {tutor.name}</h2>
            <p className="text-accent-rose font-bold text-sm mt-0.5">{tutor.hobby} · ₹{tutor.price}/session</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-pastel-mint/60 border border-accent-mint/20 rounded-2xl p-3 mb-8">
          <Sparkles className="w-4 h-4 text-accent-mint shrink-0" />
          <span className="text-xs font-bold text-accent-mint">First trial session is completely FREE</span>
        </div>

        <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-400">Pick a convenient time slot</h3>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {slots.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSlot(s)}
              className={`p-4 rounded-2xl border-2 transition-all font-bold flex items-center gap-2 justify-center ${selectedSlot === s ? 'border-accent-rose bg-accent-rose/5 text-accent-rose' : 'border-pastel-rose hover:border-accent-rose/50 text-zinc-600'}`}
            >
              <Clock className="w-3.5 h-3.5" /> {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => selectedSlot && onConfirm(selectedSlot)}
          disabled={!selectedSlot}
          className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selectedSlot ? `Book ${selectedSlot} Slot →` : 'Select a time slot above'}
        </button>
      </motion.div>
    </div>
  );
};

const RentSpaceModal = ({ space, onConfirm, onClose }: { space: Space; onConfirm: (date: string, hrs: string) => void; onClose: () => void }) => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('1');
  const today = new Date().toISOString().split('T')[0];
  const totalCost = space.price * parseInt(hours);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-xl w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full hover:bg-accent-rose/20 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 mb-8">
          <img
            src={space.image}
            alt={space.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-pastel-rose"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200'; }}
          />
          <div>
            <h2 className="text-xl md:text-2xl font-display">Rent {space.name}</h2>
            <p className="text-accent-rose font-bold text-sm mt-0.5">₹{space.price}/hr · {space.location}</p>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block tracking-widest">Select Date</label>
            <input
              type="date"
              min={today}
              className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium text-ink border-2 border-transparent focus:border-accent-rose transition-colors"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block tracking-widest">Number of Hours</label>
            <select
              className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-bold text-ink border-2 border-transparent focus:border-accent-rose transition-colors"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            >
              {[1, 2, 3, 4].map(h => <option key={h} value={String(h)}>{h} Hour{h > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-pastel-peach/60 rounded-2xl border border-white">
            <span className="text-sm font-bold text-zinc-500">Total Cost</span>
            <span className="text-lg font-black text-accent-rose">₹{totalCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={() => date && onConfirm(date, hours)}
          disabled={!date}
          className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {date ? 'Confirm Reservation →' : 'Please select a date'}
        </button>
      </motion.div>
    </div>
  );
};

const ListSpaceModal = ({ onClose, onComplete }: { onClose: () => void; onComplete: (data: any) => void }) => {
  const [data, setData] = useState({ name: '', location: '', price: '', spaceType: 'Studio' });
  const isValid = data.name.trim() && data.location.trim() && data.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full hover:bg-accent-rose/20 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-3xl md:text-4xl font-display mb-2">List your space.</h2>
        <p className="text-zinc-500 mb-8 font-medium">Monetize your property by hosting hobby sessions.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="Space Name *" className="p-4 bg-pastel-rose rounded-2xl outline-none font-medium border-2 border-transparent focus:border-accent-rose transition-colors" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
          <input type="text" placeholder="Location (City, Area) *" className="p-4 bg-pastel-rose rounded-2xl outline-none font-medium border-2 border-transparent focus:border-accent-rose transition-colors" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} />
          <select className="p-4 bg-pastel-rose rounded-2xl outline-none font-bold border-2 border-transparent focus:border-accent-rose transition-colors" value={data.spaceType} onChange={e => setData({ ...data, spaceType: e.target.value })}>
            <option>Studio</option>
            <option>Dance Hall</option>
            <option>Kitchen / Culinary</option>
            <option>Music Room</option>
            <option>Outdoor Space</option>
            <option>Workshop</option>
          </select>
          <input type="number" placeholder="Hourly Price (₹) *" min="100" className="p-4 bg-pastel-rose rounded-2xl outline-none font-medium border-2 border-transparent focus:border-accent-rose transition-colors" value={data.price} onChange={e => setData({ ...data, price: e.target.value })} />
          <input type="text" placeholder="Owner / Contact Name" className="p-4 bg-pastel-rose rounded-2xl outline-none col-span-1 sm:col-span-2 font-medium border-2 border-transparent focus:border-accent-rose transition-colors" />
          <input type="email" placeholder="Contact Email" className="p-4 bg-pastel-rose rounded-2xl outline-none col-span-1 sm:col-span-2 font-medium border-2 border-transparent focus:border-accent-rose transition-colors" />
        </div>

        <button
          onClick={() => isValid && onComplete(data)}
          disabled={!isValid}
          className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isValid ? 'Submit Listing →' : 'Fill in required fields (*)'}
        </button>
      </motion.div>
    </div>
  );
};

const MentorApplyModal = ({ onClose, onComplete }: { onClose: () => void; onComplete: (name: string) => void }) => {
  const [formData, setFormData] = useState({ name: '', skill: '', bio: '', fee: '' });
  const isValid = formData.name.trim() && formData.skill.trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full hover:bg-accent-rose/20 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-3xl md:text-4xl font-display mb-2">Apply as Mentor.</h2>
        <p className="text-zinc-500 mb-8 font-medium">Share your expertise and build your personal brand.</p>

        <div className="space-y-4 mb-8">
          <input type="text" placeholder="Full Name *" className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium border-2 border-transparent focus:border-accent-rose transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input type="text" placeholder="Your Hobby / Skill *" className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium border-2 border-transparent focus:border-accent-rose transition-colors" value={formData.skill} onChange={e => setFormData({ ...formData, skill: e.target.value })} />
          <textarea
            placeholder="Tell us about your teaching experience and what makes you special..."
            className="w-full p-4 bg-pastel-rose rounded-2xl outline-none min-h-[120px] font-medium resize-none border-2 border-transparent focus:border-accent-rose transition-colors"
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
          <input type="number" placeholder="Expected Hourly Fee (₹)" min="200" className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium border-2 border-transparent focus:border-accent-rose transition-colors" value={formData.fee} onChange={e => setFormData({ ...formData, fee: e.target.value })} />
        </div>

        <button
          onClick={() => isValid && onComplete(formData.name.trim())}
          disabled={!isValid}
          className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isValid ? 'Complete Registration →' : 'Fill in required fields (*)'}
        </button>
      </motion.div>
    </div>
  );
};

// ─── Pages ─────────────────────────────────────────────────────────────────

const LandingPage = ({ onStartQuiz, onExplore }: { onStartQuiz: () => void; onExplore: () => void }) => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [likedHobbies, setLikedHobbies] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/hobbies').then(res => res.json()).then(setHobbies).catch(console.error);
  }, []);

  const stats = [
    { value: '500+', label: 'Expert Mentors', icon: <Users className="w-5 h-5" /> },
    { value: '8,000+', label: 'Happy Learners', icon: <Heart className="w-5 h-5" /> },
    { value: '50+', label: 'Hobby Categories', icon: <Sparkles className="w-5 h-5" /> },
    { value: '4.9★', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="px-6 py-24 md:py-36 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-rose/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-mint/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl relative">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-rose/10 text-accent-rose text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-8">
            <Sparkles className="w-3 h-3" /> AI-Powered Matchmaking
          </span>
          <h1 className="text-5xl md:text-8xl font-display leading-[1.05] mb-8 text-ink">
            Master that <span className="text-accent-rose italic font-light">hobby</span>
            <br />you always loved.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Personalized matchmaking between India's best mentors and passionate learners. Your first trial session is always <strong className="text-accent-rose">free</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onStartQuiz} className="btn-primary text-lg px-10 py-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Find My Hobby Match
            </button>
            <button onClick={onExplore} className="btn-secondary text-lg px-10 py-4">
              Browse Mentors
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="px-6 py-10 bg-ink">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center text-accent-rose mb-2">{s.icon}</div>
              <div className="text-2xl font-display font-bold text-white">{s.value}</div>
              <div className="text-xs text-zinc-400 font-medium mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hobby Grid */}
      <section className="px-6 py-24 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-2">Discover</p>
              <h2 className="text-4xl md:text-5xl font-display">Popular Activities</h2>
            </div>
            <button onClick={onExplore} className="hidden md:flex items-center gap-2 text-sm font-bold text-accent-rose hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hobbies.slice(0, 4).map((hobby, i) => (
              <motion.div
                key={hobby.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`h-80 rounded-[2.5rem] overflow-hidden group relative cursor-pointer ${i % 2 === 1 ? 'md:mt-10' : ''}`}
                onClick={onExplore}
              >
                <img
                  src={hobby.image}
                  alt={hobby.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent group-hover:from-ink/80 transition-all duration-300" />

                <button
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLikedHobbies(prev => {
                      const next = new Set(prev);
                      next.has(hobby.id) ? next.delete(hobby.id) : next.add(hobby.id);
                      return next;
                    });
                  }}
                  aria-label={likedHobbies.has(hobby.id) ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-4 h-4 transition-colors ${likedHobbies.has(hobby.id) ? 'fill-accent-rose text-accent-rose' : 'text-zinc-400'}`} />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest block mb-1">{hobby.category}</span>
                    <h3 className="text-xl text-white font-display">{hobby.name}</h3>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-300 shadow-lg">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={onExplore} className="mt-8 w-full md:hidden btn-secondary">View all hobbies →</button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-display mb-16">3 steps to your first session</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { num: '01', title: 'Take the Quiz', desc: 'Our AI asks 4 quick questions and recommends hobbies tailored to your goals.', icon: <Sparkles className="w-6 h-6" /> },
              { num: '02', title: 'Pick a Mentor', desc: 'Browse verified mentors, check reviews, and book a free trial in seconds.', icon: <BadgeCheck className="w-6 h-6" /> },
              { num: '03', title: 'Start Learning', desc: 'Show up, have fun, and decide if you want to continue after your free trial.', icon: <TrendingUp className="w-6 h-6" /> },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-8 bg-white rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl font-black text-pastel-rose group-hover:text-accent-rose/30 transition-colors font-display">{step.num}</span>
                  <div className="text-accent-rose">{step.icon}</div>
                </div>
                <h4 className="font-display text-xl mb-3">{step.title}</h4>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <button onClick={onStartQuiz} className="btn-primary mt-12 text-lg px-10 py-4">
            Start Now — It's Free →
          </button>
        </div>
      </section>
    </div>
  );
};

const SpacesPage = ({ onListSpace, onRentSpace }: { onListSpace: () => void; onRentSpace: (s: Space) => void }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/spaces').then(res => res.json()).then(data => { setSpaces(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-2">Find a Venue</p>
            <h2 className="text-5xl md:text-6xl font-display mb-4">Creative Spaces.</h2>
            <p className="text-xl text-zinc-500 font-medium">Rent a studio, workshop, or hall for your sessions.</p>
          </div>
          <button onClick={onListSpace} className="btn-primary shrink-0">+ List Your Space</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[3rem] overflow-hidden animate-pulse">
                <div className="h-64 bg-pastel-rose" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-pastel-rose rounded-full w-3/4" />
                  <div className="h-3 bg-pastel-rose rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {spaces.map(space => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[3rem] border border-white shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative overflow-hidden rounded-[2rem] mb-6">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800'; }}
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-ink">
                    {space.type}
                  </div>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-display">{space.name}</h3>
                  <div className="text-accent-rose font-black text-lg">₹{space.price}<span className="text-xs font-medium text-zinc-400">/hr</span></div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 shrink-0" /> {space.location}
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-6">
                  <Users className="w-4 h-4 shrink-0" /> Fits up to {space.capacity} people
                </div>
                <button onClick={() => onRentSpace(space)} className="btn-primary w-full flex items-center justify-center gap-2">
                  Reserve Space <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MentorEnrollPage = ({ onApply }: { onApply: () => void }) => (
  <div className="pt-40 pb-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-4">For Educators & Creators</p>
      <h2 className="text-5xl md:text-8xl font-display mb-8">Monetize your <span className="text-accent-rose">skill.</span></h2>
      <p className="text-xl text-zinc-500 mb-16 font-medium leading-relaxed max-w-2xl mx-auto">
        Join 500+ successful creators who teach what they love. We handle discovery, bookings, and payments. You handle the magic.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-left">
        {[
          { icon: <Users className="w-6 h-6" />, title: 'Consistent Students', desc: 'Get matched with learners who are actually interested in your niche.' },
          { icon: <Calendar className="w-6 h-6" />, title: 'Zero Admin Hassle', desc: 'No WhatsApp chaos. Automated scheduling, reminders, and payments.' },
          { icon: <Star className="w-6 h-6" />, title: 'Build Your Brand', desc: 'Get verified, collect reviews, and grow your reputation organically.' },
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-[2rem] border border-white hover:shadow-lg transition-all">
            <div className="mb-4 w-12 h-12 bg-pastel-rose rounded-2xl flex items-center justify-center text-accent-rose">{item.icon}</div>
            <h4 className="font-display text-xl mb-2">{item.title}</h4>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-ink text-white rounded-[3rem] p-10 md:p-12 mb-12">
        <div className="grid grid-cols-3 gap-8 mb-10">
          {[['₹25K+', 'Avg. monthly earnings'], ['4.8★', 'Mentor satisfaction'], ['<24h', 'Application review']].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-display font-bold text-accent-rose">{val}</div>
              <div className="text-xs text-zinc-400 font-medium mt-1">{label}</div>
            </div>
          ))}
        </div>
        <button onClick={onApply} className="btn-primary text-xl px-12 py-5 w-full md:w-auto">
          Apply as Mentor →
        </button>
      </div>
    </div>
  </div>
);

const TutorListingPage = ({ hobby, onBookClick }: { hobby: string | null; onBookClick: (tutor: Tutor) => void }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReviews, setActiveReviews] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = hobby ? `/api/tutors?hobby=${encodeURIComponent(hobby)}` : '/api/tutors';
    fetch(url).then(res => res.json()).then(data => { setTutors(data); setLoading(false); }).catch(() => setLoading(false));
  }, [hobby]);

  const filtered = tutors.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.hobby.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-2">{hobby || 'All Mentors'}</p>
          <h2 className="text-4xl md:text-5xl font-display mb-8">{hobby ? `${hobby} Mentors` : 'Discover Mentors'}</h2>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or hobby..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-accent-rose outline-none font-medium shadow-sm transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-[3.5rem] p-10 animate-pulse">
                <div className="flex gap-8">
                  <div className="w-1/2 aspect-square bg-pastel-rose rounded-[2rem]" />
                  <div className="w-1/2 space-y-4 pt-2">
                    <div className="h-6 bg-pastel-rose rounded-full w-3/4" />
                    <div className="h-4 bg-pastel-rose rounded-full w-full" />
                    <div className="h-4 bg-pastel-rose rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-display mb-2">No mentors found</h3>
            <p className="text-zinc-500 mb-4">Try a different search or clear the filter.</p>
            {search && <button onClick={() => setSearch('')} className="btn-secondary">Clear search</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filtered.map((tutor) => (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3.5rem] p-6 md:p-10 border border-white flex flex-col gap-8 hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-square border-4 border-pastel-rose bg-pastel-rose mb-4">
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=FFF5F5&color=EB8787&size=400`; }}
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {tutor.badges?.map(badge => (
                          <div key={badge} className="px-3 py-1 bg-ink text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                            <Sparkles className="w-3 h-3 text-accent-rose" /> {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-sm bg-pastel-mint/50 px-4 py-2.5 rounded-2xl self-start border border-accent-mint/20">
                      <Star className="w-4 h-4 fill-accent-mint text-accent-mint" />
                      {tutor.rating} <span className="text-zinc-400 font-normal">({tutor.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl md:text-3xl font-display">{tutor.name}</h3>
                      {tutor.verified && <ShieldCheck className="w-5 h-5 text-accent-rose shrink-0" aria-label="Verified mentor" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent-rose mb-3">{tutor.hobby}</span>
                    <p className="text-zinc-500 font-medium mb-5 leading-relaxed text-sm line-clamp-3">{tutor.bio}</p>

                    <div className="mb-6">
                      <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-2">Qualifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.certifications?.map(cert => (
                          <div key={cert} className="px-3 py-1.5 bg-pastel-rose rounded-xl text-xs font-bold text-zinc-600 border border-white">{cert}</div>
                        )) ?? <div className="text-xs text-zinc-400 font-medium italic">Verified active professional</div>}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex justify-between items-center p-4 bg-pastel-mint/40 rounded-2xl border border-white">
                        <span className="font-bold text-sm">Free Trial Session</span>
                        <span className="text-accent-mint font-black">FREE</span>
                      </div>
                      <div className="flex justify-between items-center px-4 text-xs text-zinc-400">
                        <span>Regular sessions from</span>
                        <span className="font-bold text-ink">₹{tutor.price}/session</span>
                      </div>
                      <button onClick={() => onBookClick(tutor)} className="btn-primary w-full">Book Free Trial →</button>
                      <button
                        onClick={() => setActiveReviews(activeReviews === tutor.id ? null : tutor.id)}
                        className="text-xs font-bold uppercase tracking-widest text-zinc-400 py-2 flex items-center justify-center gap-2 hover:text-accent-rose transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {activeReviews === tutor.id ? 'Hide Reviews' : 'See Reviews'}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {activeReviews === tutor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-t border-pastel-rose pt-6"
                    >
                      <div className="space-y-5">
                        {[
                          { u: 'Meera K.', r: 'Absolutely loved the session! Very patient and encouraging.', s: 5 },
                          { u: 'Arjun S.', r: 'Great energy and very clear instructions. Highly recommend!', s: 5 },
                        ].map((rev, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-pastel-rose flex items-center justify-center font-bold text-accent-rose shrink-0">{rev.u[0]}</div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">{rev.u}</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: rev.s }).map((_, j) => (
                                    <Star key={j} className="w-3 h-3 fill-accent-mint text-accent-mint" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-zinc-500 font-medium leading-relaxed">"{rev.r}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const QuizPage = ({ onComplete }: { onComplete: (results: HobbyMatch[]) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState('');

  const questions = [
    { text: "What's your goal for a new hobby?", options: ['Stress Relief', 'Self-expression', 'Socializing', 'Physical Fitness'] },
    { text: 'How much time can you commit?', options: ['Weekend Fun', 'Daily Practice', 'A Few Hours Weekly', 'Professional Path'] },
    { text: 'Which area interests you most?', options: ['Musical Instruments', 'Dance & Movement', 'Craft & Fine Arts', 'Baking & Cooking'] },
    { text: 'What learning environment suits you?', options: ['1-on-1 Private', 'Small Groups', 'At Home Online', 'Studio / Outdoor'] },
  ];

  const handleAnswer = async (answer: string) => {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsMatching(true);
      setError('');
      try {
        const results = await matchHobby(nextAnswers);
        onComplete(results);
      } catch {
        setIsMatching(false);
        setError('Could not fetch matches. Please check your API key or try again.');
      }
    }
  };

  if (isMatching) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 border-4 border-pastel-rose border-t-accent-rose rounded-full animate-spin mb-8" />
      <h2 className="text-3xl md:text-4xl font-display mb-3">Finding your perfect match...</h2>
      <p className="text-zinc-400 font-medium">Our AI is analysing your answers</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 flex justify-center items-center">
      <div className="max-w-xl w-full">
        <div className="mb-10">
          <div className="flex justify-between text-xs font-bold text-zinc-400 mb-3">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round((step / questions.length) * 100)}% done</span>
          </div>
          <div className="h-2 bg-pastel-rose rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-rose rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <h2 className="text-3xl md:text-5xl font-display mb-10">{questions[step].text}</h2>
          <div className="grid grid-cols-1 gap-4">
            {questions[step].options.map((o, i) => (
              <button
                key={`${o}-${i}`}
                onClick={() => handleAnswer(o)}
                className="p-5 text-left bg-white border-2 border-transparent hover:border-accent-rose rounded-[2rem] text-lg font-bold transition-all flex justify-between items-center group hover:shadow-lg active:scale-[0.98]"
              >
                <span>{o}</span>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-accent-rose" />
              </button>
            ))}
          </div>
        </motion.div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium">{error}</div>
        )}
      </div>
    </div>
  );
};

const RecommendationsPage = ({ matches, onTutorSelect }: { matches: HobbyMatch[]; onTutorSelect: (hobby: string) => void }) => {
  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-pastel-mint text-accent-mint',
    Intermediate: 'bg-pastel-peach text-accent-rose',
    Advanced: 'bg-pastel-lavender text-accent-purple',
  };

  return (
    <div className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-3">Your AI Matches</p>
        <h2 className="text-4xl md:text-6xl font-display mb-4">Perfect hobbies for you.</h2>
        <p className="text-zinc-500 font-medium mb-12">Based on your answers, here are your top 3 hobby matches.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {matches.map((m, i) => (
            <motion.div
              key={`${m.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white p-10 rounded-[3rem] border border-white flex flex-col h-full hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full ${difficultyColors[m.difficulty] || 'bg-pastel-rose text-accent-rose'}`}>
                  {m.difficulty}
                </span>
                <span className="text-2xl font-display font-bold text-zinc-200 group-hover:text-accent-rose/20 transition-colors">#{i + 1}</span>
              </div>
              <h3 className="text-3xl font-display mb-4">{m.name}</h3>
              <p className="text-zinc-500 font-medium mb-10 flex-1 leading-relaxed text-sm">{m.reason}</p>
              <button onClick={() => onTutorSelect(m.name)} className="btn-primary w-full flex items-center justify-center gap-2">
                Explore Mentors <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResourcesPage = () => (
  <div className="pt-40 pb-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-3">Coming Soon</p>
      <h2 className="text-5xl font-display mb-6">Resources</h2>
      <p className="text-zinc-500 font-medium">Guides, tutorials, and tips from our mentor community — coming soon.</p>
    </div>
  </div>
);

// ─── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingTutor, setPendingTutor] = useState<Tutor | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [showListSpace, setShowListSpace] = useState(false);
  const [showMentorEnroll, setShowMentorEnroll] = useState(false);
  const [matches, setMatches] = useState<HobbyMatch[]>([]);
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ title: string; message: string; details?: React.ReactNode } | null>(null);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FIX: After login, auto-open pending booking
  const handleLogin = (name: string, role?: string) => {
    setUser({ name, role });
    setShowAuth(false);
    if (pendingTutor) {
      setSelectedTutor(pendingTutor);
      setPendingTutor(null);
    }
  };

  const handleBooking = (tutor: Tutor) => {
    if (!user) {
      setPendingTutor(tutor);
      setShowAuth(true);
    } else {
      setSelectedTutor(tutor);
    }
  };

  const handleConfirmSlot = (slot: string) => {
    setSuccess({
      title: 'Trial Booked! 🎉',
      message: 'You will get a notification once the mentor confirms the slot.',
      details: (
        <div className="space-y-3 text-sm">
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block mb-1">Mentor</span><span className="font-bold">{selectedTutor?.name}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block mb-1">Hobby</span><span className="font-bold">{selectedTutor?.hobby}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block mb-1">Time</span><span className="font-bold">{slot} · Tomorrow</span></div>
          <div className="mt-3 p-3 bg-accent-mint/10 rounded-2xl flex items-center gap-2 border border-accent-mint/20">
            <Sparkles className="w-4 h-4 text-accent-mint shrink-0" />
            <span className="text-xs font-bold text-accent-mint">Mentor typically responds within 1 hour!</span>
          </div>
        </div>
      )
    });
    setSelectedTutor(null);
  };

  const handleSpaceComplete = (data: any) => {
    setSuccess({
      title: 'Listing Submitted!',
      message: "Your space listing has been sent for verification. You'll receive a confirmation email within 24 hours.",
      details: (
        <div className="space-y-2 text-sm">
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Space Name</span><span className="font-bold">{data.name}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Type</span><span className="font-bold">{data.spaceType}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Rate</span><span className="font-bold">₹{data.price}/hour</span></div>
        </div>
      )
    });
    setShowListSpace(false);
  };

  const handleMentorComplete = (name: string) => {
    setSuccess({
      title: 'Application Received!',
      message: 'Welcome! We will verify your profile and get back within 24 hours.',
      details: (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pastel-rose rounded-xl flex items-center justify-center font-bold text-accent-rose text-lg">{name[0].toUpperCase()}</div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] font-bold block">Applicant</span>
            <span className="font-bold">{name}</span>
          </div>
        </div>
      )
    });
    setShowMentorEnroll(false);
  };

  const handleRentConfirm = (date: string, hrs: string) => {
    setSuccess({
      title: 'Reservation Sent!',
      message: 'The space owner has been notified and will confirm shortly.',
      details: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Space</span><span className="font-bold">{selectedSpace?.name}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Date</span><span className="font-bold">{new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Duration</span><span className="font-bold">{hrs} Hour{Number(hrs) > 1 ? 's' : ''}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Total</span><span className="font-bold text-accent-rose">₹{(selectedSpace?.price ?? 0) * Number(hrs)}</span></div>
        </div>
      )
    });
    setSelectedSpace(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent-rose selection:text-white bg-[#FDFBF9]">
      <Navbar user={user} onNavigate={navigateTo} onAuthTrigger={() => setShowAuth(true)} onLogout={() => setUser(null)} currentPage={currentPage} />

      <main>
        {currentPage === 'home' && <LandingPage onStartQuiz={() => navigateTo('quiz')} onExplore={() => navigateTo('explore')} />}
        {currentPage === 'quiz' && <QuizPage onComplete={r => { setMatches(r); setCurrentPage('recommendations'); }} />}
        {currentPage === 'recommendations' && <RecommendationsPage matches={matches} onTutorSelect={h => { setSelectedHobby(h); setCurrentPage('tutors'); }} />}
        {currentPage === 'explore' && <TutorListingPage hobby={null} onBookClick={handleBooking} />}
        {currentPage === 'tutors' && <TutorListingPage hobby={selectedHobby} onBookClick={handleBooking} />}
        {currentPage === 'spaces' && <SpacesPage onListSpace={() => setShowListSpace(true)} onRentSpace={s => setSelectedSpace(s)} />}
        {currentPage === 'mentor-enroll' && <MentorEnrollPage onApply={() => setShowMentorEnroll(true)} />}
        {currentPage === 'resources' && <ResourcesPage />}
      </main>

      <AnimatePresence>
        {showAuth && <AuthModal onLogin={handleLogin} onClose={() => { setShowAuth(false); setPendingTutor(null); }} />}
        {selectedTutor && user && <BookingModal tutor={selectedTutor} onConfirm={handleConfirmSlot} onClose={() => setSelectedTutor(null)} />}
        {showListSpace && <ListSpaceModal onClose={() => setShowListSpace(false)} onComplete={handleSpaceComplete} />}
        {selectedSpace && <RentSpaceModal space={selectedSpace} onConfirm={handleRentConfirm} onClose={() => setSelectedSpace(null)} />}
        {showMentorEnroll && <MentorApplyModal onClose={() => setShowMentorEnroll(false)} onComplete={handleMentorComplete} />}
        {success && <SuccessModal title={success.title} message={success.message} details={success.details} onClose={() => setSuccess(null)} />}
      </AnimatePresence>

      <footer className="bg-ink text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div>
              <div className="text-3xl font-display font-bold mb-3">Hobby Matchmaker</div>
              <p className="text-zinc-400 text-sm font-medium max-w-xs leading-relaxed">India's first AI-powered marketplace for hobby learning.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm font-medium text-zinc-400">
              {[['Explore Mentors', 'explore'], ['Find Spaces', 'spaces'], ['Teach a Hobby', 'mentor-enroll'], ['Resources', 'resources']].map(([label, page]) => (
                <button key={page} onClick={() => navigateTo(page)} className="text-left hover:text-white transition-colors">{label}</button>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-zinc-500">© 2026 Hobby Matchmaker. Crafted with ♥ in India.</div>
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
              {['Privacy', 'Terms', 'Careers'].map(l => <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
