import { useState } from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';

const PHONE_NUMBER = process.env.REACT_APP_PHONE_NUMBER || '0123456789';
const ZALO_PHONE = process.env.REACT_APP_ZALO_PHONE || '0123456789';

export function FloatingContact() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleZaloClick = () => {
    window.open(`https://zalo.me/${ZALO_PHONE}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <>
      {/* Backdrop - only when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Always bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Expanded buttons */}
        {isExpanded && (
          <div className="flex flex-col gap-3 animate-fadeIn relative z-10" onClick={(e) => e.stopPropagation()}>
            {/* Zalo Button */}
            <button
              onClick={handleZaloClick}
              className="flex items-center gap-2 bg-blue-500 text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-105"
              title="Chat on Zalo"
            >
              <svg
                viewBox="0 0 48 48"
                className="w-6 h-6 fill-current"
              >
                <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-5.5 26.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5zm11 0c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5zm5.5-9H13v-2h22v2z"/>
              </svg>
              <span className="font-medium">Zalo</span>
            </button>

            {/* Phone Call Button */}
            <button
              onClick={handlePhoneClick}
              className="flex items-center gap-2 bg-green-500 text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105"
              title="Call us"
            >
              <Phone size={24} />
              <span className="font-medium">{PHONE_NUMBER}</span>
            </button>
          </div>
        )}

        {/* Main Toggle Button */}
        <div className="relative">
          {/* Pulse ring - only when not expanded */}
          {!isExpanded && (
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
              isExpanded
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title={isExpanded ? 'Close' : 'Contact us'}
          >
            {isExpanded ? (
              <X size={28} className="text-white" />
            ) : (
              <MessageCircle size={28} className="text-white" />
            )}
          </button>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}
