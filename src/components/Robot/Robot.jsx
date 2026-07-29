import React, { useEffect, useRef, useState } from "react";

import HeadFrame from "../../assets/svg/HeadFrame.svg";
import Body from "../../assets/svg/Body.svg";
import Neck from "../../assets/svg/Neck.svg";

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
import RightClaw from "../../assets/svg/RightClaw.svg";

// Emotion component
import Emotion from "../../emotion/Emotion";

// SpeechBubble component
import SpeechBubble from "../SpeechBubble/SpeechBubble";

function Robot() {
  const robotRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  // Store current emotion in a ref to avoid triggering unnecessary re-renders in the tracking loop
  const currentEmotionRef = useRef("neutral");

  const [isSelected, setIsSelected] = useState(false);
  const [position, setPosition] = useState(null);
  const [speechMessage, setSpeechMessage] = useState("Hello! I'm Otoboke! 🤖");

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nextSelected = !isSelected;
    setIsSelected(nextSelected);

    if (nextSelected) {
      if (robotRef.current && !position) {
        const rect = robotRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
    }
  };

  useEffect(() => {
    if (!isSelected) return;

    const handleWindowClick = (e) => {
      if (robotRef.current && robotRef.current.contains(e.target)) {
        return;
      }
      
      if (e.button === 0) {
        if (robotRef.current) {
          const rect = robotRef.current.getBoundingClientRect();
          const targetX = e.clientX - rect.width / 2;
          const targetY = e.clientY - rect.height / 2;
          setPosition({ x: targetX, y: targetY });
        }
      }
    };

    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [isSelected]);

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
      const isNeutralOrSurprised = currentEmotionRef.current === "neutral" || currentEmotionRef.current === "surprised";

      let leftTargetX = 0;
      let leftTargetY = 0;
      // Only track the mouse if the robot is in a neutral or surprised expression state
      if (isMouseInWindow && !isIdle && isNeutralOrSurprised && mouseX !== null && leftEyeRef.current) {
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
      // Only track the mouse if the robot is in a neutral or surprised expression state
      if (isMouseInWindow && !isIdle && isNeutralOrSurprised && mouseX !== null && rightEyeRef.current) {
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

  return (
    <div 
      className="relative w-[300px] h-[450px] mx-auto mt-[80px] animate-float transition-[left,top] duration-[1200ms] ease-linear" 
      ref={robotRef}
      onContextMenu={handleContextMenu}
      style={position ? {
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        margin: 0,
        marginTop: 0,
      } : {}}
    >
      <SpeechBubble 
        message={speechMessage} 
        onClose={() => setSpeechMessage("")}
        className="absolute -top-[70px] left-[110px] z-40"
      />
      <img src={Neck} className="absolute left-[130.5px] top-[126px] w-[39px] h-[30px] z-10 origin-[20px_30px] animate-head-idle" alt="neck" />
      
      <div className="absolute left-[184.5px] top-[155px] w-[60px] h-[130px] z-[25]">
        <img src={LeftShoulder} className="absolute left-[12.5px] top-0 w-[23px] h-[23px]" alt="left shoulder" />
        <div className="absolute left-[35px] top-[11.5px] w-0 h-0 origin-top animate-left-arm-swing">
          <img src={LeftUpperJoint} className="absolute left-[-3px] top-[35px] w-[6px] h-[4px] max-w-none" alt="left upper joint" />
          <img src={LeftUpperArm} className="absolute left-[-8px] top-0 w-[16px] h-[35px] max-w-none" alt="left upper arm" />
          <div className="absolute left-0 top-[39px] w-0 h-0 origin-top">
            <img src={LeftLowerJoint} className="absolute left-[-3px] top-[35px] w-[6px] h-[4px] max-w-none" alt="left lower joint" />
            <img src={LeftLowerArm} className="absolute left-[-8px] top-0 w-[16px] h-[35px] max-w-none" alt="left lower arm" />
            <img src={LeftClaw} className="absolute left-[-10px] top-[39px] w-[20px] h-[28px] max-w-none" alt="left claw" />
          </div>
        </div>
      </div>
      
      <img src={Body} className="absolute left-[90px] top-[146px] w-[120px] h-[144px] z-20" alt="body" />
      
      <div className="absolute left-[55.5px] top-[155px] w-[60px] h-[130px] z-[25]">
        <img src={RightShoulder} className="absolute left-[24.5px] top-0 w-[23px] h-[23px]" alt="right shoulder" />
        <div className="absolute left-[25px] top-[11.5px] w-0 h-0 origin-top animate-right-arm-swing">
          <img src={RightUpperJoint} className="absolute left-[-3px] top-[35px] w-[6px] h-[4px] max-w-none" alt="right upper joint" />
          <img src={RightUpperArm} className="absolute left-[-8px] top-0 w-[16px] h-[35px] max-w-none" alt="right upper arm" />
          <div className="absolute left-0 top-[39px] w-0 h-0 origin-top">
            <img src={RightLowerJoint} className="absolute left-[-3px] top-[35px] w-[6px] h-[4px] max-w-none" alt="right lower joint" />
            <img src={RightLowerArm} className="absolute left-[-8px] top-0 w-[16px] h-[35px] max-w-none" alt="right lower arm" />
            <img src={RightClaw} className="absolute left-[-10px] top-[39px] w-[20px] h-[28px] max-w-none" alt="right claw" />
          </div>
        </div>
      </div>

      <div className="absolute left-[77px] top-[31px] w-[146px] h-[125px] z-30 animate-head-idle origin-bottom">
        <img src={HeadFrame} className="absolute left-0 top-0 w-full h-full" alt="head frame" />
        <Emotion 
          robotRef={robotRef}
          leftEyeRef={leftEyeRef}
          rightEyeRef={rightEyeRef}
          leftPupilRef={leftPupilRef}
          rightPupilRef={rightPupilRef}
          onEmotionChange={(newEmotion) => { currentEmotionRef.current = newEmotion; }}
          isAntennaGlowing={isSelected}
        />
      </div>
    </div>
  );
}

export default Robot;