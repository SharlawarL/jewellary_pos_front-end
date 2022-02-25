import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/style.css';
//pages
import { Redirect } from 'react-router-dom';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import ChatPage from '../common/chart'
import Donutchart from '../common/donutchart'
//card
import Card from '@material-ui/core/Card';
import NumberFormat from 'react-number-format';

//icon
import ImportExportOutlinedIcon from '@material-ui/icons/ImportExportOutlined';
// import { Chart } from 'primereact/chart';

import '../../assets/css/chart.css';

import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';

import backImg1 from '../../assets/img/graph-blue.svg';
import backImg2 from '../../assets/img/graph-green.svg';
import backImg3 from '../../assets/img/graph-yellow.svg';

import CompanyService from '../../service/company/companyService'

//object of services
const companyService = new CompanyService();

function Home(props) {

  const [goldRate, setGoldRate] = useState(0);
  const [silverRate, setSilverRate] = useState(0);
  const [sales, setSales] = useState(0);
  const [items, setItems] = useState(0);


  const [salesno, setSalesNO] = useState(0);
  const [purchaseno, setPurchaseNO] = useState(0);
  const [voucher, setVoucher] = useState(0);
  const [scheme, setScheme] = useState(0);


  // ****** BEGINNING OF CHANGE ******
  useEffect(() => {
    getRates();
  }, []);


  const getRates = () => {

    let data = {
      login_user: localStorage.getItem("username"),
      branch: localStorage.getItem("Branch"),
    }

    companyService.getUserHome(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {

              localStorage.setItem("Gold_rate",(Number(response['data']['data']['gold-rate'])).toFixed(2))
              localStorage.setItem("Sil_rate",(Number(response['data']['data']['silver-rate'])).toFixed(2))
              //total
              setGoldRate((Number(response['data']['data']['gold-rate'])).toFixed(2));
              setSilverRate((Number(response['data']['data']['silver-rate'])).toFixed(2));
              setSales(response['data']['data']['sales']);
              setItems(response['data']['data']['items']);

              //charts
              setSalesNO(response['data']['data']['salesno']);
              setPurchaseNO(response['data']['data']['purchaseno']);
              setVoucher(response['data']['data']['voucher']);
              setScheme(response['data']['data']['schems']);
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })


  }

  const chartData = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
};

const lightOptions = {
    legend: {
        labels: {
            fontColor: '#495057'
        }
    }
};
  

  return (
    <div className="body">
      <Menu loggedIn = {props.loggedIn} />
      <div className="continerTranferentBox">

        {/* Card details */}
        <div className="cardBox">
            <div className="card" >
              <div className="overview-box overview-box-1">
                <h1>Today's Gold Rate</h1>
                <div className="overview-value">
                  <NumberFormat value={goldRate} displayType={'text'} thousandSeparator={true} prefix={'₹ '} />
                </div>
                {/* <div className="overview-ratio">
                  <div className="overview-direction">
                    <ImportExportOutlinedIcon/>
                  </div>
                  <div className="overview-ratio-value">
                    51%
                  </div>
                </div> */}
                <img src={backImg1} alt="apollo-layout" />
              </div>
            </div>
            <div className="card" >
              <div className="overview-box overview-box-2">
                  <h1>Today's Silver Rate</h1>
                  <div className="overview-value">
                  <NumberFormat value={silverRate} displayType={'text'} thousandSeparator={true} prefix={'₹ '} />
                    </div>
                  {/* <div className="overview-ratio">
                    <div className="overview-direction">
                      <ImportExportOutlinedIcon/>
                    </div>
                    <div className="overview-ratio-value">
                      36%
                    </div>
                  </div> */}
                  <img src={backImg2} alt="apollo-layout" />
                </div>
            </div>
            <div className="card" >
                <div className="overview-box overview-box-3">
                  <h1>Today Sales</h1>
                  <div className="overview-value">
                    {sales}
                    </div>
                  {/* <div className="overview-ratio">
                    <div className="overview-direction">
                      <ImportExportOutlinedIcon/>
                    </div>
                    <div className="overview-ratio-value">
                      19%
                    </div>
                  </div> */}
                  <img src={backImg3} alt="apollo-layout" />
                </div>
            </div>
            <div className="card" >
              <div className="overview-box overview-box-4">
                  <h1>Total Items</h1>
                  <div className="overview-value">
                    {items}
                    </div>
                  {/* <div className="overview-ratio">
                    <div className="overview-direction">
                      <ImportExportOutlinedIcon/>
                    </div>
                    <div className="overview-ratio-value">
                      26%
                    </div>
                  </div> */}
                  <img src={backImg3} alt="apollo-layout" />
                </div>
            </div>
        </div> 
        <br></br>
        <Card className="graphView" style={{width:'97%'}}>
          <div className="graphBoxHead">
            Today's Status
          </div>
          <div className="statusBoxDash">
              <div className="chartBox">
                        <div className="chartSection">
                            <h3 className="head_text_1">No Of Sales</h3>
                            {/* <Chart type="doughnut" data={chartData} options={lightOptions} /> */}
                            <div className="circle_chart_1" 
                            style={{borderRightColor: (salesno > 0)?'#0a0600':'#dee2e6',borderTopColor: (salesno > 0)?'#0a0600':'#dee2e6',borderBottomColor: (salesno > 0)?'#0a0600':'#dee2e6',borderLeftColor: (salesno > 0)?'#0a0600':'#dee2e6'}}>
                                <PhoneAndroidOutlinedIcon className="icon_1"></PhoneAndroidOutlinedIcon>
                                <div className="text_1"> {salesno} </div>
                            </div>
                        </div>
                        <div className="chartSection">
                            <h3 className="head_text_2">No Of Purchase</h3>
                            <div className="circle_chart_2"
                            style={{borderRightColor: (purchaseno > 0)?'#0a0600':'#dee2e6',borderTopColor: (purchaseno > 0)?'#0a0600':'#dee2e6',borderBottomColor: (purchaseno > 0)?'#0a0600':'#dee2e6',borderLeftColor: (purchaseno > 0)?'#0a0600':'#dee2e6'}}>
                                <PhoneAndroidOutlinedIcon className="icon_2"></PhoneAndroidOutlinedIcon>
                                <div className="text_2">
                                  {purchaseno}
                                </div>
                            </div>
                        </div>
                        <div className="chartSection">
                            <h3 className="head_text_3">No Of Vouchers</h3>
                            <div className="circle_chart_3"
                            style={{borderRightColor: (voucher > 0)?'#0a0600':'#dee2e6',borderTopColor: (voucher > 0)?'#0a0600':'#dee2e6',borderBottomColor: (voucher > 0)?'#0a0600':'#dee2e6',borderLeftColor: (voucher > 0)?'#0a0600':'#dee2e6'}}>
                                <VisibilityOutlinedIcon className="icon_3"></VisibilityOutlinedIcon>
                                <div className="text_3">
                                  {voucher}
                                </div>
                            </div>
                        </div>
                        <div className="chartSection">
                            <h3 className="head_text_4">No Of Schems</h3>
                            <div className="circle_chart_4"
                            style={{borderRightColor: (scheme > 0)?'#0a0600':'#dee2e6',borderTopColor: (scheme > 0)?'#0a0600':'#dee2e6',borderBottomColor: (scheme > 0)?'#db30cd':'#dee2e6',borderLeftColor: (scheme > 0)?'#db30cd':'#dee2e6'}}>
                                <AttachMoneyOutlinedIcon className="icon_4"></AttachMoneyOutlinedIcon>
                                <div className="text_4">
                                  {scheme}
                                </div>
                            </div>
                        </div>
                    </div>
          </div>
        </Card>

        {/* <Card className="graphView" style={{width:'97%',marginTop: '10px'}}>
          <div className="graphBoxHead">
            Core 1 Data
          </div>
          <div style={{width:'90%', height: '400px',padding:'10px',backgroundColor: 'white',margin: '20px'}}>
            <ChatPage />
          </div>
        </Card> */}
        
      </div>
      <Footer />
    </div>
  );
}

export default Home;
