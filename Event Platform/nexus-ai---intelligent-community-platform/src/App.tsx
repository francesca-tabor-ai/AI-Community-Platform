/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  Users, 
  PlusCircle, 
  LayoutDashboard, 
  MessageSquare, 
  Sparkles, 
  MapPin, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Mail,
  FileText,
  User,
  LogOut,
  Bell,
  Filter,
  ArrowRight
} from 'lucide-react';
import { MOCK_EVENTS, MOCK_COMMUNITIES, EMAIL_SEQUENCES, LEAD_MAGNETS } from './constants';
import { Event, Community, UserRole } from './types';
import { geminiService } from './services/geminiService';

// --- Components ---

const Navbar = ({ activeView, setActiveView, user }: { activeView: string, setActiveView: (v: string) => void, user: any }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-black/5 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setActiveView('landing')}
      >
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">NEXUS AI</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => setActiveView('discovery')}
          className={`text-sm font-medium transition-colors ${activeView === 'discovery' ? 'text-black' : 'text-black/50 hover:text-black'}`}
        >
          Discover
        </button>
        <button 
          onClick={() => setActiveView('communities')}
          className={`text-sm font-medium transition-colors ${activeView === 'communities' ? 'text-black' : 'text-black/50 hover:text-black'}`}
        >
          Communities
        </button>
        <button 
          onClick={() => setActiveView('marketing')}
          className={`text-sm font-medium transition-colors ${activeView === 'marketing' ? 'text-black' : 'text-black/50 hover:text-black'}`}
        >
          Marketing Hub
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView('create-event')}
              className="hidden sm:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
            >
              <PlusCircle size={18} />
              <span>Create Event</span>
            </button>
            <button 
              onClick={() => setActiveView('dashboard')}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-black/5">
              <User size={20} className="text-indigo-600" />
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setActiveView('discovery')}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  </nav>
);

interface EventCardProps {
  key?: React.Key;
  event: Event;
  onClick: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="group cursor-pointer bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-all"
    onClick={onClick}
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
          {event.category}
        </span>
      </div>
      {event.price === 0 && (
        <div className="absolute top-4 right-4">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Free
          </span>
        </div>
      )}
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 text-black/50 text-xs mb-2">
        <Calendar size={14} />
        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span className="mx-1">•</span>
        <Clock size={14} />
        <span>{event.time}</span>
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
      <div className="flex items-center gap-2 text-black/50 text-xs mb-4">
        <MapPin size={14} />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center">
            <User size={12} />
          </div>
          <span className="text-xs font-medium">{event.organizerName}</span>
        </div>
        <div className="flex items-center gap-1 text-black/50 text-xs">
          <Users size={14} />
          <span>{event.attendees.length} attending</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Views ---

const LandingView = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="pt-24 pb-20">
    {/* Hero Section */}
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="grid lg:grid-template-columns-[1.2fr_1fr] gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-8">
            <Sparkles size={16} />
            <span>AI-Native Community Platform</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tight leading-[1.1] mb-8">
            Build communities that <span className="text-indigo-600">think.</span>
          </h1>
          <p className="text-xl text-black/60 leading-relaxed mb-10 max-w-xl">
            Nexus AI uses advanced intelligence to help you discover relevant events, connect with the right people, and organize successful communities.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onGetStarted}
              className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-black/80 transition-all flex items-center gap-2 group"
            >
              <span>Explore Events</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white border border-black/10 text-black px-8 py-4 rounded-full font-bold hover:bg-black/5 transition-all">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-black/5 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm text-black/50 font-medium">
              Trusted by <span className="text-black font-bold">2,000+</span> community builders worldwide
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square rounded-[40px] bg-gradient-to-tr from-indigo-500 to-purple-600 overflow-hidden shadow-2xl relative">
             <img 
               src="https://picsum.photos/seed/nexus/1000/1000" 
               className="w-full h-full object-cover mix-blend-overlay opacity-60" 
               alt="Nexus"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 flex items-center justify-center p-12">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full shadow-2xl">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                     <Sparkles className="text-indigo-600" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">Nexus AI Assistant</h3>
                     <p className="text-white/60 text-xs">Always active</p>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <div className="bg-white/10 rounded-2xl p-4 text-white/90 text-sm">
                     "I've found 3 networking events in London that match your interest in AI Design."
                   </div>
                   <div className="bg-indigo-600 rounded-2xl p-4 text-white text-sm font-medium shadow-lg">
                     "That sounds perfect! Can you add them to my calendar?"
                   </div>
                 </div>
               </div>
             </div>
          </div>
          
          {/* Floating Stats */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-black/50 font-bold uppercase tracking-wider">Growth</p>
                <p className="text-2xl font-bold">+124%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ICP Sections */}
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Built for every community role</h2>
        <p className="text-black/50 max-w-2xl mx-auto">Whether you're looking to learn, grow an audience, or build a movement, Nexus AI has the tools you need.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Community Members",
            desc: "Stop scrolling through noise. Get personalized event recommendations that actually matter to you.",
            icon: <Users className="text-indigo-600" />,
            color: "bg-indigo-50"
          },
          {
            title: "Event Organizers",
            desc: "Create high-converting event pages in seconds with AI assistance and predictive attendance insights.",
            icon: <Calendar className="text-purple-600" />,
            color: "bg-purple-50"
          },
          {
            title: "Community Builders",
            desc: "Manage recurring events, track member engagement, and grow your community with intelligent automation.",
            icon: <LayoutDashboard className="text-emerald-600" />,
            color: "bg-emerald-50"
          }
        ].map((icp, i) => (
          <div key={i} className="p-8 rounded-3xl border border-black/5 hover:border-black/10 transition-all group">
            <div className={`w-14 h-14 ${icp.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {icp.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{icp.title}</h3>
            <p className="text-black/60 leading-relaxed">{icp.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const DiscoveryView = ({ events, onEventClick }: { events: Event[], onEventClick: (e: Event) => void }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const filteredEvents = events.filter(e => 
    (category === 'All' || e.category === category) &&
    (e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-black/50">Find your next community experience</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="pl-12 pr-6 py-3 rounded-full bg-black/5 border-none focus:ring-2 focus:ring-black/10 w-full md:w-64 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-black/5 p-1 rounded-full">
            {['All', 'Design', 'Technology', 'Business'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      <div className="mb-12 p-8 rounded-3xl bg-indigo-600 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
              <Sparkles size={12} />
              <span>AI Recommended for you</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Based on your interest in AI Product Design...</h2>
            <p className="text-white/80 mb-6">We've found a workshop that perfectly aligns with your recent activity. Don't miss out!</p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-all">
              View Recommendation
            </button>
          </div>
          <div className="hidden lg:block w-64 h-64 bg-white/10 rounded-full blur-3xl absolute -right-20 -top-20" />
          <div className="hidden lg:block w-32 h-32 bg-purple-500/30 rounded-full blur-2xl absolute right-20 bottom-10" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-black/20" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No events found</h3>
          <p className="text-black/50">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

const EventDetailsView = ({ event, onBack }: { event: Event, onBack: () => void }) => {
  const [isRSVPed, setIsRSVPed] = useState(false);

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-black/50 hover:text-black transition-colors mb-8 group"
      >
        <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
        <span className="font-medium">Back to discovery</span>
      </button>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
        <div>
          <div className="aspect-video rounded-3xl overflow-hidden mb-8 shadow-lg border border-black/5">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} />
            <span>AI Summary Available</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">{event.title}</h1>
          
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                <Calendar className="text-black/60" size={20} />
              </div>
              <div>
                <p className="text-xs text-black/40 font-bold uppercase tracking-wider">Date</p>
                <p className="font-bold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                <Clock className="text-black/60" size={20} />
              </div>
              <div>
                <p className="text-xs text-black/40 font-bold uppercase tracking-wider">Time</p>
                <p className="font-bold">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                <MapPin className="text-black/60" size={20} />
              </div>
              <div>
                <p className="text-xs text-black/40 font-bold uppercase tracking-wider">Location</p>
                <p className="font-bold">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <h3 className="text-xl font-bold mb-4">About this event</h3>
            <p className="text-black/60 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>

          {event.aiSummary && (
            <div className="p-8 rounded-3xl bg-black text-white mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-400" size={20} />
                <h3 className="font-bold">AI Insights</h3>
              </div>
              <p className="text-white/70 leading-relaxed italic">"{event.aiSummary}"</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-3xl border border-black/5 bg-white shadow-xl sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <span className="text-black/50 font-medium">Ticket Price</span>
              <span className="text-3xl font-bold">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
            </div>
            
            <button 
              onClick={() => setIsRSVPed(!isRSVPed)}
              className={`w-full py-4 rounded-full font-bold transition-all mb-4 ${isRSVPed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-black text-white hover:bg-black/80'}`}
            >
              {isRSVPed ? 'You are going!' : 'RSVP Now'}
            </button>
            
            <p className="text-center text-xs text-black/40 font-medium">
              Join {event.attendees.length + (isRSVPed ? 1 : 0)} others attending this event
            </p>
            
            <div className="mt-8 pt-8 border-t border-black/5">
              <p className="text-xs text-black/40 font-bold uppercase tracking-wider mb-4">Organizer</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold">{event.organizerName}</h4>
                  <button className="text-xs text-indigo-600 font-bold hover:underline">View Profile</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 rounded-3xl border border-black/5 bg-black/5">
            <h3 className="font-bold mb-4">Attendees</h3>
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white border border-black/5 overflow-hidden">
                  <img src={`https://picsum.photos/seed/att${i}/100/100`} alt="attendee" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold text-black/40">
                +12
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateEventView = ({ onPublished }: { onPublished: () => void }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyPoints, setKeyPoints] = useState('');

  const handleGenerateDescription = async () => {
    if (!title) return;
    setIsGenerating(true);
    try {
      const points = keyPoints.split('\n').filter(p => p.trim());
      const desc = await geminiService.generateEventDescription(title, category, points);
      setDescription(desc || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Create an Event</h1>
        <p className="text-black/50">Let's build something amazing together</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Event Title</label>
          <input 
            type="text" 
            placeholder="e.g. AI Product Design Workshop" 
            className="w-full px-6 py-4 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Category</label>
            <select 
              className="w-full px-6 py-4 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Technology</option>
              <option>Design</option>
              <option>Business</option>
              <option>Social</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Price ($)</label>
            <input 
              type="number" 
              placeholder="0 for free" 
              className="w-full px-6 py-4 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-indigo-600" size={20} />
            <h3 className="font-bold text-indigo-900">AI Description Assistant</h3>
          </div>
          <p className="text-sm text-indigo-700/70">Enter some key points and let AI draft a compelling description for you.</p>
          
          <textarea 
            placeholder="Enter key points (one per line)..." 
            className="w-full h-32 px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
          />
          
          <button 
            onClick={handleGenerateDescription}
            disabled={isGenerating || !title}
            className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Draft with AI</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Description</label>
          <textarea 
            placeholder="Tell your audience about the event..." 
            className="w-full h-64 px-6 py-4 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-8">
          <button 
            onClick={onPublished}
            className="w-full py-5 rounded-full bg-black text-white font-bold text-lg hover:bg-black/80 transition-all shadow-xl"
          >
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketingHubView = () => (
  <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
    <div className="mb-16">
      <h1 className="text-4xl font-bold mb-2">Marketing Hub</h1>
      <p className="text-black/50">Tools to grow your community and engage your audience</p>
    </div>

    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="text-indigo-600" />
              <span>Email Sequences</span>
            </h2>
          </div>
          <div className="grid gap-6">
            {EMAIL_SEQUENCES.map(seq => (
              <div key={seq.id} className="p-8 rounded-3xl border border-black/5 bg-white hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{seq.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                    {seq.targetICP}
                  </span>
                </div>
                <div className="space-y-4">
                  {seq.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1">{step.subject}</p>
                        <p className="text-xs text-black/40 font-medium">{step.delay}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-8 text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2">
                  <span>View Full Sequence</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-purple-600" />
              <span>Lead Magnets</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {LEAD_MAGNETS.map(lm => (
              <div key={lm.id} className="p-8 rounded-3xl border border-black/5 bg-white hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{lm.title}</h3>
                <p className="text-sm text-black/50 mb-6 leading-relaxed">{lm.description}</p>
                <button className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-black/80 transition-all">
                  Edit Content
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-8">
        <div className="p-8 rounded-3xl bg-black text-white shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-indigo-400" size={24} />
            <h3 className="text-xl font-bold">AI Marketing Assistant</h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            "I've analyzed your community engagement. Your 'Organizer Onboarding' sequence has a 42% open rate. I suggest personalizing the day 2 subject line to increase conversions."
          </p>
          <button className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all">
            Apply AI Suggestions
          </button>
        </div>
        
        <div className="p-8 rounded-3xl border border-black/5 bg-white">
          <h3 className="font-bold mb-6">Engagement Metrics</h3>
          <div className="space-y-6">
            {[
              { label: 'Avg. Open Rate', value: '38.4%', trend: '+2.1%' },
              { label: 'Click Rate', value: '12.8%', trend: '+0.5%' },
              { label: 'Conversion', value: '4.2%', trend: '-0.2%' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-black/50 font-medium">{stat.label}</span>
                <div className="text-right">
                  <p className="font-bold">{stat.value}</p>
                  <p className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AIAssistantModal = ({ isOpen, onClose, context }: { isOpen: boolean, onClose: () => void, context: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hi! I\'m Nexus AI. How can I help you discover or build communities today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await geminiService.chatWithAssistant(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', content: response || 'I\'m sorry, I couldn\'t process that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to AI service.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[600px]"
      >
        <div className="p-6 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold">Nexus AI Assistant</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Always Online</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <LogOut size={20} className="rotate-90" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-black/5 text-black rounded-tl-none border border-black/5'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-black/5">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              className="flex-1 px-6 py-4 rounded-full bg-black/5 border-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const OrganizerDashboardView = ({ events }: { events: Event[] }) => (
  <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
        <p className="text-black/50">Manage your events and track performance</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-black/10 font-bold text-sm hover:bg-black/5 transition-all">
          <Bell size={18} />
          <span>Notifications</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-black/80 transition-all">
          <PlusCircle size={18} />
          <span>New Event</span>
        </button>
      </div>
    </div>

    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {[
        { label: 'Total RSVPs', value: '1,248', trend: '+12%', icon: <Users className="text-indigo-600" /> },
        { label: 'Total Revenue', value: '$4,820', trend: '+8%', icon: <TrendingUp className="text-emerald-600" /> },
        { label: 'Active Events', value: '3', trend: '0%', icon: <Calendar className="text-purple-600" /> },
        { label: 'Avg. Rating', value: '4.9', trend: '+0.2', icon: <Sparkles className="text-amber-500" /> }
      ].map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl bg-white border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              {stat.icon}
            </div>
            <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-black/30'}`}>
              {stat.trend}
            </span>
          </div>
          <p className="text-xs text-black/40 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Your Events</h2>
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="p-6 rounded-3xl bg-white border border-black/5 flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{event.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-black/40 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {event.attendees.length} RSVPs</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-full bg-black/5 text-xs font-bold hover:bg-black/10 transition-all">Edit</button>
                <button className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-black/80 transition-all">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="p-8 rounded-3xl bg-indigo-600 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={24} />
            <h3 className="text-xl font-bold">AI Growth Insights</h3>
          </div>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <p className="text-sm font-bold mb-2">Timing Suggestion</p>
              <p className="text-xs text-white/70 leading-relaxed">"Your 'AI Product Design' event is scheduled for a Monday. Historically, Wednesday evenings have 24% higher attendance for your category."</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <p className="text-sm font-bold mb-2">Pricing Insight</p>
              <p className="text-xs text-white/70 leading-relaxed">"Similar events are priced at $59. Increasing your price by $10 could increase perceived value without affecting RSVP rate."</p>
            </div>
          </div>
          <button className="w-full mt-8 py-4 rounded-full bg-white text-indigo-600 font-bold hover:bg-white/90 transition-all">
            Optimize Schedule
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [user, setUser] = useState<any>({
    id: 'user1',
    name: 'Alex Chen',
    role: UserRole.MEMBER,
    interests: ['AI', 'Design', 'Startups']
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setActiveView('event-details');
  };

  const renderView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView onGetStarted={() => setActiveView('discovery')} />;
      case 'discovery':
        return <DiscoveryView events={MOCK_EVENTS} onEventClick={handleEventClick} />;
      case 'event-details':
        return selectedEvent ? <EventDetailsView event={selectedEvent} onBack={() => setActiveView('discovery')} /> : null;
      case 'create-event':
        return <CreateEventView onPublished={() => setActiveView('discovery')} />;
      case 'marketing':
        return <MarketingHubView />;
      case 'dashboard':
        return <OrganizerDashboardView events={MOCK_EVENTS.filter(e => e.organizerId === 'org1')} />;
      case 'communities':
        return (
          <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-12">Communities</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_COMMUNITIES.map(comm => (
                <div key={comm.id} className="p-8 rounded-3xl border border-black/5 bg-white hover:shadow-md transition-all group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6">
                    <img src={comm.image} alt={comm.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{comm.name}</h3>
                  <p className="text-sm text-black/50 mb-6 leading-relaxed">{comm.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-wider">{comm.memberCount} Members</span>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">Join Guild</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <LandingView onGetStarted={() => setActiveView('discovery')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar activeView={activeView} setActiveView={setActiveView} user={user} />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Assistant Trigger */}
      <button 
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare size={28} />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
          <Sparkles size={12} />
        </div>
        <div className="absolute right-20 bg-white text-black px-4 py-2 rounded-2xl shadow-xl border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <p className="text-sm font-bold">How can I help you today?</p>
        </div>
      </button>

      <AIAssistantModal 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
        context={`Viewing ${activeView} page. User interests: ${user.interests.join(', ')}`} 
      />

      <footer className="bg-white border-t border-black/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">NEXUS AI</span>
              </div>
              <p className="text-black/50 max-w-sm leading-relaxed">
                The world's most intelligent community and event platform. Built for the next generation of creators and builders.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-black/50 font-medium">
                <li><button onClick={() => setActiveView('discovery')} className="hover:text-black transition-colors">Discover Events</button></li>
                <li><button onClick={() => setActiveView('communities')} className="hover:text-black transition-colors">Communities</button></li>
                <li><button className="hover:text-black transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-black/50 font-medium">
                <li><button onClick={() => setActiveView('marketing')} className="hover:text-black transition-colors">Marketing Hub</button></li>
                <li><button className="hover:text-black transition-colors">Help Center</button></li>
                <li><button className="hover:text-black transition-colors">API Docs</button></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-black/5 text-xs text-black/30 font-bold uppercase tracking-widest">
            <p>© 2026 NEXUS AI PLATFORM. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <button className="hover:text-black transition-colors">Privacy Policy</button>
              <button className="hover:text-black transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
