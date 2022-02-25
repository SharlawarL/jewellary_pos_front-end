import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class CustomerService{

    //get Total Branch
    getCustomer = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'get-customer' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getAgentCode = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'get-last-agent' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getDropCustomer = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'get-drop-customer' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    saveCustomer = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'save-customer' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


    //get Total Branch
    saveCustomerAgent = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'save-customer-agent' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    deleteCustomer = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'delete-customer' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    updateCustomer = (data) =>{
        let headers = {
            headers: { Action : 'Customer', Module: 'update-customer' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


}       