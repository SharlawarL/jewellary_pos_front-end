import React,{ Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
  
//setting pages component
import Setting from './setting'
import BranchMaster from './branch/branch'
import AddBranch from './branch/addbranch'
import UpdateBranch from './branch/updateBranch'
import UserMaster from './user/usermaster'
import AddUser from './user/adduser'
import HeadUserMaster from './headOfficeUser/headUsermaster'
import AddHeadUser from './headOfficeUser/addHeadUser'


export default class RoutComponent extends Component {

  constructor(props){
    super(props)
    this.state ={
        loggedIn : 'LogOut',
        userData : {}
    }
  }

  render(){
    return (
      <Router>
        <Switch>
          <Route exact path="/" 
            render = { props =>(
              <Setting {...props}  />
            )}></Route>
          <Route exact path="/branchmaster" 
            render = { props =>(
              <BranchMaster {...props} />
            )}></Route>
          <Route exact path="/addbranch" 
            render = { props =>(
              <AddBranch {...props}  />
            )}></Route>
          <Route exact path="/updatebranch" 
            render = { props =>(
              <UpdateBranch {...props} />
            )}></Route>

          <Route exact path="/usermaster" 
            render = { props =>(
              <UserMaster {...props} />
            )}></Route>
          <Route exact path="/adduser" 
            render = { props =>(
              <AddUser {...props} />
            )}></Route>
          <Route exact path="/headusermaster" 
            render = { props =>(
              <HeadUserMaster {...props} />
            )}></Route>

          <Route exact path="/addheaduser" 
            render = { props =>(
              <AddHeadUser {...props} />
            )}></Route>
        </Switch>
      </Router>
    );
  }
}