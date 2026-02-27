import React, { useState, useEffect } from 'react';
import {
    Users, Search, Edit2, Trash2, X, Save,
    ShieldCheck, Activity, MapPin, Phone, Mail, Calendar
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MentorsList = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState(null);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const res = await api.get('/academic-head/mentors-all');
            if (res.data.success) {
                setMentors(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to load mentor directory");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (mentor) => {
        setEditingMentor({ ...mentor });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const res = await api.put(`/academic-head/mentors/${editingMentor.id}`, editingMentor);
            if (res.data.success) {
                toast.success("Mentor profile updated");
                setIsEditModalOpen(false);
                fetchMentors();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("PERMANENT ACTION: Purge this mentor and unassign their students?")) return;
        try {
            const res = await api.delete(`/academic-head/mentors/${id}`);
            if (res.data.success) {
                toast.success("Mentor profile deleted");
                fetchMentors();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    const filteredMentors = mentors.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.place?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">SYNCING MENTOR DIRECTORY...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Mentor Faculty</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Users size={14} className="text-indigo-500" />
                        Academic Head level management of all mentor profiles and assignments
                    </p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="FILTER BY NAME OR LOCATION..."
                        className="pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] focus:ring-4 ring-indigo-500/10 w-full md:w-96 shadow-sm transition-all outline-none focus:bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMentors.length > 0 ? filteredMentors.map((mentor) => (
                    <div key={mentor.id} className="bg-white group rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                    {mentor.name.charAt(0)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(mentor)}
                                        className="p-3 bg-slate-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mentor.id)}
                                        className="p-3 bg-slate-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic">{mentor.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mentor.place || 'Unknown Location'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                            <Mail size={14} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 break-all">{mentor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                            <Phone size={14} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600">{mentor.phone_number}</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Students</span>
                                        <span className="text-lg font-black text-indigo-600">{mentor.studentCount}</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${mentor.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                        {mentor.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">No mentors found matching your search</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingMentor && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-black text-slate-900 flex items-center gap-3 italic">
                                <Edit2 size={20} className="text-indigo-600" /> Edit Mentor Profile
                            </h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-slate-600 hover:shadow-md transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editingMentor.name}
                                    onChange={(e) => setEditingMentor(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={editingMentor.email}
                                    onChange={(e) => setEditingMentor(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={editingMentor.phone_number}
                                        onChange={(e) => setEditingMentor(prev => ({ ...prev, phone_number: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Place / Location</label>
                                    <input
                                        type="text"
                                        value={editingMentor.place || ''}
                                        onChange={(e) => setEditingMentor(prev => ({ ...prev, place: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Save size={16} /> Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorsList;
