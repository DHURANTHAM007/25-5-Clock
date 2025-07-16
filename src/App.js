import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const beepRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft < 0) {
      beepRef.current.play();
      if (timerLabel === 'Session') {
        setTimerLabel('Break');
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel('Session');
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const handleLengthChange = (type, delta) => {
    if (isRunning) return;

    if (type === 'break') {
      const newBreakLength = breakLength + delta;
      if (newBreakLength > 0 && newBreakLength <= 60) {
        setBreakLength(newBreakLength);
      }
    } else {
      const newSessionLength = sessionLength + delta;
      if (newSessionLength > 0 && newSessionLength <= 60) {
        setSessionLength(newSessionLength);
        setTimeLeft(newSessionLength * 60);
      }
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="clock-container">
      <h1 className="main-title">25 + 5 Clock</h1>
      <div className="length-controls">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <div className="control-buttons">
            <button id="break-decrement" onClick={() => handleLengthChange('break', -1)}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => handleLengthChange('break', 1)}>+</button>
          </div>
        </div>
        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <div className="control-buttons">
            <button id="session-decrement" onClick={() => handleLengthChange('session', -1)}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => handleLengthChange('session', 1)}>+</button>
          </div>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <div className="timer-controls">
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <audio
        id="beep"
        ref={beepRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default App;
