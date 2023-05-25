import React from "react";
import Button from "./Button";
// import "../Leave/Leave.css";

const ProfileHeader = ({ showForm, changeTextAndColor }) => {
  return (
    
      <div className="row justify-content-between">
        <h4 className="col-6 text-white">Update Profile here:</h4>
        <Button
          onClick={showForm}
          color={changeTextAndColor ? "red" : "green"}
          text={changeTextAndColor ? "Close" : "Update"}
          
        />
      </div>

  );
};

export default ProfileHeader;
