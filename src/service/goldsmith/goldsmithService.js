import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';

export default class GodlsmithService{

    getSmith = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'get-smith' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    saveMaster = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'save-master' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    supplierReceiptEntry = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'supplier-receipt-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    supplierIssueEntry = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'supplier-issue-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    smithReceiptEntry = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'smith-receipt-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    smithIssueEntry = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'smith-issue-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }


    getSMithSTock = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'smith-report' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getSupplierSTock = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'supplier-report' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getSmithDayBook = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'smith-day-book' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getSupplierDayBook = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'supplier-day-book' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getSupplierReceiptLast = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'supplier-receipt-last' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }
    getSupplierIssueLast = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'supplier-issue-last' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getSmithReceiptLast = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'smith-receipt-last' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    getSmithIssueLast = (data) =>{
        let headers = {
            headers: { Action : 'Goldsmith', Module: 'smith-issue-last' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }
}       