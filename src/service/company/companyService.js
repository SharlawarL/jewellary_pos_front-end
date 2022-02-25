import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';

//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class CompanyService{

    //get company details
    getCompany = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'company-details' ,'Access-Control-Allow-Origin':'*'},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getTodaysValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-todays-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    saveTodaysValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'save-todays-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    deleteTodaysValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'delete-todays-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    updateTodaysValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'update-todays-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get company details
    getUserHome = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-user-home' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getAdminHome = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-admin-home' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getDefaultBranchValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-default-branch-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    saveDefaultBranchValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'save-default-branch-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getDefaultSMSValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-default-sms-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    saveDefaultSMSValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'save-default-sms-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getDefaultWTValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-default-wapp-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    saveDefaultWTValue = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'save-default-wapp-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

}       