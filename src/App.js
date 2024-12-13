import { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const iframeRef = useRef(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [urlSubmitted, setUrlSubmitted] = useState(false);

  const handleSendCommand480 = () => {
    const message = { message: '480p (854x480)' };
  
    if (iframeRef.current) {
      window.focus(iframeRef.current);
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  
    setTimeout(() => {
      iframeRef.current?.focus();
    }, 100); 
  };


  const handleSendCommand720 = () => {
    const message = { message: '720p (1280x720)' };

     if (iframeRef.current) {
      window.focus(iframeRef.current);
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  
    setTimeout(() => {
      iframeRef.current?.focus();
    }, 100); 
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
    const message = { message: 'AFKClick' };
    setInterval(() => {

      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(message, '*');
      }
    }, 600000); 

  }, []); 


  useEffect(() => {

    setTimeout(()=>{
      const message = { message: 'startApp' };
      if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
      }
    },5000)
      



    const handleMessage = (event) => {

      console.log(event.data);

    if (event.data == "loadingComplete"){
      alert("LOADING COMPLETE")

     

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
            tabindex="0"
          />
          <button onClick={handleSendCommand480}>Set 480p</button>

          <button onClick={handleSendCommand720}>Set 720p</button>


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
