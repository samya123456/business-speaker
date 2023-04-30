import "./App.css"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import useLongPress from "./useLongPress";
import { FaMicrophone } from "react-icons/fa";
const App = () => {
  const [textToCopy, setTextToCopy] = useState();
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000
  });

  const { transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition } = useSpeechRecognition();
  //setQuestion(transcript)
  const { speak } = useSpeechSynthesis();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    setAnswer('')
  }

  const sayTheAnswer = (answer) => {
    speak({ text: answer })

  }
  const onLongPress = () => {
    startListening()
    console.log('longpress is triggered');
  };
  const onClick = () => {
    console.log('click is triggered')
  }

  const onLongPressEnd = () => {
    SpeechRecognition.stopListening()
    console.log('longpress End is triggered');
    getYourAnswer()
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, onLongPressEnd, defaultOptions);
  const getYourAnswer = () => {
    const question = transcript
    let query = { question }
    console.log(JSON.stringify(query))
    fetch("http://localhost:8000/query", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(query)
    }).then((result) => {

      result.json().then((resp) => {
        console.log(JSON.stringify(resp))
        // alert(resp.answer)
        setAnswer(resp.answer)
        sayTheAnswer(resp.answer)
      })
    })
  }
  const doClear = () => {

    resetTranscript()
    setAnswer('')


  }
  if (!browserSupportsSpeechRecognition) {
    return null
  }

  return (
    <>
      <div className="container">
        <h2>Speech to Text Converter</h2>
        <br />
        <p>A React hook that converts speech from the microphone to text and makes it available to your React
          components.</p>

        <div id="questionbox" className="main-content" onClick={() => setTextToCopy(transcript)}>
          {transcript}
        </div>

        <div className="btn-style">
          <button {...longPressEvent}><FaMicrophone /></button>
          <button onClick={doClear}>Clear</button>


        </div>

        <div id="answerbox" className="main-content">
          {answer}
        </div>

      </div>

    </>
  );
};

export default App;