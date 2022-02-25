import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'


//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeflex/primeflex.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';


//service 
import SchemaService from '../../service/schema/schemaService'

//object of services
const schemaService = new SchemaService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            displayBasic: false,
            schema :{},
            sname :''
        }
        this.getSchema();
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.confirmDeleted = this.confirmDeleted.bind(this)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getSchema()
    {
        let data = {
            username : localStorage.getItem("username")
        }

        schemaService.getSchema(data).then((response) =>{
            if(response['data']['status'] === 1)
            {
                toast.success(response['data']['message']);
                this.setState({
                    schema: response['data']['data'],
                });
            } else {
                toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }



    submitForm(e) {
        e.preventDefault()

        
        const { sname } = this.state

        let data = {
            username : localStorage.getItem("username"), 
            branch : localStorage.getItem("branch") ,
            sname: sname
        }

        schemaService.saveSchema(data).then((response) =>{
            if(response['data']['status'] === 1)
            {
                toast.success(response['data']['message']);
                this.setState({
                    success: true,
                    [`displayBasic`]: false
                });
                this.getSchema()
            } else {
                toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                    [`displayBasic`]: false
                });
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    confirmDeleted(e){
        e.preventDefault()
        console.log(e)
    }


    onClick(name, position) {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    renderFooter(name) {
        return (
            <div>
                <Button label="Close" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-text" />
                <Button label="Save" icon="pi pi-check" onClick={this.submitForm} autoFocus />
            </div>
        );
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"  />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"  onClick={() => this.confirmDeleted} />
            </React.Fragment>
        );
    }


    render() {

        return (
            <div className="body">
                <ToastContainer />
                <Menu loggedIn={this.state.loggedIn} />
                <div className="continerSmallBoxHeight">
                    <div className="p-grid">
                        <div className="p-col-10">
                            <h3 className="pageTitle">Scheme Name Master</h3>
                        </div>
                        <div className="p-col-2">
                            <Button label="New" icon="pi pi-plus-circle" onClick={() => this.onClick('displayBasic')} />
                        </div>
                    </div>
                    <div style={{ height: '400px' }}>
                        <DataTable value={this.state.schema} paginator rows={4}
                            className="p-datatable-customers" emptyMessage="No Search Result.">
                            <Column field="sname" style={{width:'80%'}} header="Scema name" />
                            <Column body={this.actionBodyTemplate}></Column>
                        </DataTable>
                    </div>

                </div>
                <Footer />

                <Dialog header="New Scheme Name Master" visible={this.state.displayBasic} style={{ width: '50vw' }} footer={this.renderFooter('displayBasic')} onHide={() => this.onHide('displayBasic')}>
                    <div className="p-field">
                        <label htmlFor="username1" className="p-d-block">Name</label>
                        <InputText id="username1" name="sname" value={this.state.sname} aria-describedby="username1-help" className="p-d-block" style={{ width: '100%' }} onChange={this.onChange} />
                    </div>
                </Dialog>
            </div>
        )
    }
}