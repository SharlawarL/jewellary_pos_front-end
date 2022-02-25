import React,{ Component } from 'react'
import '../../assets/css/chart.css';

import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {}
        }
      }

    render(){
        return(
            <div>
                    <div className="chartBox">
                        <div className="chartSection">
                            <h3 className="head_text_1">User</h3>
                            <div className="circle_chart_1">
                                <PersonOutlineOutlinedIcon className="icon_1"></PersonOutlineOutlinedIcon>
                                <div className="text_1">75</div>
                            </div>
                        </div>
                        <div className="chartSection">
                            <h3 className="head_text_2">Mobile</h3>
                            <div className="circle_chart_2">
                                <PhoneAndroidOutlinedIcon className="icon_2"></PhoneAndroidOutlinedIcon>
                                <div className="text_2">25</div>
                            </div>
                        </div>
                        <div className="chartSection">
                            <h3 className="head_text_3">Pageviews</h3>
                            <div className="circle_chart_3">
                                <VisibilityOutlinedIcon className="icon_3"></VisibilityOutlinedIcon>
                                <div className="text_3">50</div>
                            </div>
                        </div>
                        <div className="chartSection">
                            <h3 className="head_text_4">Sales</h3>
                            <div className="circle_chart_4">
                                <AttachMoneyOutlinedIcon className="icon_4"></AttachMoneyOutlinedIcon>
                                <div className="text_4">75</div>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}