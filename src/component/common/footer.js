import React,{ Component } from 'react'
import '../../assets/css/menu.css';
import CopyrightOutlinedIcon from '@material-ui/icons/CopyrightOutlined';

export default class salesComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            userLoggedIn: false
        }
      }

    render(){

        const shopName = localStorage.getItem("shopName");

        return(
            <>
              <div className="FooterClass" >
                  <div className="companyName"> <CopyrightOutlinedIcon style={{ position:'absolute', marginTop:'-2px',fontSize:'1.2rem'}}/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {shopName}. All rights reserved.</div>
                  <div className="productName"> (p) Wondor POS, &nbsp;  <a href="http://www.selromsoft.in/" className="productLink" rel="noopener noreferrer">Selrom Software </a></div>
              </div>
            </>
        )
    }
}
