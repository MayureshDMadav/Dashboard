import React from 'react';

const loaderStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
};

const dotsContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
};

const dotStyles = {
  width: '15px',
  height: '15px',
  margin: '0 10px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  animation: 'bounce 0.5s ease-in-out infinite',
};

const messageStyles = {
  marginTop: '20px',
  color: '#ffffff',
  fontSize: '12px',
};

const keyframes = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
`;

export default function Loading({ message = 'Loading...' }) {
  return (
    <div style={loaderStyles}>
      <style>{keyframes}</style>
      <div style={dotsContainerStyles}>
        <div style={{...dotStyles, animationDelay: '0s'}}></div>
        <div style={{...dotStyles, animationDelay: '0.1s'}}></div>
        <div style={{...dotStyles, animationDelay: '0.2s'}}></div>
      </div>
      <p style={messageStyles}>{message}</p>
    </div>
  );
}