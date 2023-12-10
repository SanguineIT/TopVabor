import React from 'react'
import Logo from "../assets/image/Logo.png"
import WithAuth from '../authProvider/withAuth'

function Splacescreen() {
  return (
    <div>
        <section className="SplashScreen_section container-fluid">
        <div className="container">
            <div className="SplashScreen_logoImages">
                <img src= {Logo} alt=""/>
            </div>
        </div>
    </section>
    </div>
  )
}

export default WithAuth(Splacescreen)