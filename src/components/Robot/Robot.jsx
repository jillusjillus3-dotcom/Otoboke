import React, { useEffect, useRef } from "react";
import "./Robot.css";

import HeadFrame from "../../assets/svg/HeadFrame.svg";
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

// Emotion component
import Emotion from "../../emotion/Emotion";

function Robot() {
  const robotRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  // Store current emotion in a ref to avoid triggering unnecessary re-renders in the tracking loop
  const currentEmotionRef = useRef("neutral");

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
    <div className="robot" ref={robotRef}>
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
      
      <div className="head">
        <img src={Antenna} className="antenna" alt="antenna" />
        <img src={HeadFrame} className="headFrame" alt="head frame" />
        <Emotion 
          robotRef={robotRef}
          leftEyeRef={leftEyeRef}
          rightEyeRef={rightEyeRef}
          leftPupilRef={leftPupilRef}
          rightPupilRef={rightPupilRef}
          onEmotionChange={(newEmotion) => { currentEmotionRef.current = newEmotion; }}
        />
      </div>
    </div>
  );
}

export default Robot;