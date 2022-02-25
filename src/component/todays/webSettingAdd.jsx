import React,{ Component } from 'react'

import {  Button   } from '@material-ui/core';

//internal css
import '../../assets/css/style.css';

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//prime react
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer} from 'react-notifications';


//service
import CompanyService from '../../service/company/companyService'
import ItemService from '../../service/item/itemService'

//object of services
const itemService = new ItemService();
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
            purity:'',
            price:'',
            error :'',

            itemType: [
                { name: 'Gold', code: 'Gold' },
                { name: 'Silver', code: 'Silver' },
                { name: 'Diamond', code: 'Diamond' },
                { name: 'Platinum', code: 'Platinum' },
                { name: 'Others', code: 'Others' },
            ],
            selectedPurity:{}

        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        this.getItemPurity()
      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    getItemPurity() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getItemPurity(data).then((response) => {
            if (response['data']['status'] === 1) {
                response['data']['data'].map(data =>{
                    data['name'] = data['purity']
                    data['code'] = data['purity']
                    return data;
                })
                this.setState({
                    purity: response['data']['data']
                })
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }



      submitForm(e){
        e.preventDefault()

        const { item_type, price,selectedPurity } = this.state

        let data = {
            username : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"), 
            item_type : item_type.name,
            purity: selectedPurity.name,
            price: price
        }
        
        companyService.saveTodaysValue(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
                toast.success(response['data']['message']);
                // NotificationManager.success('Success message', response['data']['message']);
                // this.setState({
                //     success: true,
                // });
                this.clearForm();
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
                <ToastContainer />
                <NotificationContainer/>
                <Menu loggedIn = { this.state.loggedIn} />
                <form onSubmit = {this.submitForm} autoComplete="off"> 
                
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Add Todays Value</h3>
                </div>

                <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Type</div>
                                <Dropdown style={{width:'100%'}} value={this.state.item_type} options={this.state.itemType} onChange={this.handleChangeItemType} optionLabel="name" placeholder="Select Item Type" />
                                {/* <InputText id="username1" placeholder="Enter Item Type" aria-describedby="username1-help" style={{width:'100%'}} name="item_type" value={this.state.item_type} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Purity</div>
                                <Dropdown style={{width:'100%'}} value={this.state.selectedPurity} options={this.state.purity} onChange={this.handleChangePurity} optionLabel="name" placeholder="Select Purity" />
                                {/* <InputText id="username1" placeholder="Enter Purity" aria-describedby="username1-help" style={{width:'100%'}} name="purity" value={this.state.purity} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Price</div>
                                <InputText id="username1" placeholder="Enter Price" aria-describedby="username1-help" style={{width:'100%'}} name="price" value={this.state.price} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                        </div>
                        
                </div>
                <div className="button_box_small">
                            <div className="row">
                                    <div className="col-6">
                                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                        </Button>
                                        
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                </form>
                <Footer />
            </div>
        )
    }
}