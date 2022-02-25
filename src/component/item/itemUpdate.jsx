import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'


//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';


//service 
import ItemService from '../../service/item/itemService'

//object of services
const itemService = new ItemService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            category: [
                { name: 'BANGLES', code: 'BANGLES' },
                { name: 'RING', code: 'RING' },
                { name: 'STUD', code: 'STUD' },
                { name: 'JIMKKI', code: 'JIMKKI' },
                { name: 'NECKLACES', code: 'NECKLACES' },
                { name: 'AARAM', code: 'AARAM' },
                { name: 'BRACELET', code: 'BRACELET' },
                { name: 'CHAIN', code: 'CHAIN' },
                { name: 'ANKLET', code: 'ANKLET' },
                { name: 'OTHER', code: 'OTHER' },
            ],
            itemType: [
                { name: 'Gold', code: 'Gold' },
                { name: 'Silver', code: 'Silver' },
                { name: 'Diamond', code: 'Diamond' },
                { name: 'Platinum', code: 'Platinum' },
                { name: 'Others', code: 'Others' },
            ],
            priceType: [
                { name: 'Weight Wise Rate', code: 'Weight Wise Rate' },
                { name: 'Piece Wise Rate', code: 'Piece Wise Rate' },
            ],
            errors: {},
            name: props.location.state['itemName'],
            location: props.location.state['location'],
            selectedCategory:  props.location.state['itemCat'],
            selecteditemType: { name: props.location.state['itemType'], code: props.location.state['itemType'] } ,
            purity: [{ name: props.location.state['purity'], code: props.location.state['purity'] }],
            makingCharges: props.location.state['making_charge'],
            wastage: props.location.state['wastage'],
            hsnCode: props.location.state['hsn_code'],
            selectedPriceType: { name: props.location.state['price_type'], code: props.location.state['price_type'] } ,
            selectedPurity: {purity: props.location.state['purity'], branch: localStorage.getItem("Branch"), name: props.location.state['purity'], code: props.location.state['purity']},
            price: '',
            last_id: 0,
            last_item: props.location.state['itemNo'],
            updatedList: props.location.state['itemList'],
            tax_per : props.location.state['taxp']
        }
        console.log(props.location.state)
        // this.getLastItem()
        this.getItemPurity() 
        // this.updateItem(props.location.state['itemList']) 
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    accept() {
        this.toast.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    reject() {
        this.toast.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }


    getLastItem() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getLastItem(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    last_id: response['data']['data']['last_id'],
                    last_item: response['data']['data']['item_no']
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    getItemPurity() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getItemPurity(data).then((response) => {
            if (response['data']['status'] === 1) {
                response['data']['data'].map((data) =>{
                    return(
                    data['name'] = data['purity'],
                    data['code'] = data['purity'])
                    })
                this.setState({
                    purity: response['data']['data']
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    submitForm(e) {
        e.preventDefault()

        // if (this.validate()) {
            const {
                last_item,
                name,
                location,
                selectedCategory,
                selecteditemType,
                purity,
                makingCharges,
                wastage,
                hsnCode,
                selectedPriceType,
                price,
                tax_per
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                ino: last_item,
                name: name,
                location: location,
                category: selectedCategory.code,
                itemType: selecteditemType.code,
                purity: purity,
                makingCharges: makingCharges,
                wastage: wastage,
                hsnCode: hsnCode,
                priceType: selectedPriceType.code,
                price: price,
                tax_per: tax_per
            }

            itemService.updateItem(data).then((response) => {
                if (response['data']['status'] === 1) {
                    this.toast.show({ severity: 'info', summary: 'Updated', detail: 'Updated Successfully', life: 3000 });
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    // this.setState({
                    //     success: true,
                    // });
                    // confirmDialog({
                    //     message: 'Do you want to leave this page?',
                    //     header: 'Confirmation',
                    //     icon: 'pi pi-exclamation-triangle',
                    //     acceptClassName: 'p-button-danger',
                    //     accept: this.accept,
                    //     reject: this.reject
                    // });
                } else {
                    // toast.error(response['data']['message']);
                    this.setState({
                        loggedIn: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
        // }
    }

    validate() {
        let name = this.state.name;
        let location = this.state.location;
        let selectedCategory = this.state.selectedCategory;
        let selecteditemType = this.state.selecteditemType;
        let purity = this.state.purity;
        let makingCharges = this.state.makingCharges;
        let wastage = this.state.wastage;
        let hsnCode = this.state.hsnCode;
        let tax_per = this.state.tax_per;
        let selectedPriceType = this.state.selectedPriceType;
        let errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors["name"] = "Please enter name.";
        }

        if (!location) {
            isValid = false;
            errors["location"] = "Please  enter location.";
        }

        if (!selectedCategory) {
            isValid = false;
            errors["selectedCategory"] = "Please select category.";
        }

        if (!selecteditemType) {
            isValid = false;
            errors["selecteditemType"] = "Please select item type.";
        }

        if (!purity) {
            isValid = false;
            errors["purity"] = "Please enter purity.";
        }

        if (!makingCharges) {
            isValid = false;
            errors["makingCharges"] = "Please enter making charges.";
        }

        if (!wastage) {
            isValid = false;
            errors["wastage"] = "Please enter wastage.";
        }

        if (!hsnCode) {
            isValid = false;
            errors["hsnCode"] = "Please enter HSN code.";
        }

        if (!tax_per) {
            isValid = false;
            errors["tax_per"] = "Please enter Tax %.";
        }

        if (!selectedPriceType) {
            isValid = false;
            errors["selectedPriceType"] = "Please select price type.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (newValue) => {
        console.log(newValue.value.code)
        this.setState({
            selectedCategory: newValue.value
        })
    };

    handleChangeItemType = (newValue) => {
        console.log(newValue)
        this.setState({
            selecteditemType: newValue.value
        })
    };

    handleChangePriceType = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPriceType: newValue.value
        })
    };

    handleChangePurity = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPurity: newValue.value
        })
    };

    updateItem = (data) =>{
        console.log(data)
        this.setState({
            name: data?data['iname']:'',
            location: '',
            selectedCategory: '',
            selecteditemType: '',
            purity: JSON.parse(localStorage.getItem('purity')),
            makingCharges: '',
            wastage: '',
            hsnCode: '',
            selectedPriceType: '',
            selectedPurity: [],
            price: '',
        })
    }

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
            selectedPriceType: '',
            selectedPurity: [],
            price: '',
        })
    }


    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        if (this.state.success) {
            return <Redirect to='/item-category-list'></Redirect>
        }

        if(this.state.purity)
            this.state.purity.map((data) => {
                return (data['name'] = data['purity'], data['code'] = data['purity'])
            })


        const price = this.state.selectedPriceType.name;
        let comp;

        if (price === 'Piece Wise Rate') {

            comp = <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Price</div>
                            <InputText id="username1" placeholder="Enter Price" aria-describedby="username1-help" style={{width:'100%'}} name="price" value={this.state.price} onChange={this.onChange}/>
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
                    <h3 className="pageTitle">Item Update</h3>
                </div>
                <div className="continerSmallBox">    
                    {/* <div className="row">
                        <div className="col-6">
                            Item Number : {this.state.last_item}
                        </div>
                    </div> */}
                    
                        {/* <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Number</div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'100%'}} name="last_item" value={this.state.last_item} onChange={this.onChange} disabled />
                            </div>
                        </div> */}
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Number</div>
                                <InputText id="username1" placeholder="Enter Item Name" aria-describedby="username1-help" style={{width:'100%'}} name="last_item" value={this.state.last_item} onChange={this.onChange} disabled/>
                                <div className="textDanger">{this.state.errors.name}</div>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Name</div>
                                <InputText id="username1" placeholder="Enter Item Name" aria-describedby="username1-help" style={{width:'100%'}} name="name" value={this.state.name} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.name}</div>
                            </div>
                        </div>
                            {/* <TextField id="outlined-basic" label="Enter Item Name" variant="outlined" className="InputBox" name="name" value={this.state.name} onChange={this.onChange} />
                            <div className="textDanger">{this.state.errors.name}</div> */}
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Category</div>
                                {/* <div  style={{width:'100%'}}> */}
                                        <input list="browsers" placeholder="Enter Categery" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'5px 10px'}} name="browser" id="browser" name="selectedCategory" value={this.state.selectedCategory}  onChange={this.onChange} />
                                        <datalist id="browsers" >
                                            {  
                                                this.state.category.map((item,index)=>{
                                                    return  <option key={index} value={item.name} />;
                                                })
                                            }
                                        </datalist>
                                        {/* </div> */}
                                {/* <Dropdown style={{width:'100%'}} value={this.state.selectedCategory} options={this.state.category} onChange={this.handleChangeCategory} optionLabel="name" placeholder="Select Categery" /> */}
                                <div className="textDanger">{this.state.errors.selectedCategory}</div>
                            </div>
                        </div>

                        {/* <div className="reactSe lect">
                            {this.state.selectedCategory ? 'Select Category' : ''}
                            <Select className="selectClass" placeholder={<div>Select Category</div>} onChange={this.handleChangeCategory} options={this.state.category} />
                        </div> */}
                        {/* <div className="textDanger">{this.state.errors.selectedCategory}</div> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Type</div>
                                <Dropdown style={{width:'100%'}} value={this.state.selecteditemType} options={this.state.itemType} onChange={this.handleChangeItemType} optionLabel="name" placeholder="Select Item Type" />
                                <div className="textDanger">{this.state.errors.selecteditemType}</div>
                            </div>
                        </div>
                        {/* <div className="reactSelect">
                            {this.state.selecteditemType ? 'Select Item Type' : ''}
                            <Select className="selectClass" placeholder={<div>Select Item Type</div>} onChange={this.handleChangeItemType} options={this.state.itemType} />
                            <div className="textDanger">{this.state.errors.selecteditemType}</div>
                        </div> */}
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Purity</div>
                                <Dropdown style={{width:'100%'}} value={this.state.selectedPurity} options={this.state.purity} onChange={this.handleChangePurity} optionLabel="name" placeholder="Select Purity" />
                                <div className="textDanger">{this.state.errors.purity}</div>
                            </div>
                        </div>

                        {/* <div className="reactSelect">
                            <Select className="selectClass" placeholder={<div>Select Purity</div>} onChange={this.handleChangePurity} options={this.state.purity} />
                            <div className="textDanger">{this.state.errors.purity}</div>
                        </div> */}
                        {/* <Input className="InputBox" placeholder="Purity" name="purity" id="purity" value={this.state.purity} onChange ={this.onChange}  /> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Making Charges</div>
                                <InputText id="username1" placeholder="Enter Making Charges" aria-describedby="username1-help" style={{width:'100%'}} name="makingCharges" value={this.state.makingCharges} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.makingCharges}</div>
                            </div>
                        </div>

                        {/* <div className="reactSelect">
                            <TextField id="outlined-basic" label="Enter Making Charges" variant="outlined" className="InputBox" name="makingCharges" value={this.state.makingCharges} onChange={this.onChange} /> */}
                            {/* <Input className="InputBox" placeholder="Enter Making Charges" name="makingCharges" id="makingCharges" value={this.state.makingCharges} onChange ={this.onChange}  /> */}
                            {/* <div className="textDanger">{this.state.errors.makingCharges}</div>
                        </div> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Wastage %</div>
                                <InputText id="username1" placeholder="Enter Wastage %" aria-describedby="username1-help" style={{width:'100%'}} name="wastage" value={this.state.wastage} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.wastage}</div>
                            </div>
                        </div>

                        {/* <div className="reactSelect">
                            <TextField id="outlined-basic" label="Enter Wastage %" variant="outlined" className="InputBox" name="wastage" value={this.state.wastage} onChange={this.onChange} /> */}
                            {/* <Input className="InputBox" placeholder="Enter Wastage %" name="wastage" id="wastage" value={this.state.wastage} onChange ={this.onChange}  /> */}
                            {/* <div className="textDanger">{this.state.errors.wastage}</div>
                        </div> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Location</div>
                                <InputText id="username1" placeholder="Enter Location" aria-describedby="username1-help" style={{width:'100%'}} name="location" value={this.state.location} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.location}</div>
                            </div>
                        </div>
                        {/* <div className="reactSelect">
                            <TextField id="outlined-basic" label="Enter Location" variant="outlined" className="InputBox" name="location" value={this.state.location} onChange={this.onChange} />
                            <div className="textDanger">{this.state.errors.wastage}</div>
                        </div> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>HSN Code</div>
                                <InputText id="username1" placeholder="Enter HSN Code" aria-describedby="username1-help" style={{width:'100%'}} name="hsnCode" value={this.state.hsnCode} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.hsnCode}</div>
                            </div>
                        </div>

                        {/* <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Tax %</div>
                                <InputText id="username1" placeholder="Enter Tax %" aria-describedby="username1-help" style={{width:'100%'}} name="tax_per" value={this.state.tax_per} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.tax_per}</div>
                            </div>
                        </div> */}

                        {/* <div className="reactSelect">
                            <TextField id="outlined-basic" label="Enter HSN Code" variant="outlined" className="InputBox" name="hsnCode" value={this.state.hsnCode} onChange={this.onChange} />
                            <div className="textDanger">{this.state.errors.hsnCode}</div>
                        </div> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Price Type</div>
                                <Dropdown style={{width:'100%'}} value={this.state.selectedPriceType} options={this.state.priceType} onChange={this.handleChangePriceType} optionLabel="name" placeholder="Select Price Type" />
                                <div className="textDanger">{this.state.errors.selectedPriceType}</div>
                            </div>
                        </div>

                        {/* <div className="reactSelect">
                            {this.state.selectedPriceType ? 'Select Price Type' : ''}
                            <Select placeholder={<div>Select Price Type</div>} onChange={this.handleChangePriceType} options={this.state.priceType} />
                        </div>
                        <div className="textDanger">{this.state.errors.selectedPriceType}</div> */}

                        {comp}

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
                            <Link to="/item-category-list" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained" >
                                    <div className="buttonText"> <i className="pi pi-chevron-left"></i> <span className="buttonTextFirstLetter">B</span>ack</div>
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