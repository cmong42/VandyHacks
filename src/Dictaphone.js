import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {useLocalStorage} from "react-use-storage";

const Dictaphone = () => {

  let [pastTranscript, setPastTranscript] = useState([])
  let [currLang, setCurrLang] = useState('en-EN')
  const [content, setContent] = useState("");
  const languageCodes = ["zh-CN", "fr-FR", "es-MX"]

  function get_volume(){
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
      .then(function(stream) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
  
        microphone.connect(analyser);
        
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = function() {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          setVolume(Math.round(average));
          // colorPids(average);
        };
      })
      .catch(function(err) {
        /* handle the error */
        console.error(err);
        setVolume(0)
      });
  }

  let [wordsArray, setWordsArray] = useState([])
  let [volume, setVolume] = useState(0)

  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening){
      SpeechRecognition.startListening({language: currLang})
      setVolume(get_volume())
      if (transcript!=""){
      document.getElementById("textarea").value+="\n"+transcript
      }
    }
  }, [listening])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  function getItemsEvent(searcher){
    try{
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
      }}catch (err){
      console.log(err)
    }
  }

  return (
    <div>
      <div class="row">
        <div class="col-sm-4">
      <label class="lang" htmlFor="lang" id="choicesLang">Choose a language:</label>
      <select onChange={(event)=>setCurrLang(event.target.value)} name="lang" class="lang" id="lang">
        <option value="en-US">English</option>
        <option value="zh-CN">Chinese (Mandarin)</option>
        <option value="fr-FR">French</option>
        <option value="es-MX">Spanish</option>
      </select>
      <p class="lang" id="mic">Microphone: ON</p>
      <button id="resetButton" class="lang" onClick={()=>document.getElementById("textarea").value=""}>Reset</button>
      </div>
      <div class="col-sm-8">
      <textarea id="textarea" rows="30" cols="100"></textarea>
      <br></br>
      </div>
      </div>
    </div>

  );
};
export default Dictaphone;