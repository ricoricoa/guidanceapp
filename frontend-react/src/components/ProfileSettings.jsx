import React, { useState, useRef } from 'react';
import { Edit2, Save, X, Upload, Camera, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

export const ProfileSettings = ({ user, onUpdate, loading: saving = false, message, messageType, onMessageClear }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    year: user?.year ?? '',
    bio: user?.bio ?? '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile_picture_path ? `/storage/${user.profile_picture_path}` : null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('bio', formData.bio);

      if (profilePicture) {
        formDataToSend.append('profile_picture', profilePicture);
      }

      const res = await api.put('/api/v1/user/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = res.data.user ?? res.data.data?.user;
      onUpdate(updatedUser);
      setIsEditing(false);
      setProfilePicture(null);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ submit: ['Failed to save profile'] });
      }
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      {/* Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="text-sm font-medium">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${
            messageType === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}
        >
          <span>{message}</span>
          <button
            onClick={onMessageClear}
            className="text-current opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {!isEditing ? (
          // View Mode
          <div>
            {/* Profile Header */}
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                {/* Profile Picture */}
                <div className="relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-4 border-indigo-600">
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {getInitials(formData.name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{formData.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Profile Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 md:border-b-0 md:pb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Full Name</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{formData.name}</p>
                </div>

                {/* Email */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 md:border-b-0 md:pb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Email Address</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1 break-all">{formData.email}</p>
                </div>

                {/* Phone */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 md:border-b-0 md:pb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Phone Number</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{formData.phone || 'Not provided'}</p>
                </div>

                {/* Year/Grade */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 md:border-b-0 md:pb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Year/Grade</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{formData.year || 'Not provided'}</p>
                </div>

                {/* Address */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 md:col-span-2 md:border-b-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Address</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{formData.address || 'Not provided'}</p>
                </div>
              </div>

              {/* Bio */}
              {formData.bio && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">About</p>
                  <p className="text-gray-900 dark:text-gray-300 mt-2 whitespace-pre-wrap">{formData.bio}</p>
                </div>
              )}
            </div>

            {/* Edit Button */}
            <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-lg">
                {errors.submit[0]}
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</label>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium mb-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </button>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Max size: 2MB (JPG, PNG, GIF)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +63 9xx xxx xxxx"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone[0]}</p>}
              </div>

              {/* Year/Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Year/Grade
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 3rd Year, Grade 12"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year[0]}</p>}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Your street address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address[0]}</p>}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  About Me
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Max 1000 characters</p>
                {errors.bio && <p className="text-red-600 text-sm mt-1">{errors.bio[0]}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name ?? '',
                    email: user?.email ?? '',
                    phone: user?.phone ?? '',
                    address: user?.address ?? '',
                    year: user?.year ?? '',
                    bio: user?.bio ?? '',
                  });
                  setProfilePicture(null);
                  setErrors({});
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
