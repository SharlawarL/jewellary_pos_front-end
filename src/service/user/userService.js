import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class UserService{

    //User Authentication
    userLogin = (data) =>{
        let headers = {
            headers: { Action : 'Login', Module: 'user-login' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //admin Authentication
    adminLogin = (data) =>{
        let headers = {
            headers: { Action : 'Login', Module: 'admin-login' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


    //insert branch
    saveBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'save-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //update user
    updateUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'update-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //delete branch
    deleteBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'delete-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

     //update branch
     updateBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'update-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


    //get Total Branch
    getTotalBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-total-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


    //insert User
    saveUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'save-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //insert Admin User
    saveAdminUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'save-admin-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //delete Admin User
    deleteAdminUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'delete-admin-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //delete Admin User
    deleteUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'delete-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //delete Admin User
    getTotalAdminUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'get-total-admin-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


    //delete Admin User
    getTotalUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'get-total-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getTotalBranchUser = (data) =>{
        let headers = {
            headers: { Action : 'Profile', Module: 'get-total-branch-user' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }



}       