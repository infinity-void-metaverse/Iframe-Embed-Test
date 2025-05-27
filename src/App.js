import { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const iframeRef = useRef(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [urlSubmitted, setUrlSubmitted] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const postToIframe = (payload) => {
    if (iframeRef.current) {
      window.focus(iframeRef.current);
      iframeRef.current.contentWindow.postMessage(payload, '*');
      setTimeout(() => {
        iframeRef.current?.focus();
      }, 100);
    }
  };

  const handleSendCommand480 = () => {
    postToIframe({ message: { value: '480p (854x480)', type: 'setResolution' } });
  };

  const handleSendCommand720 = () => {
    postToIframe({ message: { value: '720p (1280x720)', type: 'setResolution' } });
  };

  const handleMute = () => {
    postToIframe({ message: 'muteAudio' });
  };

  const handleUnMute = () => {
    postToIframe({ message: 'unMuteAudio' });
  };

  const handleTerminateSession = () => {
    postToIframe({ message: 'terminateSession' });
  };

  const handleSendCustom = () => {
    if (customMessage.trim()) {
      postToIframe({ message: customMessage.trim() });
      setCustomMessage('');
    }
  };

  useEffect(() => {
    const heartbeat = { message: 'heartbeat' };
    const intervalId = setInterval(() => {
      postToIframe(heartbeat);
    }, 600000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const start = () => postToIframe({ message: 'startApp' });
    const startTimeout = setTimeout(start, 5000);

    const handleMessage = (event) => {
      console.log(event.data);
      if (event.data === 'loadingComplete') {
        alert('LOADING COMPLETE');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      clearTimeout(startTimeout);
      window.removeEventListener('message', handleMessage);
    };
  }, [urlSubmitted]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (iframeUrl.trim()) {
      setUrlSubmitted(true);
    }
  };

  return (
    <div>
      {urlSubmitted ? (
        <>
          <iframe
            style={{ width: '100vw', height: '90vh' }}
            ref={iframeRef}
            src={iframeUrl}
            allow="microphone; camera"
            title="Iframe"
            tabIndex={0}
          />

          <button onClick={handleSendCommand480}>Set 480p</button>
          <button onClick={handleSendCommand720}>Set 720p</button>
          <button onClick={handleMute}>Mute</button>
          <button onClick={handleUnMute}>UnMute</button>
          <button onClick={handleTerminateSession}>Disconnect</button>

          {/* New custom message input and button */}
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter message"
          />
          <button onClick={handleSendCustom}>Send Message</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={iframeUrl}
            onChange={(e) => setIframeUrl(e.target.value)}
            placeholder="Iframe URL"
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
