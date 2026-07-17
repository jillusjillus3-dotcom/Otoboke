import React, { useEffect, useRef, useState } from "react";
import "./Robot.css";

import HeadFrame from "../../assets/svg/HeadFrame.svg";
import FaceScreen from "../../assets/svg/FaceScreen.svg";
import LeftEye from "../../assets/svg/LeftEye.svg";
import RightEye from "../../assets/svg/RightEye.svg";
import Body from "../../assets/svg/Body.svg";
import Neck from "../../assets/svg/Neck.svg";
import Wheel from "../../assets/svg/Wheel.svg";
import Antenna from "../../assets/svg/Antenna.svg";

// Left arm parts
import LeftShoulder from "../../assets/svg/LeftShoulder.svg";
import LeftUpperJoint from "../../assets/svg/LeftUpperJoint.svg";
import LeftUpperArm from "../../assets/svg/LeftUpperArm.svg";
import LeftLowerJoint from "../../assets/svg/LeftLowerJoint.svg";
import LeftLowerArm from "../../assets/svg/LeftLowerArm.svg";
import LeftClaw from "../../assets/svg/LeftClaw.svg";

// Right arm parts
import RightShoulder from "../../assets/svg/RightShoulder.svg";
import RightUpperJoint from "../../assets/svg/RightUpperJoint.svg";
import RightUpperArm from "../../assets/svg/RightUpperArm.svg";
import RightLowerJoint from "../../assets/svg/RightLowerJoint.svg";
import RightLowerArm from "../../assets/svg/RightLowerArm.svg";
import RihtClaw from "../../assets/svg/RihtClaw.svg";

// Eye pupils
import LeftPupil from "../../assets/svg/LeftPupil.svg";
import RightPupil from "../../assets/svg/RightPupil.svg";

// Mouth shapes
import MouthNeutral from "../../assets/svg/MouthNeutral.svg";
import MouthBigSmile from "../../assets/svg/MouthBigSmile.svg";
import MouthHappy from "../../assets/svg/MouthHappy.svg";
import MouthSad from "../../assets/svg/MouthSad.svg";
import MouthSurprised from "../../assets/svg/MouthSurprised.svg";

// Eye expression shapes
import LeftEyeHappy from "../../assets/svg/LeftEyeHappy.svg";
import LeftEyeBigSmile from "../../assets/svg/LeftEyeBigSmile.svg";
import LeftEyeSad from "../../assets/svg/LeftEyeSad.svg";
import LeftEyeSurprised from "../../assets/svg/LeftEyeSurprised.svg";

import RightEyeHappy from "../../assets/svg/RightEyeHappy..svg"; // Note double dot
import RightEyeBigSmile from "../../assets/svg/RightEyeBigSmile.svg";
import RightEyeSad from "../../assets/svg/RightEyeSad.svg";
import RightEyeSurprised from "../../assets/svg/RightEyeSurprised.svg";

function Robot() {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  // Mouth and eye emotion state
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

  const handleRobotClick = (e) => {
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

  // Eye tracking useEffect
  useEffect(() => {
    let mouseX = null;
    let mouseY = null;
    let isMouseInWindow = false;
    let lastMoveTime = Date.now();

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseInWindow = true;
      lastMoveTime = Date.now();
    };

    const handleMouseLeave = () => {
      isMouseInWindow = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let leftCurrentX = 0;
    let leftCurrentY = 0;
    let rightCurrentX = 0;
    let rightCurrentY = 0;

    const ACTIVE_LERP = 0.15; // Snappy tracking when active
    const RETURN_LERP = 0.06; // Slow, smooth centering drift
    const MAX_DISPLACEMENT = 5.5;
    const INACTIVITY_LIMIT = 10000; // 10 seconds

    let animationFrameId;

    const updatePupils = () => {
      const now = Date.now();
      const isIdle = now - lastMoveTime >= INACTIVITY_LIMIT;

      let leftTargetX = 0;
      let leftTargetY = 0;
      if (isMouseInWindow && !isIdle && mouseX !== null && leftEyeRef.current) {
        const rect = leftEyeRef.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const r = Math.min(MAX_DISPLACEMENT, dist * 0.05);
          leftTargetX = (dx / dist) * r;
          leftTargetY = (dy / dist) * r;
        }
      }

      let rightTargetX = 0;
      let rightTargetY = 0;
      if (isMouseInWindow && !isIdle && mouseX !== null && rightEyeRef.current) {
        const rect = rightEyeRef.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const r = Math.min(MAX_DISPLACEMENT, dist * 0.05);
          rightTargetX = (dx / dist) * r;
          rightTargetY = (dy / dist) * r;
        }
      }

      // Determine lerp factor based on target coordinates (slower return to center)
      const isCentering = (leftTargetX === 0 && leftTargetY === 0 && rightTargetX === 0 && rightTargetY === 0);
      const currentLerp = isCentering ? RETURN_LERP : ACTIVE_LERP;

      leftCurrentX += (leftTargetX - leftCurrentX) * currentLerp;
      leftCurrentY += (leftTargetY - leftCurrentY) * currentLerp;
      rightCurrentX += (rightTargetX - rightCurrentX) * currentLerp;
      rightCurrentY += (rightTargetY - rightCurrentY) * currentLerp;

      if (leftPupilRef.current) {
        leftPupilRef.current.style.transform = `translate(${leftCurrentX.toFixed(2)}px, ${leftCurrentY.toFixed(2)}px)`;
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.style.transform = `translate(${rightCurrentX.toFixed(2)}px, ${rightCurrentY.toFixed(2)}px)`;
      }

      animationFrameId = requestAnimationFrame(updatePupils);
    };

    updatePupils();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
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
    <div className="robot" onClick={handleRobotClick} onDoubleClick={handleRobotDoubleClick}>
      
      <img src={Neck} className="neck" alt="neck" />
      
      <div className="leftArm">
        <img src={LeftShoulder} className="arm-shoulder" alt="left shoulder" />
        <div className="UpperArmWrapper">
          <img src={LeftUpperJoint} className="arm-upperJoint" alt="left upper joint" />
          <img src={LeftUpperArm} className="arm-upperArm" alt="left upper arm" />
          <div className="LowerArmWrapper">
            <img src={LeftLowerJoint} className="arm-lowerJoint" alt="left lower joint" />
            <img src={LeftLowerArm} className="arm-lowerArm" alt="left lower arm" />
            <img src={LeftClaw} className="arm-claw" alt="left claw" />
          </div>
        </div>
      </div>
      
      <img src={Body} className="body" alt="body" />
      
      <div className="rightArm">
        <img src={RightShoulder} className="arm-shoulder" alt="right shoulder" />
        <div className="UpperArmWrapper">
          <img src={RightUpperJoint} className="arm-upperJoint" alt="right upper joint" />
          <img src={RightUpperArm} className="arm-upperArm" alt="right upper arm" />
          <div className="LowerArmWrapper">
            <img src={RightLowerJoint} className="arm-lowerJoint" alt="right lower joint" />
            <img src={RightLowerArm} className="arm-lowerArm" alt="right lower arm" />
            <img src={RihtClaw} className="arm-claw" alt="right claw" />
          </div>
        </div>
      </div>
      
      <img src={Wheel} className="wheel" alt="wheel" />
      
      <div className="head" onMouseEnter={handleFaceMouseEnter}>
        <img src={Antenna} className="antenna" alt="antenna" />
        <img src={HeadFrame} className="headFrame" alt="head frame" />
        <div className="screen">
          <img src={FaceScreen} className="faceScreen" alt="face screen" />
          <div className="left-eye" ref={leftEyeRef}>
            <img src={activeLeftEye} className="eye-base" alt="left eye" />
            <img src={LeftPupil} className="eye-pupil" ref={leftPupilRef} alt="left pupil" />
          </div>
          <div className="right-eye" ref={rightEyeRef}>
            <img src={activeRightEye} className="eye-base" alt="right eye" />
            <img src={RightPupil} className="eye-pupil" ref={rightPupilRef} alt="right pupil" />
          </div>
          <img src={activeMouth} className="mouth" alt="mouth" />
        </div>
      </div>
    </div>
  );
}

export default Robot;