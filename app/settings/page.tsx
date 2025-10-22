'use client';

import { User, Shield, Globe } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: '#FBede0', fontSize: '36px' }}>
          Settings
        </h1>
        <p style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div
          className="p-6 rounded-3xl"
          style={{
            backgroundColor: '#1C1F2B',
            border: '1px solid rgba(80, 96, 108, 0.4)',
            boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FBede0' }}
            >
              <User className="w-5 h-5" style={{ color: '#161823' }} />
            </div>
            <h2 style={{ color: '#FBede0', fontSize: '20px' }}>Profile</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                Display Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#161823',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                  color: '#FBede0',
                }}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                Email
              </label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#161823',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                  color: '#FBede0',
                }}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div
          className="p-6 rounded-3xl"
          style={{
            backgroundColor: '#1C1F2B',
            border: '1px solid rgba(80, 96, 108, 0.4)',
            boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FBede0' }}
            >
              <Globe className="w-5 h-5" style={{ color: '#161823' }} />
            </div>
            <h2 style={{ color: '#FBede0', fontSize: '20px' }}>Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ color: '#FBede0' }}>Dark Mode</div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Use dark theme for the interface
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-all duration-200 flex items-center ${
                  darkMode ? 'justify-end' : 'justify-start'
                }`}
                style={{
                  backgroundColor: darkMode ? '#FBede0' : 'rgba(80, 96, 108, 0.4)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: darkMode ? '#161823' : '#FBede0',
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div style={{ color: '#FBede0' }}>Push Notifications</div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Receive notifications for agent responses
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all duration-200 flex items-center ${
                  notifications ? 'justify-end' : 'justify-start'
                }`}
                style={{
                  backgroundColor: notifications ? '#FBede0' : 'rgba(80, 96, 108, 0.4)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: notifications ? '#161823' : '#FBede0',
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div style={{ color: '#FBede0' }}>Email Updates</div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Get weekly summaries and updates
                </div>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`w-12 h-6 rounded-full transition-all duration-200 flex items-center ${
                  emailUpdates ? 'justify-end' : 'justify-start'
                }`}
                style={{
                  backgroundColor: emailUpdates ? '#FBede0' : 'rgba(80, 96, 108, 0.4)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: emailUpdates ? '#161823' : '#FBede0',
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div
          className="p-6 rounded-3xl"
          style={{
            backgroundColor: '#1C1F2B',
            border: '1px solid rgba(80, 96, 108, 0.4)',
            boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FBede0' }}
            >
              <Shield className="w-5 h-5" style={{ color: '#161823' }} />
            </div>
            <h2 style={{ color: '#FBede0', fontSize: '20px' }}>Security</h2>
          </div>

          <div className="space-y-4">
            <button
              className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #FBede0',
                color: '#FBede0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#50606C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Change Password
            </button>
            
            <button
              className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #FBede0',
                color: '#FBede0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#50606C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-8 py-4 rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: '#FBede0',
              color: '#161823',
              boxShadow: '0 0 16px rgba(251, 237, 224, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(251, 237, 224, 0.3)';
              e.currentTarget.style.backgroundColor = '#e8d4c5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(251, 237, 224, 0.25)';
              e.currentTarget.style.backgroundColor = '#FBede0';
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
