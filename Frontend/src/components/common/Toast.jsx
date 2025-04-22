import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500 text-xl" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500 text-xl" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500 text-xl" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-xl" />;
    }
  };

  const getBgColor = () => {
    if (isDarkMode) {
      switch (type) {
        case 'success': return 'bg-green-900/30 border-green-700';
        case 'error': return 'bg-red-900/30 border-red-700';
        case 'info': return 'bg-blue-900/30 border-blue-700';
        case 'warning': return 'bg-yellow-900/30 border-yellow-700';
        default: return 'bg-blue-900/30 border-blue-700';
      }
    } else {
      switch (type) {
        case 'success': return 'bg-green-50 border-green-200';
        case 'error': return 'bg-red-50 border-red-200';
        case 'info': return 'bg-blue-50 border-blue-200';
        case 'warning': return 'bg-yellow-50 border-yellow-200';
        default: return 'bg-blue-50 border-blue-200';
      }
    }
  };

  const getTextColor = () => {
    if (isDarkMode) {
      switch (type) {
        case 'success': return 'text-green-300';
        case 'error': return 'text-red-300';
        case 'info': return 'text-blue-300';
        case 'warning': return 'text-yellow-300';
        default: return 'text-blue-300';
      }
    } else {
      switch (type) {
        case 'success': return 'text-green-800';
        case 'error': return 'text-red-800';
        case 'info': return 'text-blue-800';
        case 'warning': return 'text-yellow-800';
        default: return 'text-blue-800';
      }
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`flex items-center p-4 rounded-lg shadow-lg border ${getBgColor()} max-w-md ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <div className="mr-3">
          {getIcon()}
        </div>
        <div className={`flex-grow text-sm ${getTextColor()}`}>
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
          className={`ml-4 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Toast;
