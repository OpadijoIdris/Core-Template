"use client";

import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";
import { User } from "../../../types/user";
import { 
  FiSearch, 
  FiFilter, 
  FiUsers, 
  FiTrash2, 
  FiEye, 
  FiShield, 
  FiCheckCircle, 
  FiXCircle,
  FiMail,
  FiClock,
  FiX,
  FiMoreVertical,
  FiRefreshCw
} from "react-icons/fi";
import Image from "next/image";
import clsx from "clsx";

const UserModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="relative h-32 bg-linear-to-r from-blue-600 to-indigo-700">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition-all"
                    >
                        <FiX size={20} />
                    </button>
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl">
                            <div className="w-full h-full rounded-[1.2rem] bg-blue-100 flex items-center justify-center text-3xl font-black text-blue-600 overflow-hidden relative">
                                {user.avatarUrl ? (
                                    <Image src={user.avatarUrl} alt="avatar" fill className="object-cover" />
                                ) : user.email[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 p-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">{user.firstName} {user.lastName}</h2>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <FiMail className="text-blue-500" /> {user.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Role</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <FiShield className="text-blue-600" /> {user.role}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                {user.isVerified ? (
                                    <span className="text-green-600 flex items-center gap-1.5"><FiCheckCircle /> Verified</span>
                                ) : (
                                    <span className="text-red-500 flex items-center gap-1.5"><FiXCircle /> Unverified</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Activity Log</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FiClock className="text-gray-400" />
                                <span>Account created on <strong>{new Date(user.createdAt).toLocaleDateString()}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FiActivity className="text-gray-400" />
                                <span>Last modified <strong>{new Date(user.updatedAt).toLocaleDateString()}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex gap-3">
                        <button className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            Manage Permissions
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple FiActivity component since it might not be imported
const FiActivity = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const UsersPage = () => {
    const { users, loading, error, deleteUser, refresh } = useUsers();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchParams] = useState("");

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.firstName && u.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.lastName && u.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 font-bold mt-1">Control access and monitor system inhabitants.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => refresh()}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 shadow-sm"
                    >
                        <FiRefreshCw />
                    </button>
                    <div className="relative group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search accounts..." 
                            value={searchQuery}
                            onChange={(e) => setSearchParams(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all w-full md:w-80 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-5">Profile</th>
                                <th className="px-8 py-5">Access Level</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Onboarding</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                                        <FiUsers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-bold uppercase tracking-widest text-xs">No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs relative overflow-hidden">
                                                    {user.avatarUrl ? (
                                                        <Image src={user.avatarUrl} alt="u" fill className="object-cover" />
                                                    ) : user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 leading-none">
                                                        {user.firstName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-medium mt-1">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                                user.role === 'SUPER_ADMIN' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                user.role === 'ADMIN' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                "bg-gray-50 text-gray-500 border-gray-100"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={clsx(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    user.isVerified ? "bg-green-500" : "bg-red-400"
                                                )}></div>
                                                <span className={clsx(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    user.isVerified ? "text-green-600" : "text-red-400"
                                                )}>
                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-bold text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                            </div>
                                            <div className="group-hover:hidden text-gray-300">
                                                <FiMoreVertical className="ml-auto" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
};

export default UsersPage;
