import React, { Component } from 'react'
//libraries
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";

//internal css
import '../../assets/css/style.css';

// internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';

//json
import { Toast } from 'primereact/toast';
import { Redirect } from 'react-router-dom';

//service
import CompanyService from '../../service/company/companyService'
const companyService = new CompanyService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: props.location.state['branch'],
            item_type: props.location.state['item_type'],
            purity: props.location.state['purity'],
            price: props.location.state['price'],
            branch: props.branch,
            id: props.location.state['id']
        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    submitForm(e) {
        e.preventDefault()
        const { branchname, item_type, purity, price } = this.state

        let data = {
            username: localStorage.getItem("username"),
            branchname: branchname,
            item_type: item_type,
            purity: purity,
            price: price,
        }

        companyService.updateTodaysValue(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.toast.show({ severity: 'success', summary: 'Success', detail: response['data']['message'], life: 3000 });
                this.setState({
                    success: true,
                });
            } else {
                this.toast.show({ severity: 'error', summary: 'Error', detail: response['data']['message'], life: 3000 });
                this.setState({
                    loggedIn: false,
                });
            }
        }).catch((error) => {
            this.toast.show({ severity: 'error', summary: 'Error', detail: 'Check Connection', life: 3000 });
        })

    }

    clearForm = () => {
        this.setState({
            branchname: '',
        })
    }

    render() {

        const fontLebel = { padding: '10px 0px 10px', fontSize: '13px' }

        if (this.state.success) {
            return <Redirect to='/web-setting'></Redirect>
        }

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />

                <Menu loggedIn={this.state.loggedIn} />

                <form onSubmit={this.submitForm} autoComplete="off">

                    <div className="button_box_small_title">
                        <h3 className="pageTitle">Update Values</h3>
                    </div>

                    <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Type</div>
                                <InputText id="username1" placeholder="Enter Item Type" aria-describedby="username1-help" style={{ width: '100%' }} name="item_type" value={this.state.item_type} onChange={this.onChange} disabled />
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Purity</div>
                                <InputText id="username1" placeholder="Enter Purity" aria-describedby="username1-help" style={{ width: '100%' }} name="purity" value={this.state.purity} onChange={this.onChange} disabled />
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Price</div>
                                <InputText id="username1" placeholder="Enter Price" aria-describedby="username1-help" style={{ width: '100%' }} name="price" value={this.state.price} onChange={this.onChange} />
                            </div>
                        </div>

                    </div>
                    <div className="button_box_small">
                        <div className="row">
                            <div className="col-6">
                                <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                    <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">U</span>pdate</div>
                                </Button>

                            </div>
                            <div className="col-1"></div>
                            <div className="col-6">
                                <Link to="/web-setting" className="Link">
                                    <Button className="inputData buttonSecondary" variant="contained">
                                        <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">B</span>ack</div>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
                <Footer />
            </div>
        )
    }
}