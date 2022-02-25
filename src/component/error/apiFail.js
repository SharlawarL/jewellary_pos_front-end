import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/css/style.css';
//pages
import Footer from '../common/footer'

import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';

export default class idleComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            showModal: false,
        }

      }


    render(){

        return(
            <div>
                <div className="containerError">
                    <div className="vertical-center">
                        <InfoIcon style={{fontSize:'80px',color:'rgb(137, 139, 139)'}}/>
                        <h1>OOP's! <span>Samething went wrong.</span></h1>
                        <div className="row">
                            <div className="col-6">
                                <Link to='/home' className="Link">
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> <span className="buttonTextFirstLetter">R</span>efresh</div>
                                    </Button>
                                </Link>
                            </div>
                            <div className="col-1"></div>
                            <div className="col-6">
                                <Link  to='/logout' className="Link">
                                    <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                        <div className="buttonText"> <span className="buttonTextFirstLetter">L</span>ogout</div>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}
