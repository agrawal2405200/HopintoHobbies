import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, ShieldCheck, Play, ArrowRight, MessageSquare, Menu, X, User, Heart, Calendar, CheckCircle2, ChevronDown, LogOut, Award, BookOpen, Quote, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { matchHobby, HobbyMatch } from './services/aiService';
import { Hobby, Tutor, Space } from './types.ts';

// --- Shared Components ---

const Navbar = ({ 
  user, 
  onNavigate, 
  onAuthTrigger,
  onLogout
}: { 
  user: any; 
  onNavigate: (page: string) => void; 
  onAuthTrigger: () => void;
  onLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="text-2xl font-display font-bold cursor-pointer flex items-center gap-2" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-accent-rose rounded-lg rotate-12 flex items-center justify-center text-white">H</div>
          Match.<span className="text-zinc-600 font-light">maker</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {['Explore', 'Spaces', 'Resources'].map((item) => (
            <button 
              key={item} 
              className="text-sm font-semibold text-zinc-600 hover:text-accent-rose transition-colors"
              onClick={() => onNavigate(item.toLowerCase())}
            >
              {item}
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
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-3 bg-white border border-white rounded-full shadow-sm hover:shadow-md transition-all font-display"
              >
                <span className="text-sm font-bold">{user.name}</span>
                <div className="w-8 h-8 bg-accent-rose text-white rounded-full flex items-center justify-center font-bold">
                  {user.name[0]}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-12 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-white p-6 overflow-hidden z-[60]"
                  >
                    <div className="mb-6 pb-6 border-b border-pastel-rose">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-pastel-rose text-accent-rose rounded-xl flex items-center justify-center font-bold">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">{user.role || 'Mentee'}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
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
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 text-sm font-bold text-zinc-400 hover:text-accent-rose transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={onAuthTrigger} className="btn-primary">Sign Up</button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 transition-transform active:scale-90">{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white p-6 flex flex-col space-y-4 overflow-hidden"
          >
            {['Explore', 'Spaces', 'Resources', 'Teach a Hobby'].map((item) => (
              <button key={item} className="text-left font-semibold text-lg py-2" onClick={() => { onNavigate(item === 'Teach a Hobby' ? 'mentor-enroll' : item.toLowerCase()); setIsOpen(false); }}>{item}</button>
            ))}
            {!user && <button className="btn-primary w-full" onClick={() => { onAuthTrigger(); setIsOpen(false); }}>Join Now</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SuccessModal = ({ 
  title, 
  message, 
  details, 
  onClose 
}: { 
  title: string; 
  message: string; 
  details?: React.ReactNode; 
  onClose: () => void 
}) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-xl w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-accent-rose" />
        <div className="w-20 h-20 bg-pastel-mint rounded-3xl flex items-center justify-center text-accent-mint mx-auto mb-8">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-display mb-4">{title}</h2>
        <p className="text-zinc-500 font-medium mb-8 leading-relaxed">{message}</p>
        
        {details && (
          <div className="bg-pastel-rose/50 p-6 rounded-3xl mb-8 text-left border border-white">
            {details}
          </div>
        )}
        
        <button onClick={onClose} className="btn-primary w-full py-4">Awesome</button>
      </motion.div>
    </div>
  );
};

const AuthModal = ({ onLogin, onClose }: { onLogin: (name: string, role?: string) => void; onClose: () => void }) => {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full"><X className="w-5 h-5"/></button>
        <div className="w-12 h-12 bg-pastel-rose text-accent-rose rounded-2xl flex items-center justify-center mb-6">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-4xl font-display mb-4">Join the community.</h2>
        <p className="text-zinc-500 mb-8 font-medium">To book slots and save progress, please create your profile first.</p>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="What's your full name?" 
            className="w-full p-4 bg-pastel-rose rounded-2xl border border-transparent focus:border-accent-rose outline-none transition-all font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => name && onLogin(name, 'Mentee')} className="btn-primary w-full py-4 text-lg">Create Mentee Profile</button>
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
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full"><X className="w-5 h-5"/></button>
        <div className="flex items-center gap-4 mb-8">
          <img src="/images/your-photo.png" />
          <div>
            <h2 className="text-2xl font-display">Confirm Trial with {tutor.name}</h2>
            <p className="text-accent-rose font-bold text-sm">Category: {tutor.hobby}</p>
          </div>
        </div>
        
        <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-400">Pick a convenient time</h3>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {slots.map(s => (
            <button 
              key={s} 
              onClick={() => setSelectedSlot(s)}
              className={`p-4 rounded-2xl border-2 transition-all font-bold ${selectedSlot === s ? 'border-accent-rose bg-accent-rose/5 text-accent-rose' : 'border-pastel-rose hover:border-accent-rose'}`}
            >
              {s}
            </button>
          ))}
        </div>
        
        <button onClick={() => selectedSlot && onConfirm(selectedSlot)} disabled={!selectedSlot} className="btn-primary w-full">Finalize Booking</button>
      </motion.div>
    </div>
  );
};

const RentSpaceModal = ({ space, onConfirm, onClose }: { space: Space; onConfirm: (date: string, hrs: string) => void; onClose: () => void }) => {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("1");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-xl w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full"><X className="w-5 h-5"/></button>
        <div className="flex items-center gap-4 mb-8">
          <img src={space.image} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          <div>
            <h2 className="text-2xl font-display">Rent {space.name}</h2>
            <p className="text-accent-rose font-bold text-sm">₹{space.price}/hr • {space.location}</p>
          </div>
        </div>
        
        <div className="space-y-6 mb-10 text-left">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block">Select Date</label>
            <input type="date" className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium text-ink" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block">Number of Hours</label>
            <select className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-bold text-ink" value={hours} onChange={(e) => setHours(e.target.value)}>
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="3">3 Hours</option>
              <option value="4">4 Hours</option>
            </select>
          </div>
        </div>
        
        <button onClick={() => onConfirm(date, hours)} disabled={!date} className="btn-primary w-full">Confirm Reservation</button>
      </motion.div>
    </div>
  );
};

const ListSpaceModal = ({ onClose, onComplete }: { onClose: () => void; onComplete: (data: any) => void }) => {
  const [data, setData] = useState({ name: '', location: '', price: '' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full"><X className="w-5 h-5"/></button>
        <h2 className="text-4xl font-display mb-2">List your space.</h2>
        <p className="text-zinc-500 mb-8 font-medium">Monetize your idle property by hosting hobby sessions.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <input type="text" placeholder="Space Name" className="p-4 bg-pastel-rose rounded-2xl outline-none font-medium" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
          <input type="text" placeholder="Location" className="p-4 bg-pastel-rose rounded-2xl outline-none font-medium" value={data.location} onChange={e => setData({...data, location: e.target.value})} />
          <select className="p-4 bg-pastel-rose rounded-2xl outline-none font-bold">
            <option>Studio</option>
            <option>Hall</option>
            <option>Workshop</option>
          </select>
          <input type="number" placeholder="Hourly Price (₹)" className="p-4 bg-pastel-rose rounded-2xl outline-none font-medium" value={data.price} onChange={e => setData({...data, price: e.target.value})} />
          <input type="text" placeholder="Owner Name" className="p-4 bg-pastel-rose rounded-2xl outline-none col-span-2 font-medium" />
          <input type="email" placeholder="Contact Email" className="p-4 bg-pastel-rose rounded-2xl outline-none col-span-2 font-medium" />
        </div>
        
        <button onClick={() => onComplete(data)} className="btn-primary w-full">Submit Listing</button>
      </motion.div>
    </div>
  );
};

const MentorApplyModal = ({ onClose, onComplete }: { onClose: () => void; onComplete: (name: string) => void }) => {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/20 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-pastel-rose rounded-full"><X className="w-5 h-5"/></button>
        <h2 className="text-4xl font-display mb-2">Apply as Mentor.</h2>
        <p className="text-zinc-500 mb-8 font-medium">Share your expertise and build your personal brand.</p>
        
        <div className="space-y-4 mb-10">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium" 
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input type="text" placeholder="Your Hobby/Skill" className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium" />
          <textarea placeholder="Tell us about your teaching experience..." className="w-full p-4 bg-pastel-rose rounded-2xl outline-none min-h-[100px] font-medium" />
          <input type="number" placeholder="Expected Hourly Fee (₹)" className="w-full p-4 bg-pastel-rose rounded-2xl outline-none font-medium" />
        </div>
        
        <button onClick={() => onComplete(name)} className="btn-primary w-full">Complete Registration</button>
      </motion.div>
    </div>
  );
};

// --- Pages ---

const LandingPage = ({ onStartQuiz, onExplore }: { onStartQuiz: () => void, onExplore: () => void }) => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    fetch('/api/hobbies').then(res => res.json()).then(setHobbies);
  }, []);

  return (
    <div className="pt-20">
      <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-accent-rose/10 text-accent-rose text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-8">
            Experience the joy of learning
          </span>
          <h1 className="text-6xl md:text-8xl font-display leading-[1] mb-8 text-ink">
            Master that <span className="text-accent-rose italic font-light">hobby</span> you always loved.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Personalized matchmaking between India's best mentors and passionate learners. Start with a free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={onStartQuiz} className="btn-primary text-lg px-10">Start Matching</button>
            <button onClick={onExplore} className="btn-secondary text-lg px-10">Explore Hobbies</button>
          </div>
        </motion.div>
      </section>

      {/* Decorative Grid */}
      <section className="px-6 py-20 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display mb-12">Popular Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hobbies.slice(0, 4).map((hobby, i) => (
              <motion.div 
                key={hobby.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`h-80 rounded-[2.5rem] overflow-hidden group relative cursor-pointer ${i % 2 === 0 ? 'mt-0' : 'md:mt-12'}`}
                onClick={onExplore}
              >
                <img src={hobby.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
                  <h3 className="text-2xl text-white font-display">{hobby.name}</h3>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const SpacesPage = ({ onListSpace, onRentSpace }: { onListSpace: () => void, onRentSpace: (s: Space) => void }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  useEffect(() => {
    fetch('/api/spaces').then(res => res.json()).then(setSpaces);
  }, []);

  return (
    <div className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-6xl font-display mb-4">Creative Spaces.</h2>
            <p className="text-xl text-zinc-500 font-medium">Rent a studio, workshop, or hall for your hobby sessions.</p>
          </div>
          <button onClick={onListSpace} className="btn-primary">List your space</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {spaces.map(space => (
            <div key={space.id} className="bg-white p-6 rounded-[3rem] border border-white shadow-sm hover:shadow-xl transition-all">
              <img src={space.image} className="w-full h-64 rounded-[2rem] object-cover mb-6" referrerPolicy="no-referrer" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-display">{space.name}</h3>
                <div className="text-accent-rose font-bold">₹{space.price}/hr</div>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-6">
                <MapPin className="w-4 h-4" /> {space.location}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-pastel-rose">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Fits {space.capacity} pax</span>
                <button onClick={() => onRentSpace(space)} className="text-accent-rose font-bold flex items-center gap-2">Rent Now <ArrowRight className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MentorEnrollPage = ({ onApply }: { onApply: () => void }) => (
  <div className="pt-40 pb-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-6xl md:text-8xl font-display mb-12">Monetize your <span className="text-accent-rose">skill.</span></h2>
      <p className="text-xl text-zinc-500 mb-16 font-medium leading-relaxed">
        Join 500+ successful creators who teach what they love. We handle discovery, bookings, and payments. You handle the magic.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20 text-left">
        {[
          { icon: <User />, title: "Lead Gen", desc: "Get consistent students" },
          { icon: <Calendar />, title: "Automated", desc: "No WhatsApp chaos" },
          { icon: <Star />, title: "Build Brand", desc: "Get rated & verified" }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-[2rem] border border-white">
            <div className="mb-4 text-accent-rose">{item.icon}</div>
            <h4 className="font-display text-xl mb-2">{item.title}</h4>
            <p className="text-sm text-zinc-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
      
      <button onClick={onApply} className="btn-primary text-xl px-12 py-5">Apply as Mentor</button>
    </div>
  </div>
);

const TutorListingPage = ({ hobby, onBookClick }: { hobby: string | null, onBookClick: (tutor: Tutor) => void }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReviews, setActiveReviews] = useState<string | null>(null);

  useEffect(() => {
    const url = hobby ? `/api/tutors?hobby=${hobby}` : '/api/tutors';
    fetch(url).then(res => res.json()).then(data => {
      setTutors(data);
      setLoading(false);
    });
  }, [hobby]);

  return (
    <div className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-display mb-12">{hobby ? `${hobby} Mentors` : 'Discover Mentors'}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {tutors.map((tutor) => (
            <motion.div key={tutor.id} className="bg-white rounded-[3.5rem] p-6 md:p-10 border border-white flex flex-col gap-10 hover:shadow-2xl transition-all">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="relative group cursor-pointer mb-6 rounded-[2.5rem] overflow-hidden aspect-square border-4 border-pastel-rose bg-pastel-rose">
                    <img src={tutor.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    
                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {tutor.badges?.map(badge => (
                        <div key={badge} className="px-3 py-1 bg-ink text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                          <Sparkles className="w-3 h-3 text-accent-rose" /> {badge}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-sm bg-pastel-mint/50 px-4 py-2 rounded-2xl self-start border border-accent-mint/20">
                     <Star className="w-4 h-4 fill-accent-mint text-accent-mint" /> {tutor.rating} ({tutor.reviews} reviews)
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-3xl font-display">{tutor.name}</h3>
                    {tutor.verified && <ShieldCheck className="w-6 h-6 text-accent-rose" />}
                  </div>
                  <p className="text-zinc-500 font-medium mb-6 leading-relaxed line-clamp-3">{tutor.bio}</p>
                  
                  {/* Certifications */}
                  <div className="mb-8">
                    <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-3">Qualifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {tutor.certifications?.map(cert => (
                        <div key={cert} className="px-3 py-1.5 bg-pastel-rose rounded-xl text-xs font-bold text-zinc-600 border border-white">
                          {cert}
                        </div>
                      )) || <div className="text-xs text-zinc-400 font-medium italic">Verified active professional</div>}
                    </div>
                  </div>
                  
                  <div className="mt-auto flex flex-col gap-3">
                    <div className="flex justify-between items-center text-lg font-bold p-4 bg-pastel-peach/50 rounded-2xl border border-white">
                      <span>Trial Class</span>
                      <span className="text-accent-rose">FREE</span>
                    </div>
                    <button onClick={() => onBookClick(tutor)} className="btn-primary w-full">Book Trial</button>
                    <button 
                      onClick={() => setActiveReviews(activeReviews === tutor.id ? null : tutor.id)}
                      className="text-xs font-bold uppercase tracking-widest text-zinc-400 py-2 flex items-center justify-center gap-2 hover:text-accent-rose transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" /> {activeReviews === tutor.id ? 'Hide Reviews' : 'Check Reviews'}
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
                    className="overflow-hidden border-t border-pastel-rose pt-8"
                  >
                    <div className="space-y-6">
                      {[
                        { u: "Meera K.", r: "Absolutely loved the session! Ananya is very patient.", s: 5 },
                        { u: "Arjun S.", r: "Great energy and very clear instructions.", s: 4 }
                      ].map((rev, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-pastel-rose flex items-center justify-center font-bold text-accent-rose">{rev.u[0]}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm">{rev.u}</span>
                              <div className="flex"><Star className="w-3 h-3 fill-accent-mint text-accent-mint" /> <Star className="w-3 h-3 fill-accent-mint text-accent-mint" /> <Star className="w-3 h-3 fill-accent-mint text-accent-mint" /></div>
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
      </div>
    </div>
  );
};

const QuizPage = ({ onComplete }: { onComplete: (results: HobbyMatch[]) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const questions = [
    { text: "What's your goal for a new hobby?", options: ["Stress Relief", "Self-expression", "Socializing", "Physical Fitness"] },
    { text: "Commitment level?", options: ["Weekend Fun", "Daily Discipline", "Casual", "Professional Path"] },
    { text: "Interest area?", options: ["Musical Instruments", "Dance & Movement", "Craft & Fine Arts", "Baking & Cooking"] },
    { text: "Learning style?", options: ["Individual Prep", "Vibrant Groups", "At Home", "Outdoor Studios"] }
  ];

  const handleAnswer = (answer: string) => {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    if (step < questions.length - 1) setStep(step + 1);
    else process(nextAnswers);
  };

  const process = async (ans: string[]) => {
    setIsMatching(true);
    const results = await matchHobby(ans);
    onComplete(results);
  };

  if (isMatching) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 border-4 border-pastel-rose border-t-accent-rose rounded-full animate-spin mb-8" />
      <h2 className="text-4xl mb-4 font-display">Finding your perfect match...</h2>
    </div>
  );

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 flex justify-center items-center">
      <div className="max-w-xl w-full">
        <h2 className="text-4xl md:text-6xl font-display mb-12">{questions[step].text}</h2>
        <div className="grid grid-cols-1 gap-4">
          {questions[step].options.map((o, i) => (
            <button key={`${o}-${i}`} onClick={() => handleAnswer(o)} className="p-6 text-left bg-white border border-transparent hover:border-accent-rose rounded-[2rem] text-xl font-bold transition-all flex justify-between items-center">
              {o} <ArrowRight className="w-6 h-6"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecommendationsPage = ({ matches, onTutorSelect }: { matches: HobbyMatch[], onTutorSelect: (hobby: string) => void }) => (
  <div className="pt-40 pb-20 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-6xl font-display mb-8">Matches found.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {matches.map((m, i) => (
          <div key={`${m.name}-${i}`} className="bg-white p-10 rounded-[3rem] border border-white flex flex-col h-full">
            <span className="text-[10px] uppercase font-bold text-accent-rose tracking-widest mb-4">{m.difficulty}</span>
            <h3 className="text-3xl font-display mb-6">{m.name}</h3>
            <p className="text-zinc-500 font-medium mb-10 flex-1">{m.reason}</p>
            <button onClick={() => onTutorSelect(m.name)} className="btn-primary w-full">Explore Mentors</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [showListSpace, setShowListSpace] = useState(false);
  const [showMentorEnroll, setShowMentorEnroll] = useState(false);
  const [matches, setMatches] = useState<HobbyMatch[]>([]);
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  
  // Success Modals state
  const [success, setSuccess] = useState<{ title: string; message: string; details?: React.ReactNode } | null>(null);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleBooking = (tutor: Tutor) => {
    if (!user) {
      setSelectedTutor(tutor);
      setShowAuth(true); // Signup first
    } else {
      setSelectedTutor(tutor); // Already logged in, show slots
    }
  };

  const handleConfirmSlot = (slot: string) => {
    setSuccess({
      title: "Trial Requested!",
      message: "You will get a notification once the mentor confirms the slot.",
      details: (
        <div className="space-y-1 text-sm">
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block mb-1">Mentor</span> <span className="font-bold">{selectedTutor?.name}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block mb-1">Time</span> <span className="font-bold">{slot} • Tomorrow</span></div>
          <div className="mt-4 p-3 bg-accent-mint/10 rounded-2xl flex items-center gap-2 border border-accent-mint/20">
            <Sparkles className="w-4 h-4 text-accent-mint" />
            <span className="text-xs font-bold text-accent-mint">Mentor is usually quick to respond!</span>
          </div>
        </div>
      )
    });
    setSelectedTutor(null);
  };

  const handleSpaceComplete = (data: any) => {
    setSuccess({
      title: "Listing Submitted!",
      message: "Your space listing has been sent for verification. You'll receive a confirmation email shortly.",
      details: (
        <div className="space-y-2">
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Space Name</span> <span className="font-bold">{data.name}</span></div>
          <div><span className="text-zinc-400 uppercase text-[10px] font-bold block">Rate</span> <span className="font-bold">₹{data.price}/hour</span></div>
        </div>
      )
    });
    setShowListSpace(false);
  };

  const handleMentorComplete = (name: string) => {
    setSuccess({
      title: "Application Received!",
      message: "Welcome to the family! We will verify your profile and get back to you within 24 hours.",
      details: (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pastel-rose rounded-xl flex items-center justify-center font-bold text-accent-rose">{name[0]}</div>
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
      title: "Reservation Sent!",
      message: "The space owner has been notified. You will get a confirmation once they approve the booking.",
      details: (
        <div className="space-y-1">
          <div className="flex gap-4">
             <div className="flex-1">
               <span className="text-zinc-400 uppercase text-[10px] font-bold block">Date</span>
               <span className="font-bold">{date}</span>
             </div>
             <div className="flex-1">
               <span className="text-zinc-400 uppercase text-[10px] font-bold block">Duration</span>
               <span className="font-bold">{hrs} Hours</span>
             </div>
          </div>
        </div>
      )
    });
    setSelectedSpace(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent-rose selection:text-white bg-[#FDFBF9]">
      <Navbar user={user} onNavigate={navigateTo} onAuthTrigger={() => setShowAuth(true)} onLogout={() => setUser(null)} />
      
      <main>
        {currentPage === 'home' && <LandingPage onStartQuiz={() => navigateTo('quiz')} onExplore={() => navigateTo('explore')} />}
        {currentPage === 'quiz' && <QuizPage onComplete={r => { setMatches(r); setCurrentPage('recommendations'); }} />}
        {currentPage === 'recommendations' && <RecommendationsPage matches={matches} onTutorSelect={h => { setSelectedHobby(h); setCurrentPage('tutors'); }} />}
        {currentPage === 'explore' && <TutorListingPage hobby={null} onBookClick={handleBooking} />}
        {currentPage === 'tutors' && <TutorListingPage hobby={selectedHobby} onBookClick={handleBooking} />}
        {currentPage === 'spaces' && <SpacesPage onListSpace={() => setShowListSpace(true)} onRentSpace={(s) => setSelectedSpace(s)} />}
        {currentPage === 'mentor-enroll' && <MentorEnrollPage onApply={() => setShowMentorEnroll(true)} />}
      </main>

      <AnimatePresence>
        {showAuth && (
          <AuthModal 
            onLogin={(name, role) => { 
              setUser({ name, role }); 
              setShowAuth(false);
            }} 
            onClose={() => setShowAuth(false)} 
          />
        )}
        {selectedTutor && user && (
          <BookingModal tutor={selectedTutor} onConfirm={handleConfirmSlot} onClose={() => setSelectedTutor(null)} />
        )}
        {showListSpace && (
          <ListSpaceModal onClose={() => setShowListSpace(false)} onComplete={handleSpaceComplete} />
        )}
        {selectedSpace && (
          <RentSpaceModal space={selectedSpace} onConfirm={handleRentConfirm} onClose={() => setSelectedSpace(null)} />
        )}
        {showMentorEnroll && (
          <MentorApplyModal onClose={() => setShowMentorEnroll(false)} onComplete={handleMentorComplete} />
        )}
        {success && (
          <SuccessModal 
            title={success.title} 
            message={success.message} 
            details={success.details} 
            onClose={() => setSuccess(null)} 
          />
        )}
      </AnimatePresence>

      <footer className="bg-ink text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-3xl font-display font-bold">Hobby Matchmaker</div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-zinc-400">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Careers</span>
          </div>
          <div className="text-xs text-zinc-500">© 2026 India. Crafted with love.</div>
        </div>
      </footer>
    </div>
  );
}
