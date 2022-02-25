import React from 'react'
import { Link } from "react-router-dom";

//icons
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import MenuIcon from '@material-ui/icons/Menu';

import '../../assets/css/menu.css';
import MenuItem from '../../config/menu.json'


export default function SidebarComponent() {
  const [IsActive, setActive] = React.useState(false);

  const [userControl, setUserControl] = React.useState(localStorage.getItem("userlevel"));
  const [loginControl, setLoginControl] = React.useState(localStorage.getItem("loginType"));

  const toggleClass = () => {
    setActive(!IsActive);
  };

  const submenu = (subItem) => {
      return{}
  }

  return (
    <div style={{ borderBottom: '1px solid rgb(231, 230, 230)' }}>
      <div className="MenuIcon"
        onClick={toggleClass} >
        <MenuIcon />
      </div>
      <div className={IsActive ? "menuBar1" : 'menuBar'}>
        {MenuItem.map((data) =>
        <>
        {(data.user.includes(userControl))?
        
          <div key={data.menu} className="menuItem">  &nbsp;&nbsp; {data.menu}    <ExpandMoreOutlinedIcon />

              { (data.submenu.length > 5 ) ? (
                <>
                <div className="menuDropdownBigg">
              {data.submenu.map((subItem) =>
              (
                <div key={subItem.submenu}>
                {(subItem.user.includes(userControl))?(
                  <>
                    {(subItem.divider)?
                      (<Link key={subItem.submenu} className="menuLink" to={subItem.url}>
                          <div className="menuDropdownItemBigg" style={{borderBottom: '2px solid silver'}}>
                            {subItem.submenu}
                          </div>
                        </Link>):
                        (<Link key={subItem.submenu} className="menuLink" to={subItem.url}>
                            <div className="menuDropdownItemBigg">
                              {subItem.submenu}
                            </div>
                          </Link>)}
                  </>
                 ):''} 

                {/* {((subItem.user !="Admin")&&(subItem.user =="Administrator")&&(subItem.user =="User"))?(
                  <Link className="menuLink" to={subItem.url}>
                    <div className="menuDropdownItem">
                      {subItem.submenu}
                    </div>
                  </Link>
                ):''} */}
                </div>
              )
              )}
              </div>
              </>
              ):(
                <>
                <div className="menuDropdown">
              {data.submenu.map((subItem) =>
              (
                <div key={subItem.submenu}>
                {/* {subItem.user} <br></br> */}
                {(subItem.user.includes(userControl))?(
                  <Link key={subItem.submenu} className="menuLink" to={subItem.url}>
                    <div className="menuDropdownItemBigg">
                      {subItem.submenu}
                    </div>
                  </Link>
                 ):''} 

                {/* {((subItem.user !="Admin")&&(subItem.user =="Administrator")&&(subItem.user =="User"))?(
                  <Link className="menuLink" to={subItem.url}>
                    <div className="menuDropdownItem">
                      {subItem.submenu}
                    </div>
                  </Link>
                ):''} */}
                </div>
              )
              )}
              </div>
              </>
              )}
            </div>
            :''}
            </>
        )}
      </div>
      {/* <div className="sticky">I will stick to the screen when you reach my scroll position</div> */}
    </div>
  )
}