import { useRef, useEffect, useState } from 'react';
import './App.css';
import testAudio from './testAudio.mp3';

function App() {
  const iframeRef = useRef(null);
  const [iframeUrl, setIframeUrl] = useState('https://share.streampixel.io/share-011825c0-5f03-44e5-82e6-9fb9381fa064');
  const [urlSubmitted, setUrlSubmitted] = useState(false);
  const audioRef = useRef(null);


  useEffect(() => {
    const audio = audioRef.current;
    audio.play().then(() => {
      audio.muted = false; 
    }).catch(error => {
      console.log('Autoplay failed:', error);
    });
  }, []);


  // Function to handle sending a message to the iframe
  const handleSendCommand = () => {
    const message = { message: 'test' };
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };


  useEffect(() => {
    const iframe = iframeRef.current;
    
    const playAudio = () => {
      iframe.contentWindow.document.querySelector('audio').play().catch((error) => {
        console.log('Autoplay failed:', error);
      });
    };

    
    iframe.addEventListener('load', () => {
      setTimeout(playAudio, 1000); 
    });
  }, []);

  const handleTerminateSession = () => {
    const message = "terminateSession";
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
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
      {!urlSubmitted ? (
        <>
          <iframe
            style={{ width: '100vw', height: '90vh' }}
            ref={iframeRef}
            src={iframeUrl}
            
             allow="autoplay; microphone; camera"
            title="Iframe"
          />

          <audio ref={audioRef} src='testAudio'/>
          <button onClick={handleSendCommand}>Send Message</button>

          <button onClick={handleTerminateSession}>Disconnect</button>
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
