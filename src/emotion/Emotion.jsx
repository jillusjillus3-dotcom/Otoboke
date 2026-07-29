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

// Antenna shape
import Antenna from "../assets/svg/Antenna.svg";

function Emotion({ 
  robotRef, 
  leftEyeRef, 
  rightEyeRef, 
  leftPupilRef, 
  rightPupilRef,
  onEmotionChange,
  isAntennaGlowing
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
    <>
      <img 
        src={Antenna} 
        className={`absolute left-[67px] top-[-18px] z-10 origin-bottom cursor-pointer transition-[filter] duration-300 hover:drop-shadow-[0_0_6px_rgba(255,56,60,0.7)] ${
          isAntennaGlowing
            ? "animate-antenna-bounce animate-antenna-glow"
            : "animate-antenna-bounce"
        }`} 
        alt="antenna" 
      />
      <div className="absolute left-[13px] top-[10px] w-[120px] h-[106px]" onMouseEnter={handleFaceMouseEnter}>
        <img src={FaceScreen} className="absolute left-0 top-0 w-full h-full" alt="face screen" />
        <div className="absolute left-[14px] top-[22px] w-[44px] h-[41px] animate-blink" ref={leftEyeRef}>
          <img src={activeLeftEye} className="absolute left-0 top-0 w-full h-full" alt="left eye" />
          <img 
            src={LeftPupil} 
            className="absolute left-[15px] top-[14px] w-[14px] h-[13px]" 
            ref={leftPupilRef} 
            style={{ opacity: (emotion === "neutral" || emotion === "surprised") ? 1 : 0 }} 
            alt="left pupil" 
          />
        </div>
        <div className="absolute left-[62px] top-[22px] w-[44px] h-[41px] animate-blink" ref={rightEyeRef}>
          <img src={activeRightEye} className="absolute left-0 top-0 w-full h-full" alt="right eye" />
          <img 
            src={RightPupil} 
            className="absolute left-[15px] top-[14px] w-[14px] h-[13px]" 
            ref={rightPupilRef} 
            style={{ opacity: (emotion === "neutral" || emotion === "surprised") ? 1 : 0 }} 
            alt="right pupil" 
          />
        </div>
        <img src={activeMouth} className="absolute left-[6px] top-[64px] w-[108px] h-[30px]" alt="mouth" />
      </div>
    </>
  );
}

export default Emotion;
