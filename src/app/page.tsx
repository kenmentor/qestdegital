'use client';

import { useState, useEffect } from 'react';
import { Globe2, Users, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'english-room', name: 'English', flag: '🇬🇧' },
  { code: 'french-room', name: 'French', flag: '🇫🇷' },
  { code: 'german-room', name: 'German', flag: '🇩🇪' },
];

interface RoomInfo {
  [key: string]: number;
}

export default function Home() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastRoom');
    }
    return null;
  });
  const [roomCounts, setRoomCounts] = useState<RoomInfo>({ 'english-room': 0, 'french-room': 0, 'german-room': 0 });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (selectedLang) {
      localStorage.setItem('lastRoom', selectedLang);
    }
  }, [selectedLang]);

  useEffect(() => {
    const fetchRoomCounts = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          setRoomCounts(data.counts || { 'english-room': 0, 'french-room': 0, 'german-room': 0 });
        }
      } catch {
        console.log('Could not fetch room counts');
      }
      setLoading(false);
    };

    fetchRoomCounts();
    const interval = setInterval(fetchRoomCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = () => {
    if (selectedLang) {
      setConnecting(true);
      router.push(`/meeting/${selectedLang}`);
    }
  };
  console.log("hello world for debuging ")

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl mb-4">
            <Globe2 className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">LiveTranslate</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time voice translation</p>
        </div>

        {/* Language Options */}
        <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all duration-200 ${
                selectedLang === lang.code 
                  ? 'bg-white text-black' 
                  : 'bg-[#1a1a1a] text-white hover:bg-[#252525]'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl">{lang.flag}</span>
                <span className="font-medium text-base sm:text-lg">{lang.name}</span>
              </span>
              <span className="flex items-center gap-1.5">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span className={`text-sm ${selectedLang === lang.code ? 'text-black/70' : 'text-gray-400'}`}>
                      {roomCounts[lang.code as keyof RoomInfo] || 0}
                    </span>
                  </>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoin}
          disabled={!selectedLang || connecting}
          className={`w-full py-3.5 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-all duration-200 ${
            selectedLang 
              ? 'bg-white text-black hover:bg-gray-200 active:scale-[0.98] shadow-lg shadow-white/10' 
              : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
          }`}
        >
          {connecting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Joining...
            </span>
          ) : (
            'Join Room'
          )}
        </button>

        <p className="text-gray-600 text-center text-xs sm:text-sm mt-5 sm:mt-6">
          Listen to translated audio in real-time
        </p>
      </div>
    </div>
  );
}