import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';

export default class SalesService{

    //get Total Branch
    getSales = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'get-sales' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    getSalesReport = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'get-sales-reports' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    getStocks = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'get-stock' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    getBillDetails = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'get-bill-deatils' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    getLastSales = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'get-last-sales' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getViewBill = (data )=>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'get-view-bill' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    saveSales = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'save-sales' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    deleteSales = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'delete-sales' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    updateSales = (data) =>{
        let headers = {
            headers: { Action : 'Estimate', Module: 'update-sales' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getTax = (data) =>{
        let headers = {
            headers: { Action : 'Sales', Module: 'get-tax' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }


}       