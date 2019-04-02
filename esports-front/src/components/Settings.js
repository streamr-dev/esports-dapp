import React from 'react'

// Render the form to set up wallet's private key
const Settings = ({handleChange, handleSubmit, wallet}) => {

    return (
        <div className="PrivateKeyFormWrapper">
          <form>
              <fieldset>
                <input type="password" placeholder="Your private key" name="private" onChange={handleChange}/>
                
                {wallet===null || wallet === undefined ?
                    <button type="submit" onClick={handleSubmit}>Connect wallet</button>
                    :
                    <button type="submit" onClick={handleSubmit}>Disconnect wallet</button>
                }
              </fieldset>
          </form>
        </div>
      )
}

export default Settings
