import React from "react";
import Button from "./Button";


const Header = ({ showForm, changeTextAndColor }) => {
  return (
    
      <div className="row justify-content-between">
        <h3 className="col-3 text-white">TaskList</h3>
        <Button
          onClick={showForm}
          color={changeTextAndColor ? "red" : "green"}
          text={changeTextAndColor ? "Close" : "Add"}
        />
      </div>

  );
};

export default Header;
