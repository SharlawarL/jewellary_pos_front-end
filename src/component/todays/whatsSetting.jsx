import React,{ Component } from 'react'

//internal css
import '../../assets/css/style.css';
import {  Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";

// internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//prime-react
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

//toast notification
import 'react-toastify/dist/ReactToastify.css';

//service
import CompanyService from '../../service/company/companyService'
const companyService = new CompanyService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            branchname:'',
            item_type:'',
            gold:'',
            silver:'',
            type:'',
            bname: 'Save',
            option: { name : "No" , code: "No"},
            optionList : [
                { name : "Yes" , code: "Yes"},
                { name : "No" , code: "No"},
            ],
            apiKey:''
        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        this.getDefaultValue()
      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    getDefaultValue() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        companyService.getDefaultWTValue(data).then((response) => {
            if (response['data']['status'] === 1) {
                let data = response['data']['data'][0]
                this.setState({
                    type: 'update',
                    bname:'Update',
                    option    : { name : data['sms_option'] , code : data['sms_option']},
                    apiKey    : data['api_key'] 
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }

      submitForm(e){
        e.preventDefault()
        const { 
            type,
            option,
            apiKey
        } = this.state

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: (type === 'update')?'update':'new',
            option        :option?option.name:'.',
            apiKey        :apiKey?apiKey:'.',
        }
        
        companyService.saveDefaultWTValue(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                // toast.success(response['data']['message']);
                // NotificationManager.success('Success message', response['data']['message']);
                // this.setState({
                //     success: true,
                // });
                // this.clearForm();
            } else {
                this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
                // toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    clearForm = () =>{
        this.setState({
            branchname:'',
            item_type:'',
            selectedPurity:'',
            price:''
        })
    }

    handleChangeItemType = (newValue) => {
        
        this.setState({
            item_type: newValue.value
        })
    };

    handleChangePurity = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPurity: newValue.value
        })
    };

    render(){

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        // if(this.state.success)
        // {
        //     return <Redirect to='/web-setting'></Redirect>
        // }

        return(
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer/> */}
                <Menu loggedIn = { this.state.loggedIn} />
                <form onSubmit = {this.submitForm} autoComplete="off"> 
                
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Whats App Setting</h3>
                </div>

                <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Whatsapp Message  </div>
                                <Dropdown style={{width:'100%'}} value={this.state.option} options={this.state.optionList} onChange={(e) => this.setState({ option : e.target.value})} optionLabel="name" placeholder="Select SMS Option" />
                                {/* <InputText id="username1" placeholder="Enter Bill Format" aria-describedby="username1-help" style={{width:'100%'}} name="bformat" value={this.state.bformat} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>API key</div>
                                <InputText id="username1" placeholder="Enter API Key" aria-describedby="username1-help" style={{width:'100%'}} name="apiKey" value={this.state.apiKey} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            
                        </div>
                        
                </div>
                <div className="button_box_small">
                            <div className="row">
                                    <div className="col-6">
                                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> Save / Update </div>
                                        </Button>
                                        
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6">
                                        <Link to="/home" style={{textDecoration:'none'}}>
                                            <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                                <div className="buttonText"> <i className="pi pi-home"></i> Home  </div>
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