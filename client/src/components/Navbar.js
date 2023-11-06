import React from "react"
import {Link} from "react-router-dom"

const NavBar = () => {
    return(
        <nav>
        <div class="nav-wrapper">
          <Link to="/" class="brand-logo left">HOI</Link>
          <ul id="nav-mobile" class="right">
            <li><Link to="##">Login</Link></li>
            <li><Link to="##">Register</Link></li>
            <li><Link to="##">Profile</Link></li>
          </ul>
        </div>
      </nav>
    )
}

export default NavBar