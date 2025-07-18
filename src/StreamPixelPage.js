import React, { useEffect, useRef, useState } from 'react';
import './StreamPixelPage.css';

const StreamPixelPage = () => {
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [queueMessage, setQueueMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [useFallbackImage, setUseFallbackImage] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data || typeof event.data.value !== 'string') return;

      const value = event.data.value;

      if (value === 'showPassword') {
        setShowPasswordForm(true);
      } else if (value === 'hidePassword') {
        setShowPasswordForm(false);
        setLoadingVisible(true);
      } else if (value === 'authenticating') {
        setLoadingMessage('Authenticating...');
        setQueueMessage('');
      } else if (value === 'connecting') {
        setLoadingMessage('Connecting to the stream...');
        setQueueMessage('');
      } else if (value === 'Almost there, hold tight- awesomeness loading') {
        setLoadingMessage('Almost there, awesomeness is loading...');
        setQueueMessage('');
      } else if (value === 'finalising') {
        setLoadingMessage('Finalising connection...');
        setQueueMessage('');
      } else if (value.includes('queue')) {
        setLoadingMessage('');
        setQueueMessage(value);
      } else if (value === 'loadingComplete') {
        setLoadingMessage('');
        setQueueMessage('');
        setLoadingVisible(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault(); 
  
    const message = { message: "TEST" };
    console.log(message);
  
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };


  return (
    <div className="fullscreen-page">
      <div id="logo">
        <img
          src="https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"
          alt="StreamPixel Logo"
          width="100%"
        />
      </div>

      {loadingVisible && (
        <div id="loadingScreen">
          {!useFallbackImage ? (
            <video
              id="loadingVideo"
              autoPlay
              muted
              playsInline
              ref={videoRef}
              onError={() => setUseFallbackImage(true)}
            >
              <source
                src="https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              id="loadingImage"
              src="https://images.pexels.com/videos/28713349/pexels-photo-28713349.jpeg"
              alt="Loading..."
            />
          )}

          {loadingMessage && (
            <div id="loadingState">{loadingMessage}</div>
          )}

          {queueMessage && (
            <div id="queueStatus">{queueMessage}</div>
          )}

          {showPasswordForm && (
            <div id="passwordScreen">
              <form id="passwordForm" onSubmit={handlePasswordSubmit}>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </div>
      )}

<iframe
            style={{ width: '100vw', height: '90vh' }}
            id="streamPixelIframe"
            ref={iframeRef}
            src="http://localhost:3000/67cc3f1d5b4e247cfd8f45b4"
            allow="microphone; camera"
            title="Iframe"
            tabindex="0"
          />


    </div>
  );
};

export default StreamPixelPage;
