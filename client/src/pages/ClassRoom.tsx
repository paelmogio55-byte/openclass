import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const meetingTab = useRef<Window | null>(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`${API}/classes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = res.data.find((c: any) => c.id === parseInt(id!));
        if (!found) throw new Error('Class not found');
        setClassData(found);
      } catch (err: any) {
        setError(err.message || 'Failed to load class details');
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id, API, token]);

  // ✅ AUTO-CLOSE TAB BEFORE ADS LOAD
  useEffect(() => {
    const checkClose = setInterval(() => {
      if (meetingTab.current && !meetingTab.current.closed) {
        try {
          const url = meetingTab.current.location.href;
          if (url.includes('/close') || url.includes('static/close') || url.includes('build-video') || url.includes('thank-you')) {
            meetingTab.current.close();
          }
        } catch { /* cross-origin safe */ }
      }
    }, 300);
    return () => clearInterval(checkClose);
  }, []);

  const openRoom = () => {
    const roomId = `Class-${classData.id}-${classData.class_code}`;
    const userName = encodeURIComponent(user.name || 'Teacher');

    // ✅ OFFICIAL SERVER — 100% works in PH
    const finalUrl = `https://meet.jit.si/${roomId}#
      userInfo.name=${userName}
      &interfaceConfig.SHOW_JITSI_WATERMARK=false
      &interfaceConfig.SHOW_POWERED_BY=false
      &interfaceConfig.HIDE_BRANDING=true
      &interfaceConfig.DISABLE_WELCOME_PAGE=true
      &interfaceConfig.ENABLE_LOGIN_BUTTON=false
      &interfaceConfig.HIDE_INVITE_MORE_HEADER=true
      &config.prejoinPageEnabled=false
      &config.enableWelcomePage=false
      &config.requireDisplayName=false
      &config.enableClosePage=false
      &config.disableDeepLinking=true
      &config.disableThirdPartyRequests=true
    `.replace(/\s+/g, '');

    meetingTab.current = window.open(finalUrl, '_blank', 'width=1280,height=720,noopener,noreferrer');
  };

  if (loading) return <div className="p-6 text-center">Loading class room...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{classData.name}</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">{classData.name}</h2>
        <p className="text-gray-600 mb-8">Description: {classData.description || 'No description'}</p>

        <button
          onClick={openRoom}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg text-lg font-medium shadow-lg"
        >
          🎥 Open Class Room
        </button>

        <p className="mt-6 text-sm text-gray-600">
        </p>
      </div>
    </div>
  );
};

export default ClassRoom;