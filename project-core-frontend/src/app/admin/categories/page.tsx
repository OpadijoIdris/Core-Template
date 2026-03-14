"use client";

import React, { useState, useEffect } from 'react';
import { 
  createCategory, 
  createSubcategory, 
  getAllCategories,
  getAllSubcategories,
  updateCategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory
} from '@/services/categoryApi';
import withAuth from '@/components/auth/withAuth';
import { 
  FiPlus, 
  FiX, 
  FiEdit3, 
  FiTrash2, 
  FiLayers, 
  FiChevronDown, 
  FiChevronRight, 
  FiFolder, 
  FiGrid, 
  FiMoreVertical,
  FiRefreshCw,
  FiSearch,
  FiLoader,
  FiCheckCircle,
  FiTag
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import clsx from 'clsx';

interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Form states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'category' | 'subcategory'>('category');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState('');

    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (isPolling = false) => {
        try {
            if (!isPolling) setLoading(true);
            const [catRes, subRes] = await Promise.all([
                getAllCategories(),
                getAllSubcategories()
            ]);
            setCategories(catRes.data || []);
            setSubcategories(subRes.data || []);
        } catch (err) {
            toast.error("Telemetry failure: Could not sync taxonomy.");
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        const next = new Set(expandedCategories);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedCategories(next);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading('create');
        try {
            const res = await createCategory({ name: newCategoryName });
            if (res.success) {
                toast.success(`Category "${newCategoryName}" deployed.`);
                setNewCategoryName('');
                setIsCreateModalOpen(false);
                fetchData(true);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Deployment failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading('create-sub');
        try {
            const res = await createSubcategory({ 
                name: newSubcategoryName, 
                categoryId: selectedParentId 
            });
            if (res.success) {
                toast.success(`Sub-Category "${newSubcategoryName}" initialized.`);
                setNewSubcategoryName('');
                setSelectedParentId('');
                setIsCreateModalOpen(false);
                fetchData(true);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Sub-initialization failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdate = async (id: string, isSub: boolean) => {
        setActionLoading(id);
        try {
            const res = isSub 
                ? await updateSubcategory(id, { name: editValue })
                : await updateCategory(id, { name: editValue });
            
            if (res.success) {
                toast.success("Protocol updated.");
                setEditingId(null);
                fetchData(true);
            }
        } catch (err: any) {
            toast.error("Update sequence aborted.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string, isSub: boolean) => {
        if (!window.confirm("Confirm deletion of this taxonomy node?")) return;
        setActionLoading(id);
        try {
            const res = isSub ? await deleteSubcategory(id) : await deleteCategory(id);
            if (res.success) {
                toast.success("Node decommissioned.");
                fetchData(true);
            }
        } catch (err: any) {
            toast.error("Decommissioning failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Taxonomy Core...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-24">
            {/* Executive Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Hierarchy Engine</div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Catalog Structure Active</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Taxonomy <span className="text-blue-600 italic">Management</span></h1>
                    <p className="text-gray-500 font-bold mt-1">Configure your product classification and navigational hierarchy.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fetchData(true)}
                        className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
                    >
                        <FiPlus /> New Node
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center max-w-2xl">
                <div className="flex-1 relative group">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-3 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                    />
                </div>
            </div>

            {/* Main Tree Interface */}
            <div className="grid grid-cols-1 gap-6">
                {filteredCategories.map((cat) => {
                    const subs = subcategories.filter(s => s.categoryId === cat.id);
                    const isExpanded = expandedCategories.has(cat.id);
                    
                    return (
                        <div key={cat.id} className="group">
                            <div className={clsx(
                                "bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-300",
                                isExpanded ? "rounded-b-none border-b-transparent shadow-none" : "hover:shadow-lg"
                            )}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button 
                                            onClick={() => toggleExpand(cat.id)}
                                            className={clsx(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                isExpanded ? "bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-90" : "bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                                            )}
                                        >
                                            <FiChevronRight size={20} />
                                        </button>
                                        
                                        <div>
                                            {editingId === cat.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="px-4 py-2 bg-gray-50 border border-blue-200 rounded-xl outline-none text-sm font-bold w-64"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdate(cat.id, false)} className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
                                                        <FiCheckCircle />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-400 rounded-lg">
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
                                                        {cat.name}
                                                        <span className="text-[10px] font-black text-gray-300 tracking-widest">{cat.slug}</span>
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                            {subs.length} Sub-Categories
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            ID: {cat.id.slice(0,8)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}
                                            className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cat.id, false)}
                                            className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Nested Subcategories */}
                            {isExpanded && (
                                <div className="bg-gray-50/50 border-x border-b border-gray-100 rounded-b-[2rem] p-4 md:p-8 space-y-3 animate-in slide-in-from-top-4 duration-300">
                                    {subs.length === 0 ? (
                                        <div className="py-8 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Sub-Categories Linked</p>
                                        </div>
                                    ) : (
                                        subs.map(sub => (
                                            <div key={sub.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all group/sub">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center">
                                                        <FiTag />
                                                    </div>
                                                    {editingId === sub.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                className="px-4 py-2 bg-gray-50 border border-blue-200 rounded-xl outline-none text-sm font-bold w-48"
                                                                autoFocus
                                                            />
                                                            <button onClick={() => handleUpdate(sub.id, true)} className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
                                                                <FiCheckCircle />
                                                            </button>
                                                            <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-400 rounded-lg">
                                                                <FiX />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{sub.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub.slug}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => { setEditingId(sub.id); setEditValue(sub.name); }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <FiEdit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(sub.id, true)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <button 
                                        onClick={() => { setActiveTab('subcategory'); setSelectedParentId(cat.id); setIsCreateModalOpen(true); }}
                                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[1.5rem] flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all hover:bg-blue-50/30"
                                    >
                                        <FiPlus /> Append Sub-Category
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Creation Protocol Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">New Taxonomy Node</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Expanding System Catalog</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-3 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all">
                                <FiX />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex bg-gray-100 p-1.5 rounded-[1.2rem] mb-8">
                                <button 
                                    onClick={() => setActiveTab('category')}
                                    className={clsx(
                                        "flex-1 py-3 rounded-[1rem] text-xs font-black uppercase tracking-widest transition-all",
                                        activeTab === 'category' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Category
                                </button>
                                <button 
                                    onClick={() => setActiveTab('subcategory')}
                                    className={clsx(
                                        "flex-1 py-3 rounded-[1rem] text-xs font-black uppercase tracking-widest transition-all",
                                        activeTab === 'subcategory' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Sub-Category
                                </button>
                            </div>

                            {activeTab === 'category' ? (
                                <form onSubmit={handleCreateCategory} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Identity</label>
                                        <input 
                                            required
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="e.g. Premium Footwear"
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                    <button 
                                        disabled={actionLoading === 'create'}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {actionLoading === 'create' ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                                        Initialize Category
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleCreateSubcategory} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent Hierarchy</label>
                                        <select 
                                            required
                                            value={selectedParentId}
                                            onChange={(e) => setSelectedParentId(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold appearance-none"
                                        >
                                            <option value="">Select Root Node</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sub-Category Identity</label>
                                        <input 
                                            required
                                            value={newSubcategoryName}
                                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                                            placeholder="e.g. Leather Series"
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                    <button 
                                        disabled={actionLoading === 'create-sub'}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {actionLoading === 'create-sub' ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                                        Initialize Sub-Category
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(AdminCategoriesPage, ['ADMIN', 'SUPER_ADMIN', 'SUB_ADMIN']);
