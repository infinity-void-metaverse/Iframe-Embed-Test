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

 
  const handleMute = () => {
    const message = { message: 'muteAudio' };

    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  const handleUnMute = () => {
    const message = { message: 'unMuteAudio' };
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  }; 

  const handleTerminateSession = () => {
    const message = { message: 'terminateSession' };
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  useEffect(() => {


   
    setTimeout(()=>{
      const message = { message: 'startApp' };
      if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
      }
    },5000)
      



    const handleMessage = (event) => {

    if (event.data == "loadingComplete"){
      alert("LOADING COMPLETE")

      const message = { message: 'cropVideo' };
      iframeRef.current.contentWindow.postMessage(message, '*');

    }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [ iframeRef.current,urlSubmitted]);

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
          />
          <button onClick={handleSendCommand}>Send Message</button>

          <button onClick={handleMute}>Mute</button>
          <button onClick={handleUnMute}>UnMute</button>

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
