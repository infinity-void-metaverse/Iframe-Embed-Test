import { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const iframeRef = useRef(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [urlSubmitted, setUrlSubmitted] = useState(false);

  // Function to handle sending a message to the iframe
  const handleSendCommand = () => {
    const message = { text: 'test' };
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
            title="Iframe"
          />
          <button onClick={handleSendCommand}>Send Message</button>
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
