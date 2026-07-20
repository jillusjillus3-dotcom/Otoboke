import React, { useEffect, useRef, useState } from "react";

// Mouth shapes
import MouthNeutral from "../assets/svg/MouthNeutral.svg";
import MouthBigSmile from "../assets/svg/MouthBigSmile.svg";
import MouthHappy from "../assets/svg/MouthHappy.svg";
import MouthSad from "../assets/svg/MouthSad.svg";
import MouthSurprised from "../assets/svg/MouthSurprised.svg";

// Eye expression shapes
import LeftEyeHappy from "../assets/svg/LeftEyeHappy.svg";
import LeftEyeBigSmile from "../assets/svg/LeftEyeBigSmile.svg";
import LeftEyeSad from "../assets/svg/LeftEyeSad.svg";
import LeftEyeSurprised from "../assets/svg/LeftEyeSurprised.svg";

import RightEyeHappy from "../assets/svg/RightEyeHappy..svg"; // Note double dot
import RightEyeBigSmile from "../assets/svg/RightEyeBigSmile.svg";
import RightEyeSad from "../assets/svg/RightEyeSad.svg";
import RightEyeSurprised from "../assets/svg/RightEyeSurprised.svg";

// Eye bases
import LeftEye from "../assets/svg/LeftEye.svg";
import RightEye from "../assets/svg/RightEye.svg";

// Eye pupils
import LeftPupil from "../assets/svg/LeftPupil.svg";
import RightPupil from "../assets/svg/RightPupil.svg";

// Face background
import FaceScreen from "../assets/svg/FaceScreen.svg";

function Emotion({ 
  robotRef, 
  leftEyeRef, 
  rightEyeRef, 
  leftPupilRef, 
  rightPupilRef,
  onEmotionChange
}) {
  const [emotion, setEmotion] = useState("neutral");
  const emotionTimeoutRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  const triggerEmotion = (emotionName, duration) => {
    // Clear any pending return-to-neutral timeouts
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
    }
    
    setEmotion(emotionName);

    emotionTimeoutRef.current = setTimeout(() => {
      setEmotion("neutral");
      emotionTimeoutRef.current = null;
    }, duration);
  };

  // Notify parent component about emotion updates
  useEffect(() => {
    if (onEmotionChange) {
      onEmotionChange(emotion);
    }
  }, [emotion, onEmotionChange]);

  useEffect(() => {
    const robotEl = robotRef.current;
    if (!robotEl) return;

    const handleRobotClick = () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      clickTimeoutRef.current = setTimeout(() => {
        triggerEmotion("happy", 2000);
        clickTimeoutRef.current = null;
      }, 250); // 250ms delay to check for double click
    };

    const handleRobotDoubleClick = (e) => {
      e.stopPropagation();
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      triggerEmotion("bigSmile", 3000);
    };

    robotEl.addEventListener("click", handleRobotClick);
    robotEl.addEventListener("dblclick", handleRobotDoubleClick);

    return () => {
      robotEl.removeEventListener("click", handleRobotClick);
      robotEl.removeEventListener("dblclick", handleRobotDoubleClick);
    };
  }, [robotRef]);

  const handleFaceMouseEnter = () => {
    triggerEmotion("surprised", 1000);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Map emotion to mouth SVG
  const mouthImages = {
    neutral: MouthNeutral,
    happy: MouthHappy,
    bigSmile: MouthBigSmile,
    sad: MouthSad,
    surprised: MouthSurprised,
  };
  const activeMouth = mouthImages[emotion] || MouthNeutral;

  // Map emotion to eye SVGs
  const leftEyeImages = {
    neutral: LeftEye,
    happy: LeftEyeHappy,
    bigSmile: LeftEyeBigSmile,
    sad: LeftEyeSad,
    surprised: LeftEyeSurprised,
  };
  const rightEyeImages = {
    neutral: RightEye,
    happy: RightEyeHappy,
    bigSmile: RightEyeBigSmile,
    sad: RightEyeSad,
    surprised: RightEyeSurprised,
  };
  const activeLeftEye = leftEyeImages[emotion] || LeftEye;
  const activeRightEye = rightEyeImages[emotion] || RightEye;

  return (
    <div className="screen" onMouseEnter={handleFaceMouseEnter}>
      <img src={FaceScreen} className="faceScreen" alt="face screen" />
      <div className="left-eye" ref={leftEyeRef}>
        <img src={activeLeftEye} className="eye-base" alt="left eye" />
        <img 
          src={LeftPupil} 
          className="eye-pupil" 
          ref={leftPupilRef} 
          style={{ opacity: (emotion === "neutral" || emotion === "surprised") ? 1 : 0 }} 
          alt="left pupil" 
        />
      </div>
      <div className="right-eye" ref={rightEyeRef}>
        <img src={activeRightEye} className="eye-base" alt="right eye" />
        <img 
          src={RightPupil} 
          className="eye-pupil" 
          ref={rightPupilRef} 
          style={{ opacity: (emotion === "neutral" || emotion === "surprised") ? 1 : 0 }} 
          alt="right pupil" 
        />
      </div>
      <img src={activeMouth} className="mouth" alt="mouth" />
    </div>
  );
}

export default Emotion;
