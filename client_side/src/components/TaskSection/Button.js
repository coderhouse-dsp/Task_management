import React from 'react'
import "../../Styles.css"

const Button=({ color, text, onClick })=> {
  return (
     <button onClick={onClick} style={{ backgroundColor: color }}  className="btn col-auto mx-2 px-4 text-white">{text}</button>
  )
}

export default Button


