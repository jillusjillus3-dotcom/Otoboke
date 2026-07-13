import "./Robot.css";

import Head from "../../assets/svg/Head.svg";
import Body from "../../assets/svg/Body.svg";
import LeftArm from "../../assets/svg/LeftArm.svg";
import RightArm from "../../assets/svg/RightArm.svg";
import Neck from "../../assets/svg/Neck.svg";
import Wheel from "../../assets/svg/Wheel.svg";
import Antenna from "../../assets/svg/Antenna.svg";

function Robot(){
    return (
  <div className="robot">

  <img src={Antenna} className="antenna" />
  <img src={Head} className="head" />
  <img src={Neck} className="neck" />
  <img src={LeftArm} className="leftArm" />
  <img src={Body} className="body" />
  <img src={RightArm} className="rightArm" />
  <img src={Wheel} className="wheel" />

</div>
);
}

export default Robot;