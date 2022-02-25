import React,{ Component } from 'react'

import '../../assets/css/style.css';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import ItemData from './itemData.jsx'


//service 
import UserService from '../../service/user/userService'

//object of services
const userService = new UserService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            open : false,
            branch : [{branch:'Loading'}]
        }
        this.getTotalBranch();
        this.createData = this.createData.bind(this)
      }

    createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    getTotalBranch()
    {
        let data = {username : localStorage.getItem("username")}

        userService.getTotalBranch(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
                this.setState({
                    branch : response['data']['data']
                })
            } 
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    render(){
          
        const rows = this.state.branch
          
        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                <div className="continerBigMediumBox">

                    {/* New Branch */}

                    <ItemData rows={rows} />
                    
                </div>
                <Footer />

            </div>
        )
    }
}