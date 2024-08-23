import { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const iframeRef = useRef(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [urlSubmitted, setUrlSubmitted] = useState(false);

  // Function to handle sending a message to the iframe
  const handleSendCommand = () => {
    const message = { message: 'test' };
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  // Event listener for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      console.log(event.data);
    };

    window.addEventListener('message', handleMessage);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (iframeUrl.trim()) {
      setUrlSubmitted(true); 
    }
  };

  return (
    <div className="app-container">
      {urlSubmitted ? (
        <div className="iframe-container">
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            title="Iframe"
            className="full-iframe"
          />
          <button className="send-command-button" onClick={handleSendCommand}>
            Send Command
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="text"
            value={iframeUrl}
            onChange={(e) => setIframeUrl(e.target.value)}
            placeholder="Iframe URL"
            className="url-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
