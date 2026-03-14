"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import { changePassword } from '../../../services/authApi';
import { updateUserProfile, uploadUserAvatar } from '../../../services/userApi';

const SettingsPage = () => {
  const { user, logout, setUser } = useAuth();

  // State for Change Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // State for Profile Update form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // State for Avatar Upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      console.log('User data:', user);
      console.log('Avatar URL:', user.avatarUrl);
    }
  }, [user]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'An error occurred.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    try {
      const updatedUser = await updateUserProfile({ firstName, lastName });
      setUser(prevUser => (prevUser ? { ...prevUser, ...updatedUser.user } : null)); // Assuming API returns { user: {...} }
      setProfileSuccess('Profile updated successfully.');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'An error occurred while updating profile.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    } else {
      setAvatarFile(null);
    }
  };

  const handleUploadAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvatarError('');
    setAvatarSuccess('');
    if (!avatarFile) {
      setAvatarError('Please select a file to upload.');
      return;
    }

    try {
      const response = await uploadUserAvatar(avatarFile);
      // Backend returns { id, avatarUrl }
      const newAvatarUrl = response.avatarUrl || response.data?.avatarUrl;
      setUser(prevUser => (prevUser ? { ...prevUser, avatarUrl: newAvatarUrl } : null));
      setAvatarSuccess('Avatar uploaded successfully.');
      setAvatarFile(null); // Clear the selected file
    } catch (err: any) {
      setAvatarError(err.response?.data?.message || 'An error occurred during avatar upload.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile Avatar Upload */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Profile Avatar</h2>
        {avatarError && <p className="text-red-500 mb-2">{avatarError}</p>}
        {avatarSuccess && <p className="text-green-500 mb-2">{avatarSuccess}</p>}
        <div className="mb-4">
          <div className="flex items-center mb-4">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="User Avatar"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl mr-4">
                {user?.firstName ? user.firstName[0] : 'U'}
              </div>
            )}
            <form onSubmit={handleUploadAvatar}>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <button
                type="submit"
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                disabled={!avatarFile}
              >
                Upload Avatar
              </button>
            </form>
          </div>
          {user?.avatarUrl && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm font-medium text-gray-700 mb-1">Avatar URL:</p>
              <p className="text-xs text-gray-600 break-all">{user.avatarUrl}</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Profile Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Update Profile Information</h2>
        <p className="text-lg font-semibold mb-4 text-red-300">Please enter both the first name together</p>
        {profileError && <p className="text-red-500 mb-2">{profileError}</p>}
        {profileSuccess && <p className="text-green-500 mb-2">{profileSuccess}</p>}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
        {passwordSuccess && <p className="text-green-500 mb-2">{passwordSuccess}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded text-black bg-white"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Change Password
          </button>
        </form>
      </div>

      {/* Logout */}
      <div>
        <h2 className="text-xl font-bold mb-4">Logout</h2>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
