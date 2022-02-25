import React,{ Component } from 'react'
import '../../assets/css/style.css';
import {   Link   } from "react-router-dom";
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import ReactToPrint from 'react-to-print';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

//json
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import NumberFormat from 'react-number-format';

import PrintIcon from '@material-ui/icons/Print';
import Logo from '../../assets/img/skj_logo.png';

import { PrimeIcons } from 'primereact/api';
import 'primeflex/primeflex.css';

//service 
import SalesService from '../../service/sales/salesService'

//object of services
const salesService = new SalesService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            data: props.location.state['data'],
            from: props.location.state['from'],
            to: props.location.state['to'],
        }
        this.onChange = this.onChange.bind(this)

      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    

    render(){

        const shopName = localStorage.getItem("shopName");

        const branch = localStorage.getItem("Branch");

        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                
                <div className="continerPrintBox card-box">
                    <div style={{padding:'20px'}}  ref={el => (this.componentRef = el)}>
                        <div className="p-grid">
                            {/* <div className="p-col-2" style={{textAlign:'center'}}>
                                <img alt="Loading"  src={Logo} style={{ marginTop:'0px', backgroundColor:'white', borderRadius:'30px', border:'1px solid silver'}} width="60px" height="60px"/>
                            </div> */}
                            <div className="p-col-12" style={{textAlign:'center',padding: '10px 20px 20px'}}>
                                <h3 style={{color:'black',textShadow:'none',margin:'0px 0px 5px'}}> {shopName} </h3> 
                                <div style={{color:'black',textShadow:'none',margin:'0px 0px 5px'}}> {branch} </div>
                                <div style={{color:'black',textShadow:'none'}}> 
                                    Sales Summary ( {this.state.from} - {this.state.to})
                                </div>

                            </div>
                        </div>
                            <div style={{ marginTop: '-5px' }}>
                                <DataTable  value={this.state.data} className="p-datatable-striped"  emptyMessage="No Search Result." >
                                    <Column field="cashier"    header="Cashier" />
                                    <Column field="billcount"  style={{ width:'130px',textAlign:'right'}} header="No of Bills" />
                                    <Column field="Cash"       style={{ textAlign:'right' }} header="Cash" />
                                    <Column field="Card"       style={{ textAlign:'right' }} header="Card" />
                                    <Column field="Credit"     style={{ textAlign:'right'}} header="Credit" />
                                    <Column field="Others"     style={{ textAlign:'right' }} header="Others" />
                                    <Column field="Total"     style={{  textAlign:'right' }} header="Total" />
                                </DataTable>
                            </div>
                    </div>
                </div>
                <div style={{width:'74%',padding:'10px',margin: '0px auto'}}>
                    <div className="p-grid">
                        <div className="p-col-8"></div>
                        <div className="p-col-2">
                            <Link to="/sales-daily-report" className="Link">
                                <Button className="inputData buttonSecondary" variant="contained" style={{ width: '95%', textAlign: 'center' }}>
                                    <div className="buttonText"> <i className="pi pi-refresh"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="p-col-2">
                                <ReactToPrint
                                    trigger={() => {
                                        return  <Button className="inputData buttonSecondary" variant="contained" style={{ width: '90%', textAlign: 'center' }}>
                                        <div className="buttonText"> <i className="pi pi-print"></i> <span className="buttonTextFirstLetter">P</span>rint</div>
                                    </Button>;
                                    }}
                                    content={() => this.componentRef}
                                    />
                            </div>
                        </div>
                </div>
                <Footer />
            </div>
        )
    }
}