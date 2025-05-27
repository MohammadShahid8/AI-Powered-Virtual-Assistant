import React, { createContext, useState, useEffect } from 'react';
import run from '../Gemini'; 

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState('Listening...');
  const [language, setLanguage] = useState('en-IN');
  const [timeoutId, setTimeoutId] = useState(null);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setLanguage(voices[0]?.lang || 'en-IN');
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const speakText = (text, language = 'en-US') => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    setVoiceForLanguage(speech);

    speech.onend = () => {
      setSpeaking(false);
      startListening();
    };

    window.speechSynthesis.speak(speech);
    setSpeaking(true);
  };

  function setVoiceForLanguage(utterance) {
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice;

    if (utterance.lang === 'en-US') {
      selectedVoice = voices.find(voice => voice.lang === 'hi-GB');
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
      }
    } else {
      selectedVoice = voices.find(voice => voice.lang === 'en-US');
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }
  

  const aiResponse = async (prompt) => {
    try {
      const text = await run(prompt);
      const formattedText = text
        .replace(/Google/gi, 'Mohammad Shahid')
        .replace(/bada bhasha model/gi, 'virtual assistant')
        .replace(/large language model/gi, 'virtual assistant');
      
      setPrompt(formattedText);
      speakText(formattedText, language);
    } catch (error) {
      console.error('Error during AI response:', error);
    }
  };

  recognition.onresult = (e) => {
    const transcript = e.results[e.resultIndex][0].transcript;
    setPrompt(transcript);
    takeCommand(transcript.toLowerCase());
    resetTimeout();
  };

  recognition.onstart = () => {
    setSpeaking(true);
    setPrompt('Listening...');
    resetTimeout();
  };

  recognition.onend = () => setSpeaking(false);
  recognition.onerror = (event) => console.error('Speech recognition error:', event.error);

  const startListening = () => recognition.start();

  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      recognition.stop();
      setSpeaking(false);
    }, 600000); 
    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    if (/[a-zA-Z]/.test(prompt)) {
      setLanguage('en-US');
    } else if (/[\u0900-\u097F]/.test(prompt)) {
      setLanguage('hi-US');
    }
  }, [prompt]);


  function takeCommand(command) {
    const websites = {
      github: "https://github.com/", stackoverflow: "https://stackoverflow.com/", leetcode: "https://leetcode.com/", hackerrank: "https://www.hackerrank.com/", codeforce: "https://codeforces.com/", codewars: "https://www.codewars.com/", gitlab: "https://gitlab.com/", hackerearth: "https://www.hackerearth.com/", freecodecamp: "https://www.freecodecamp.org/", w3schools: "https://www.w3schools.com/",
      mdn: "https://developer.mozilla.org/", visualstudio: "https://visualstudio.microsoft.com/", docker: "https://www.docker.com/", terraform: "https://www.terraform.io/", kubernetes: "https://kubernetes.io/", postman: "https://www.postman.com/", vscodesite: "https://code.visualstudio.com/", gfg: "https://www.geeksforgeeks.org/", facebook: "https://www.facebook.com/", instagram: "https://www.instagram.com/",
      twitter: "https://twitter.com/", linkedin: "https://www.linkedin.com/", reddit: "https://www.reddit.com/", pinterest: "https://www.pinterest.com/", snapchat: "https://www.snapchat.com/", whatsapp: "https://www.whatsapp.com/", tiktok: "https://www.tiktok.com/", youtube: "https://www.youtube.com/", quora: "https://www.quora.com/", discord: "https://discord.com/", zoom: "https://zoom.us/",
      skype: "https://www.skype.com/", telegram: "https://web.telegram.org/", google: "https://www.google.com/", gmail: "https://mail.google.com/", netflix: "https://www.netflix.com/", amazon: "https://www.amazon.com/", walmart: "https://www.walmart.com/", spotify: "https://www.spotify.com/", uber: "https://www.uber.com/", airbnb: "https://www.airbnb.com/", weather: "https://weather.com/",
      dictionary: "https://www.merriam-webster.com/", imdb: "https://www.imdb.com/", wikipedia: "https://www.wikipedia.org/", googlecalendar: "https://www.google.com/calendar/", coursera: "https://www.coursera.org/", udemy: "https://www.udemy.com/", medium: "https://medium.com/", flipkart: "https://www.flipkart.com/", myntra: "https://www.myntra.com/", ajio: "https://www.ajio.com/", snapdeal: "https://www.snapdeal.com/",
      bigbasket: "https://www.bigbasket.com/", grofers: "https://www.grofers.com/", croma: "https://www.croma.com/", lulu: "https://www.luluhypermarket.com/", nykaa: "https://www.nykaa.com/", firstcry: "https://www.firstcry.com/", unacademy: "https://www.unacademy.com/", vedantu: "https://www.vedantu.com/", map: "https://www.google.com/maps/"
    };
  
    const commandParts = command.toLowerCase().split(" ");
    let siteKey = "";
  
    if (commandParts.includes("open") || commandParts.includes("kholo")) {
      const openIndex = commandParts.indexOf("open") !== -1 ? commandParts.indexOf("open") : commandParts.indexOf("kholo");
      if (openIndex > 0) {
        siteKey = commandParts.slice(0, openIndex).join(" ");
      } else {
        siteKey = commandParts.slice(openIndex + 1).join(" ");
      }
  
      const siteUrl = websites[siteKey] || `https://www.google.com/search?q=${encodeURIComponent(siteKey)}`;
      window.open(siteUrl, "_blank");
      speakText(`Opening ${siteKey}`, language);
      return;
    }

    const adjustVolume = (command) => {
      const volumeChange = command.includes('increase') || command.includes('raise') ? 0.1 : -0.1;
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio) => {
        audio.volume = Math.max(0, Math.min(1, audio.volume + volumeChange));
      });
      speakText(command.includes('increase') ? 'Increasing volume' : 'Lowering volume', language);
    };
  
    const adjustBrightness = (command) => {
      const body = document.body;
    
      const currentBrightness = parseInt((body.style.filter.match(/brightness\((\d+)%\)/) || [])[1]) || 100;

      const increaseBrightness = command.includes('increase brightness') || command.includes('brightness badhao');
      const brightnessChange = increaseBrightness ? 20 : -20;
    
      const newBrightness = Math.max(20, Math.min(100, currentBrightness + brightnessChange));
      body.style.filter = `brightness(${newBrightness}%)`;
    
      speakText(`${increaseBrightness ? 'Increasing' : 'Lowering'} brightness to ${newBrightness}%`, language);
    };
    
    const checkBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        const level = Math.round(battery.level * 100);
        const chargingStatus = battery.charging ? 'charging' : 'not charging';
        const statusMessage = `Battery is at ${level}% and it is currently ${chargingStatus}.`;
        setPrompt(statusMessage);
        speakText(statusMessage, language);
      } else {
        setPrompt('Battery status not available.');
        speakText('Battery status not available.', language);
      }
    };
  
    if (command.includes("volume")) {
      adjustVolume(command);
      return;
    }
  
    if (command.includes("brightness")) {
      adjustBrightness(command);
      return;
    }
  
    if (command.includes("battery")) {
      checkBatteryStatus();
      return;
    }
  
    const getTime = () => new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
    const getDate = () => new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    const getDay = () => new Date().toLocaleDateString(undefined, { weekday: "long" });
  
    const responses = {
      time: () => { const time = getTime(); setPrompt(time); speakText(time, language); },
      date: () => { const date = getDate(); setPrompt(date); speakText(date, language); },
      day: () => { const day = getDay(); setPrompt(day); speakText(day, language); }
    };
  
    if (command.includes("time") || command.includes("samay")) responses.time();
else if ((command.includes("date") && command.includes("aaj")) || (command.includes("date") && command.includes("today")) || (command.includes("tarikh") && command.includes("aaj"))) responses.date();
else if (command.includes("month") || command.includes("mahina")) responses.month();
else if ((command.includes("day") && command.includes("aaj")) || (command.includes("day") && command.includes("today"))|| (command.includes("din") && command.includes("aaj"))) responses.day();
else aiResponse(command);

  }
  
  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    aiResponse,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
