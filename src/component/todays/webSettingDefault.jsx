import React,{ Component } from 'react'
//libraries
import {  Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";
import { Loading  } from "react-loading-ui";

//internal css
import '../../assets/css/style.css';

// internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//prime react
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

//toast notification
import 'react-toastify/dist/ReactToastify.css';


//service 
import ItemService from '../../service/item/itemService'
const itemService = new ItemService();

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
            bname: 'Save'
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

        Loading();

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getDefaultValue(data).then((response) => {
            Loading();
            if (response['data']['status'] === 1) {
                var gold = 0;
                var silver = 0;
                response['data']['data'].map(data =>{
                    if(data['iname'] === 'gold' )
                    {
                        gold = data['price']
                    }
                    if(data['iname'] === 'silver' )
                    {
                        silver = data['price']
                    }
                    return data;
                })
                this.setState({
                    gold: gold,
                    silver: silver,
                    type: 'update',
                    bname:'Update'
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }



      submitForm(e){
        e.preventDefault()
        const { type, gold, silver } = this.state

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"), 
            type: (type === 'update')?'update':'new',
            gold: gold,
            silver : silver
        }
        
        itemService.saveDefaultValue(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                // toast.success(response['data']['message']);
                // NotificationManager.success('Success message', response['data']['message']);
                // this.setState({
                //     success: true,
                // });
                this.clearForm();
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
                    <h3 className="pageTitle">Deafult Value's</h3>
                </div>

                <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Gold</div>
                                <InputText id="username1" placeholder="Enter Gold Price" aria-describedby="username1-help" style={{width:'100%'}} name="gold" value={this.state.gold} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Silver</div>
                                <InputText id="username1" placeholder="Enter Silver Price" aria-describedby="username1-help" style={{width:'100%'}} name="silver" value={this.state.silver} onChange={this.onChange}/>
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