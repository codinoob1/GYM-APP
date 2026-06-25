import React from 'react'

const Providerbutton = ({ children, action }) => {
  return (
    <div>
      <button onClick={action}>
        {children}
      </button>
    </div>
  )
}

export default Providerbutton