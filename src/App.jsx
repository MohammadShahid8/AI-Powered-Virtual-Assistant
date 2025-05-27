import React, { useContext } from 'react'
import "./App.css"
import va from "./assets/Jarvis.gif"
import { IoMdMic } from "react-icons/io";
import { datacontext } from './context/UserContext';
import voice from "./assets/voice.gif"
import processSound from "./assets/processSound.wav"; 
const App = () => {
  let {recognition, speaking, setSpeaking, prompt, response, setPrompt} = useContext(datacontext);

  const playSound = () => {
    const sound = new Audio(processSound); 
    sound.play();
  }

  return (
    <div className='main'>
      <img src={va} alt='' id="avaID"/>
      <span> Hey! How can i help you</span>
      {!speaking ? 
        <button onClick={() => {
          playSound(); 
          setPrompt("Listening...");
          setSpeaking(true);
          recognition.start();
        }}>
          <IoMdMic />
        </button>
        :
        <div className='response'>
          {!response ?
            <img src={voice} alt='' id="voice"/>
            :
            <img src={voice} alt='' id="voice"/>
          }
          <p>{prompt}</p>
        </div>
      }
    </div>
  )
}

export default App;
