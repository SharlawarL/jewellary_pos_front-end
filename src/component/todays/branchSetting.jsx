import React,{ Component } from 'react'
//libraries
import {  Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";

//internal css
import '../../assets/css/style.css';

// internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//prime react
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
            name :'',
            add1:'',
            add2:'',
            add3:'',
            add4:'',
            sname:'',
            scode:'',
            bprefix:'',
            bformat:{},
            bformatList : [
                { name : "A4" , code: "A4"},
                { name : "A4 Half Model 1" , code: "A4 Half Model 1"},
                { name : "A4 Half Model 1" , code: "A4 Half Model 1"},
                { name : "A4 Half Model 1" , code: "A4 Half Model 1"},
                { name : "A4 Half Model 1" , code: "A4 Half Model 1"},
                { name : "Thermal Bill 3 inch" , code: "Thermal Bill 3 inch"}
            ],
            gstin:'',
            eformat:{},
            eformatList : [
                { name : "A4 Half Format 1" , code: "A4 Half Format 1"},
                { name : "A4 Half Format 2" , code: "A4 Half Format 2"},
                { name : "Thermal 3 inch" , code: "Thermal 3 inch"}
            ],
            srformat:{},
            srformatList:[
                { name : "A4 Half" , code: "A4 Half"},
                { name : "Thermal 3 inch" , code: "Thermal 3 inch"}
            ],
            orformat: {},
            orformatList:[
                { name : "A4 Half" , code: "A4 Half"},
                { name : "Thermal 3 inch" , code: "Thermal 3 inch"}
            ],
            bHead:'',
            eHead:'',
            bDis:'',
            bCopy:'',
            esCopy:'',
            portNumber:'',
            dmLines:'',
            message : [
                { name : "Message 1" , code: "Message 1"},
                { name : "Message 2" , code: "Message 2"},
                { name : "Message 3" , code: "Message 3"},
                { name : "Message 4" , code: "Message 4"}
            ],
            setMessage:{},
            msg1: '',
            msg2: '',
            msg3: '',
            msg4: ''
        }
        this.onChange   = this.onChange.bind(this)
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

        companyService.getDefaultBranchValue(data).then((response) => {
            if (response['data']['status'] === 1) {
                let data = response['data']['data'][0]
                this.setState({
                    type: 'update',
                    bname:'Update',
                    name    : data['bill_name'],
                    add1    : data['bill_add1'],
                    add2    : data['bill_add2'],
                    add3    : data['bill_add3'],
                    add4    : data['bill_add4'],
                    sname   : data['state_name'],
                    scode   : data['state_code'],
                    bprefix : data['bill_prefix'],
                    bformat : {name : data['bill_format'], code : data['bill_format']},
                    gstin   : data['gstin'],
                    eformat : {name : data['estimate_format'], code : data['estimate_format']},
                    srformat: {name : data['scheme_receipt_format'], code : data['scheme_receipt_format']},
                    orformat: {name : data['order_receipt_format'], code : data['order_receipt_format']},
                    bHead   : data['bill_head'],
                    eHead   : data['estimate_head'],
                    bDis    : data['max_bill_discount'],
                    bCopy   : data['no_of_bill_copies'],
                    esCopy  : data['no_of_estimate_copies'],
                    portNumber: data['port_name'],
                    dmLines : data['dot_matrix_lines'],
                    msg1: data['bill_message1'],
                    msg2: data['bill_message2'],
                    msg3: data['bill_message3'],
                    msg4: data['bill_message4'],
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
            name,
            add1,
            add2,
            add3,
            add4,
            sname,
            scode,
            bprefix,
            bformat,
            gstin ,
            eformat,
            srformat,
            orformat,
            bHead,
            eHead,
            bDis,
            bCopy,
            esCopy,
            portNumber,
            dmLines,
            msg1,
            msg2,
            msg3,
            msg4
        } = this.state

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: (type === 'update')?'update':'new',
            name        :name?name:'.',
            add1        :add1?add1:'.',
            add2        :add2?add2:'.',
            add3        :add3?add3:'.',
            add4        :add4?add4:'.',
            sname       :sname?sname:'.',
            scode       :scode?scode:'.',
            bprefix     :bprefix?bprefix:'.',
            bformat     :bformat?bformat.name:'.',
            gstin       :gstin?gstin:'.' ,
            eformat     :eformat?eformat.name:'.',
            srformat    :srformat?srformat.name:'.',
            orformat    :orformat?orformat.name:'.',
            bHead       :bHead?bHead:'.',
            eHead       :eHead?eHead:'.',
            bDis        :bDis?bDis:'.',
            bCopy       :bCopy?bCopy:'.',
            esCopy      :esCopy?esCopy:'.',
            portNumber  :portNumber?portNumber:'.',
            dmLines     :dmLines?dmLines:'.',
            msg1:msg1?msg1:'',
            msg2:msg2?msg2:'',
            msg3:msg3?msg3:'',
            msg4:msg4?msg4:'',
        }
        
        companyService.saveDefaultBranchValue(data).then((response) =>{
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
                    <h3 className="pageTitle">Branch Setting</h3>
                </div>

                <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Name</div>
                                <InputText id="username1" placeholder="Enter Branch Name" aria-describedby="username1-help" style={{width:'100%'}} name="name" value={this.state.name} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Address</div>
                                <InputText id="username1" placeholder="Enter Address 1" aria-describedby="username1-help" style={{width:'100%'}} name="add1" value={this.state.add1} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}></div>
                                <InputText id="username1" placeholder="Enter Address 2" aria-describedby="username1-help" style={{width:'100%'}} name="add2" value={this.state.add2} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}></div>
                                <InputText id="username1" placeholder="Enter Address 3" aria-describedby="username1-help" style={{width:'100%'}} name="add3" value={this.state.add3} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}></div>
                                <InputText id="username1" placeholder="Enter Address 4" aria-describedby="username1-help" style={{width:'100%'}} name="add4" value={this.state.add4} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>State Name</div>
                                <InputText id="username1" placeholder="Enter State Name" aria-describedby="username1-help" style={{width:'100%'}} name="sname" value={this.state.sname} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>State Code</div>
                                <InputText id="username1" placeholder="Enter State Code" aria-describedby="username1-help" style={{width:'100%'}} name="scode" value={this.state.scode} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Bill Prefix</div>
                                <InputText id="username1" placeholder="Enter Bill Prefix" aria-describedby="username1-help" style={{width:'100%'}} name="bprefix" value={this.state.bprefix} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Bill Format</div>
                                <Dropdown style={{width:'100%'}} value={this.state.bformat} options={this.state.bformatList} onChange={(e) => this.setState({ bformat : e.target.value})} optionLabel="name" placeholder="Select Bill Format" />
                                {/* <InputText id="username1" placeholder="Enter Bill Format" aria-describedby="username1-help" style={{width:'100%'}} name="bformat" value={this.state.bformat} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>GSTIN Number</div>
                                <InputText id="username1" placeholder="Enter GSTIN Number" aria-describedby="username1-help" style={{width:'100%'}} name="gstin" value={this.state.gstin} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Estimate Format</div>
                                <Dropdown style={{width:'100%'}} value={this.state.eformat} options={this.state.eformatList} onChange={(e) => this.setState({ eformat : e.target.value})} optionLabel="name" placeholder="Select Estimate Format" />
                                {/* <InputText id="username1" placeholder="Enter Estimate Format" aria-describedby="username1-help" style={{width:'100%'}} name="eformat" value={this.state.eformat} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Scheme Receipt Format</div>
                                <Dropdown style={{width:'100%'}} value={this.state.srformat} options={this.state.srformatList} onChange={(e) => this.setState({ srformat : e.target.value})} optionLabel="name" placeholder="Select Scheme Receipt Format" />
                                {/* <InputText id="username1" placeholder="Enter Scheme Receipt Format" aria-describedby="username1-help" style={{width:'100%'}} name="srformat" value={this.state.srformat} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Order Receipt Format</div>
                                <Dropdown style={{width:'100%'}} value={this.state.orformat} options={this.state.orformatList} onChange={(e) => this.setState({ orformat : e.target.value})} optionLabel="name" placeholder="Select Scheme Receipt Format" />
                                {/* <InputText id="username1" placeholder="Enter Order Receipt Format" aria-describedby="username1-help" style={{width:'100%'}} name="orformat" value={this.state.orformat} onChange={this.onChange}/> */}
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Bill Head</div>
                                <InputText id="username1" placeholder="Enter Bill Head" aria-describedby="username1-help" style={{width:'100%'}} name="bHead" value={this.state.bHead} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Estimate Head</div>
                                <InputText id="username1" placeholder="Enter Estimate Head" aria-describedby="username1-help" style={{width:'100%'}} name="eHead" value={this.state.eHead} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Max.Bill Discount</div>
                                <InputText id="username1" placeholder="Enter Max.Bill Discount" aria-describedby="username1-help" style={{width:'100%'}} name="bDis" value={this.state.bDis} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>No.of Bill Copies</div>
                                <InputText id="username1" placeholder="Enter No.of Bill Copies" aria-describedby="username1-help" style={{width:'100%'}} name="bCopy" value={this.state.bCopy} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>No.of Estimate Copies</div>
                                <InputText id="username1" placeholder="Enter No.of Estimate Copies" aria-describedby="username1-help" style={{width:'100%'}} name="esCopy" value={this.state.esCopy} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Port Name</div>
                                <InputText id="username1" placeholder="Enter Port Name" aria-describedby="username1-help" style={{width:'100%'}} name="portNumber" value={this.state.portNumber} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Dot Matrix Lines</div>
                                <InputText id="username1" placeholder="Enter Dot Matrix Lines" aria-describedby="username1-help" style={{width:'100%'}} name="dmLines" value={this.state.dmLines} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Bill Message</div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'100%'}} name="msg1" value={this.state.msg1} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}></div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'100%'}} name="msg2" value={this.state.msg2} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}></div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'100%'}} name="msg3" value={this.state.msg3} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}></div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'100%'}} name="msg4" value={this.state.msg4} onChange={this.onChange}/>
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