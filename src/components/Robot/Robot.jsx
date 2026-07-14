import "./Robot.css";

import HeadFrame from "../../assets/svg/HeadFrame.svg";
import FaceScreen from "../../assets/svg/FaceScreen.svg";
import LeftEye from "../../assets/svg/LeftEye.svg";
import RightEye from "../../assets/svg/RightEye.svg";
import Mouth from "../../assets/svg/Mouth.svg";
import Body from "../../assets/svg/Body.svg";
import LeftArm from "../../assets/svg/LeftArm.svg";
import RightArm from "../../assets/svg/RightArm.svg";
import Neck from "../../assets/svg/Neck.svg";
import Wheel from "../../assets/svg/Wheel.svg";
import Antenna from "../../assets/svg/Antenna.svg";

function Robot() {
  return (
    <div className="robot">
      
      <img src={Neck} className="neck" alt="neck" />
      <img src={LeftArm} className="leftArm" alt="left arm" />
      <img src={Body} className="body" alt="body" />
      <img src={RightArm} className="rightArm" alt="right arm" />
      <img src={Wheel} className="wheel" alt="wheel" />
      
      <div className="head">
        <img src={Antenna} className="antenna" alt="antenna" />
        <img src={HeadFrame} className="headFrame" alt="head frame" />
        <div className="screen">
          <img src={FaceScreen} className="faceScreen" alt="face screen" />
          <img src={LeftEye} className="left-eye" alt="left eye" />
          <img src={RightEye} className="right-eye" alt="right eye" />
          <img src={Mouth} className="mouth" alt="mouth" />
        </div>
      </div>
    </div>
  );
}

export default Robot;