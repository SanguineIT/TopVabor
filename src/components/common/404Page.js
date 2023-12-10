import React from 'react'
import Header from './header'
import error from "../../assets/image/404error.png"

const PageNotFound = () => {
  return (
    <div>
<Header/>


<div className="container-fluid"><img src={error} className='img-fluid' alt=""/></div>

        </div>

  )
}

export default PageNotFound