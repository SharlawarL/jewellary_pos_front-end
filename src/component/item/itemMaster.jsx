import React, { Component } from 'react'

//internal css
import '../../assets/css/style.css';
import {  Button } from '@material-ui/core';
import { Loading  } from "react-loading-ui";

//internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//libraries
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'react-toastify/dist/ReactToastify.css';

//prime react
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';



//service 
import ItemService from '../../service/item/itemService'
const itemService = new ItemService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            category: [],
            itemType: [
                { name: 'Gold', code: 'Gold' },
                { name: 'Silver', code: 'Silver' },
                { name: 'Diamond', code: 'Diamond' },
                { name: 'Platinum', code: 'Platinum' },
                { name: 'Others', code: 'Others' },
            ],
            priceType: [
                { name: 'Weight Wise Rate', code: 'Weight Wise Rate' },
                { name: 'Piece Wise Rate', code: 'Piece Wise Rate' }
            ],
            selectedPriceType: { name: 'Weight Wise Rate', code: 'Weight Wise Rate' },
            errors: {},
            name: '',
            location: '',
            selectedCategory: '',
            selecteditemType: '',
            purity: JSON.parse(localStorage.getItem('purity')),
            makingCharges: '',
            wastage: '',
            hsnCode: '',
            selectedPurity: [],
            price: '',
            last_id: 0,
            last_item: 0,
            tax_per : 0,
        }

        this.getLastItem()
        this.getItemPurity() 
        this.getDropCategoryItem()
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getLastItem() {

        Loading();

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getLastItem(data).then((response) => {
            if (response['data']['status'] === 1) {
                Loading();
                this.setState({
                    last_id: response['data']['data']['last_id'],
                    last_item: response['data']['data']['item_no']
                })
            }
      }).catch((error) => {
            Loading();
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }

    getDropCategoryItem() {

        let data = { 
            login_user: localStorage.getItem("username"), 
            branch: localStorage.getItem("Branch") ,
            type : 'item-category'
        }

        itemService.getDropItem(data).then((response) => {
            if (response['data']['status'] === 1) {
                response['data']['data'].map(data =>{
                    data['name'] =  data['category']
                    data['value'] =  data['category']
                })
                this.setState({
                    category : response['data']['data']
                })
            }
      }).catch((error) => {
            // console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    getItemPurity() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getItemPurity(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    purity: response['data']['data']
                })
            }
        }).catch((error) => {
            // console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    submitForm(e) {
        e.preventDefault()

        Loading();

        if (this.validate()) {
            const {
                name,
                last_item,
                location,
                selectedCategory,
                selecteditemType,
                purity,
                makingCharges,
                wastage,
                hsnCode,
                selectedPriceType,
                tax_per,
                price,
                selectedPurity
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                name: name?name:'',
                location: location?location:'',
                category: selectedCategory?selectedCategory:'',
                itemType: selecteditemType?selecteditemType.code:'',
                purity: selectedPurity?selectedPurity.code:'',
                makingCharges: makingCharges?makingCharges:'',
                wastage: wastage?wastage:'',
                hsnCode: hsnCode?hsnCode:'',
                priceType: selectedPriceType?selectedPriceType.code:'',
                price: price?price:''
            }


            itemService.saveItem(data).then((response) => {
                Loading();
                if (response['data']['status'] === 1) {
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    this.toast.show({severity:'success', summary: 'Message', detail:response['data']['message'], life: 3000});
                    this.setState({
                        success: true,
                        last_item: Number(last_item) + 1
                    });
                    this.clearForm();
                } else {
                    // toast.error(response['data']['message']);
                    this.toast.show({severity:'error', summary: 'Message', detail:response['data']['message'], life: 3000});
                    this.setState({
                        loggedIn: false,
                    });
                }
            }).catch((error) => {
                // console.log(error)
                Loading();
            })
        }
    }

    validate() {
        let name = this.state.name;
        let errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors["name"] = "Enter Item Name.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (e) => {
        // console.log(e.target.value)
        this.setState({
            selectedCategory: e.target.value
        })
    };

    handleChangeItemType = (newValue) => {
        
        this.setState({
            selecteditemType: newValue.value
        })
    };

    handleChangePriceType = (newValue) => {
        // console.log(newValue)
        this.setState({
            selectedPriceType: newValue.value
        })
    };

    handleChangePurity = (newValue) => {
        // console.log(newValue)
        this.setState({
            selectedPurity: newValue.value
        })
    };

    clearForm = () =>{
        this.setState({
            name: '',
            location: '',
            selectedCategory: '',
            selecteditemType: '',
            purity: JSON.parse(localStorage.getItem('purity')),
            makingCharges: '',
            wastage: '',
            hsnCode: '',
            selectedPriceType: { name: 'Weight Wise Rate', code: 'Weight Wise Rate' },
            selectedPurity: [],
            price: '',
        })
    }

    items = () =>(
        () =>
        this.state.category.map((oneItem) => ({
            // required: what to show to the user
            label: oneItem.name,
            // required: key to identify the item within the array
            key: oneItem.code,
            // feel free to add your own app logic to access those properties in the onSelect function
            someAdditionalValue: oneItem.someAdditionalValue,
            // or just keep everything
            ...oneItem,
          })),
        [this.state.category]
      );


    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        if (this.state.success) {
            // return <Redirect to='/item-category-list'></Redirect>
        }

        if(this.state.purity)
            this.state.purity.map((data) => {
                return (data['name'] = data['purity'], data['code'] = data['purity'])
            })


        const price = this.state.selectedPriceType.name;
        let comp;

        var optionValue = '';
        
        this.state.category.map( data =>{
            optionValue = optionValue + '<option value="hello"></option>';
            // console.log()
        })

        if (price === 'Piece Wise Rate') {

            comp = <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Price</div>
                            <InputText id="username1" placeholder="Enter Price" aria-describedby="username1-help" style={{width:'70%'}} name="price" value={this.state.price} onChange={this.onChange}/>
                            <div className="textDanger">{this.state.errors.name}</div>
                        </div>
                    </div>

        } else {

            comp = <h1> </h1>

        }

        

        return (
            <div className="body">
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn={this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Item Master </h3>
                </div>
                <div className="continerSmallBox">    
                    {/* <div className="row">
                        <div className="col-6">
                            Item Number : {this.state.last_item}
                        </div>
                    </div> */}
                    
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Code</div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'70%'}} name="last_item" value={this.state.last_item} onChange={this.onChange} disabled />
                                <div className="textDanger">{this.state.errors.code}</div>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Name</div>
                                <div style={{width: '100%'}}>
                                    <InputText id="username1" placeholder="Enter Item Name" aria-describedby="username1-help" style={{width:'70%'}} name="name" value={this.state.name}  onChange={this.onChange}/>
                                    
                                    <div className="textDanger">{this.state.errors.name}</div>
                                        
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Category </div>
                                        <input list="browsers" placeholder="Enter Categery" style={{width:'70%',border:'1px solid silver',borderRadius:'3px',padding:'5px 10px'}} id="browser" name="selectedCategory" value={this.state.selectedCategory}  onChange={this.onChange} />
                                        <datalist id="browsers" >
                                            {  
                                                this.state.category.map((item,index)=>{
                                                    return  <option key={index} value={item.name} />;
                                                })
                                            }
                                        </datalist>
                                
                                <div className="textDanger">{this.state.errors.selectedCategory}</div>
                            </div>
                        </div>

                        
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Type</div>
                                <Dropdown style={{width:'70%'}} value={this.state.selecteditemType} options={this.state.itemType} onChange={this.handleChangeItemType} optionLabel="name" placeholder="Select Item Type" />
                                <div className="textDanger">{this.state.errors.selecteditemType}</div>
                            </div>
                        </div>
                       
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Purity</div>
                                <Dropdown style={{width:'70%'}} value={this.state.selectedPurity} options={this.state.purity} onChange={this.handleChangePurity} optionLabel="name" placeholder="Select Purity" />
                                <div className="textDanger">{this.state.errors.purity}</div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Making Charges</div>
                                <InputText id="username1" placeholder="Enter Making Charges" aria-describedby="username1-help" style={{width:'70%'}} name="makingCharges" value={this.state.makingCharges} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.makingCharges}</div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Wastage %</div>
                                <InputText id="username1" placeholder="Enter Wastage %" aria-describedby="username1-help" style={{width:'70%'}} name="wastage" value={this.state.wastage} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.wastage}</div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Location</div>
                                <InputText id="username1" placeholder="Enter Location" aria-describedby="username1-help" style={{width:'70%'}} name="location" value={this.state.location} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.location}</div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>HSN Code</div>
                                <InputText id="username1" placeholder="Enter HSN Code" aria-describedby="username1-help" style={{width:'70%'}} name="hsnCode" value={this.state.hsnCode} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.hsnCode}</div>
                            </div>
                        </div>


                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Price Type </div>
                                <Dropdown style={{width:'70%'}} value={this.state.selectedPriceType} options={this.state.priceType} onChange={this.handleChangePriceType} optionLabel="name" placeholder="Select Price Type" />
                                <div className="textDanger">{this.state.errors.selectedPriceType}</div>
                            </div>
                        </div>
                        
                        {comp}

                </div>
                <div className="button_box_small">
                    <div className="row">
                        <div className="col-6">
                            <Button type="submit" className="inputData buttonPrimary" variant="contained" onClick={this.submitForm}>
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