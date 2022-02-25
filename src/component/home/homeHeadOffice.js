import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/style.css';
//pages
import { Redirect } from 'react-router-dom';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//card
import Card from '@material-ui/core/Card';
import NumberFormat from 'react-number-format';
// import { Chart } from 'primereact/chart';

import '../../assets/css/chart.css';

import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import backImg3 from '../../assets/img/graph-yellow.svg';

import CompanyService from '../../service/company/companyService'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

//object of services
const companyService = new CompanyService();

function Home(props) {

  const toast = useRef(null);

  const [goldRate, setGoldRate] = useState(0);
  const [silverRate, setSilverRate] = useState(0);
  const [sales, setSales] = useState(0);
  const [items, setItems] = useState(0);


  const [salesno, setSalesNO] = useState(0);
  const [purchaseno, setPurchaseNO] = useState(0);
  const [voucher, setVoucher] = useState(0);
  const [scheme, setScheme] = useState(0);
  const [totalBranch, settotalBranch] = useState(null);
  const [salesReport, setSalesReport] = useState([]);
  const [purchaseReport, setPurchaseReport] = useState([]);

  const [orderReport, setOrderReport] = useState([]);
  const [unorderReport, setUnOrderReport] = useState([]);
  const [overReport, setOverReport] = useState([]);

  const [schemeReport, setSchemeReport] = useState([]);

  const [totalBranchTemp, settotalBranchTemp] = useState(null);

  // ****** BEGINNING OF CHANGE ******
  useEffect(() => {
    getRates();
  }, []);


  const getRates = () => {

    let data = {
      login_user: localStorage.getItem("username"),
      branch: localStorage.getItem("Branch"),
    }

    companyService.getAdminHome(data).then((response) => {
      console.log(response)
      if (response['data']['status'] === 1) {
        //total
        setGoldRate(Number(response['data']['data']['sales']));
        setSilverRate(Number(response['data']['data']['purchase']));
        setSales(response['data']['data']['scheme']);
        setItems(response['data']['data']['voucher']);

        //charts
        setSalesNO(response['data']['data']['total-branch']);
        setPurchaseNO(response['data']['data']['scheme_no']);
        setVoucher(response['data']['data']['c_count']);
        setScheme(response['data']['data']['users']);

        settotalBranch(response['data']['data']['branch'])

        setSalesReport(response['data']['data']['sales-list'])
        setPurchaseReport(response['data']['data']['purchase-list'])
        setOrderReport(response['data']['data']['order-list'])
        setUnOrderReport(response['data']['data']['unorder-list'])

        setSchemeReport(response['data']['data']['scheme-list'])
        setOverReport(response['data']['data']['overdues'])
      }
    }).catch((error) => {
      console.log(error)
      // toast.current.show({ severity: 'error', summary: 'Message', detail: 'Check Connection', life: 3000 });
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

  const header = (
    <div className="table-header">
        Sale's Reports
        {/* <Button icon="pi pi-refresh" /> */}
    </div>
);


  return (
    <div className="body">
      <Menu loggedIn={props.loggedIn} />
      <div className="continerTranferentBox">

        {/* Card details */}
        <div className="cardBox">
          <div className="card" >
            <div className="overview-box overview-box-1">
              <h1>Today Sales</h1>
              <div className="overview-value">
                {goldRate}
              </div>
              {/* <div className="overview-ratio">
                  <div className="overview-direction">
                    <ImportExportOutlinedIcon/>
                  </div>
                  <div className="overview-ratio-value">
                    51%
                  </div>
                </div> */}
              <img src={backImg3} alt="apollo-layout" />
            </div>
          </div>
          <div className="card" >
            <div className="overview-box overview-box-2">
              <h1>Today Purchase</h1>
              <div className="overview-value">
                {silverRate}
              </div>
              {/* <div className="overview-ratio">
                    <div className="overview-direction">
                      <ImportExportOutlinedIcon/>
                    </div>
                    <div className="overview-ratio-value">
                      36%
                    </div>
                  </div> */}
              <img src={backImg3} alt="apollo-layout" />
            </div>
          </div>
          <div className="card" >
            <div className="overview-box overview-box-3">
              <h1>Today Schemes</h1>
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
            <div className="overview-box overview-box-4" style={{ marginRight: '0px' }}>
              <h1>Today Orders</h1>
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
        <Card className="graphView" style={{ width: '100%' }}>
          <div className="graphBoxHead">
            Today's Status
          </div>
          <div classname="statusBoxDash">
            <div className="chartBox">
              <div className="chartSection">
                <h3 className="head_text_1">Total Branches</h3>
                {/* <Chart type="doughnut" data={chartData} options={lightOptions} /> */}
                <div className="circle_chart_1"
                  style={{ borderRightColor: (salesno > 0) ? 'black' : 'black', borderTopColor: (salesno > 0) ? 'black' : 'black', borderBottomColor: (salesno > 0) ? 'black' : 'black', borderLeftColor: (salesno > 0) ? 'black' : 'black' }}>
                  <AccountTreeIcon className="icon_1"></AccountTreeIcon>
                  <div className="text_1"> {salesno} </div>
                </div>
              </div>
              <div className="chartSection">
                <h3 className="head_text_2">Total Schemes</h3>
                <div className="circle_chart_2"
                  style={{ borderRightColor: (purchaseno > 0) ? 'black' : 'black', borderTopColor: (purchaseno > 0) ? 'black' : 'black', borderBottomColor: (purchaseno > 0) ? 'black' : 'black', borderLeftColor: (purchaseno > 0) ? 'black' : 'black' }}>
                  <SpeakerNotesIcon className="icon_2"></SpeakerNotesIcon>
                  <div className="text_2">
                    {purchaseno}
                  </div>
                </div>
              </div>
              <div className="chartSection">
                <h3 className="head_text_3">Total Customers</h3>
                <div className="circle_chart_3"
                  style={{ borderRightColor: (voucher > 0) ? 'black' : 'black', borderTopColor: (voucher > 0) ? 'black' : 'black', borderBottomColor: (voucher > 0) ? 'black' : 'black', borderLeftColor: (voucher > 0) ? 'black' : 'black' }}>
                  <SupervisedUserCircleIcon className="icon_3"></SupervisedUserCircleIcon>
                  <div className="text_3">
                    {voucher}
                  </div>
                </div>
              </div>
              <div className="chartSection">
                <h3 className="head_text_4">Total Users</h3>
                <div className="circle_chart_4"
                  style={{ borderRightColor: (scheme > 0) ? 'black' : 'black', borderTopColor: (scheme > 0) ? 'black' : 'black', borderBottomColor: (scheme > 0) ? 'black' : 'black', borderLeftColor: (scheme > 0) ? 'black' : 'black' }}>
                  <AccountCircleIcon className="icon_4"></AccountCircleIcon>
                  <div className="text_4">
                    {scheme}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div style={{ display: 'flex' }}>
          <Card className="graphView" style={{ width: '50%' }}>
            <div className="graphBoxHead">
              Sales
            </div>
              <DataTable value={salesReport} style={{minHeight:'200px',backgroundColor:'white'}}>
                    <Column field="branch" header="Branch" ></Column>
                    <Column field="count" style={{textAlign:'center'}} header="No Of Bills" ></Column>
                    <Column field="net" style={{textAlign:'right'}} header="Amount" ></Column>
              </DataTable>
          </Card>
          <div style={{ width: '1%' }}></div>
          <Card className="graphView" style={{ width: '50%' }}>
            <div className="graphBoxHead">
              Purchase
            </div>
              <DataTable value={purchaseReport} style={{minHeight:'200px',backgroundColor:'white'}}>
                    <Column field="branch" header="Branch" ></Column>
                    <Column field="count" style={{textAlign:'center'}} header="No Of Bills" ></Column>
                    <Column field="net" style={{textAlign:'right'}} header="Amount" ></Column>
              </DataTable>
          </Card>
        </div>
        <div style={{ display: 'flex' }}>
        <Card className="graphView" style={{ width: '50%' }}>
            <div className="graphBoxHead">
              Scheme
            </div>
              <DataTable value={schemeReport} style={{minHeight:'200px',backgroundColor:'white'}}>
                    <Column field="branch" header="Branch" ></Column>
                    <Column field="sno"  header="No Of Scheme"></Column>
              </DataTable>
          </Card>
          <div style={{ width: '1%' }}></div>
          <Card className="graphView" style={{ width: '50%' }}>
            <div className="graphBoxHead">
              Orders
            </div>
              <DataTable value={orderReport} style={{minHeight:'200px',backgroundColor:'white'}}>
                    <Column field="branch" header="Branch"></Column>
                    <Column field="sno" header="No Of Orders"></Column>
                    <Column field="tot" style={{textAlign:'right'}} header="Amount" ></Column>
              </DataTable>
          </Card>
          </div>

          <div style={{ display: 'flex' }}>
        <Card className="graphView" style={{ width: '50%' }}>
            <div className="graphBoxHead">
            Overdues
            </div>
              <DataTable value={overReport} style={{minHeight:'200px',backgroundColor:'white'}}>
                    <Column field="branch" header="Branch" ></Column>
                    <Column field="No_of_Overdues" header="No Of Dues"></Column>
                    <Column field="Overdue_Amount" style={{textAlign:'right'}} header="Amount"></Column>
              </DataTable>
          </Card>
          <div style={{ width: '1%' }}></div>
          <Card className="graphView" style={{ width: '50%' }}>
            <div className="graphBoxHead">
              Undelivered Orders
            </div>
              <DataTable value={unorderReport} style={{minHeight:'200px',backgroundColor:'white'}}>
                    <Column field="branch" header="Branch"></Column>
                    <Column field="sno" style={{textAlign:'center'}} header="No Of Orders"></Column>
                    <Column field="bal" style={{textAlign:'right'}} header="Amount" ></Column>
              </DataTable>
          </Card>
          </div>
        

      </div>
      <Footer />
    </div>
  );
}

export default Home;
