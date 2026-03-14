"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { changePassword } from '../../../services/authApi';
import { updateUserProfile, uploadUserAvatar } from '../../../services/userApi';
import { 
  FiUser, 
  FiLock, 
  FiCamera, 
  FiCheckCircle, 
  FiAlertCircle,
  FiLoader,
  FiArrowRight
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Image from 'next/image';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUserProfile(profileData);
      if (response.success) {
        setUser(prev => prev ? { ...prev, ...response.user } : null);
        toast.success('Profile information updated successfully');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    
    setLoading(true);
    try {
      const response = await changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      if (response.success) {
        toast.success('Password updated successfully');
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const response = await uploadUserAvatar(file);
      if (response.success) {
        setUser(prev => prev ? { ...prev, avatarUrl: response.avatarUrl } : null);
        toast.success('Profile picture updated');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your profile information and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FiUser className="text-lg" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'security' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FiLock className="text-lg" />
            Security & Password
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {activeTab === 'profile' ? (
              <div className="p-8">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner relative bg-gray-100">
                      {user?.avatarUrl ? (
                        <Image 
                          src={user.avatarUrl} 
                          alt="Avatar" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-300">
                          {user?.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                      <FiCamera className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Picture</h3>
                    <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 ml-1 flex items-center gap-1">
                      <FiAlertCircle /> Email cannot be changed for security reasons.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900">Security Credentials</h3>
                  <p className="text-sm text-gray-500 mt-1">Keep your account secure by using a strong password.</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                      <strong>Password Requirements:</strong>
                      <br />• Minimum 8 characters
                      <br />• At least one uppercase letter
                      <br />• At least one number or special character
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <FiLoader className="animate-spin" /> : <FiLock />}
                      Update Account Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-red-700">Danger Zone</h4>
              <p className="text-xs text-red-600 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
