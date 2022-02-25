import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';

export default class BranchService{

    //get Total Branch
    getBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'get-total-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    saveBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'save-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Branch
    deleteBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'delete-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    

    //get Total Branch
    updateBranch = (data) =>{
        let headers = {
            headers: { Action : 'Company', Module: 'update-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }


}       