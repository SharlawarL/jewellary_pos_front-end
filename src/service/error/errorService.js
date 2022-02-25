import React , { Component } from 'react'
import axios from 'axios';
import utils from '../utils/utils'
import { ToastContainer, toast } from 'react-toastify';

//json
import { apiUrl } from '../../config/inint';

export default class ErrorService{

    showDialogBox = (data) =>{
        let headers = {
            headers: { Action : 'Compansy', Module: 'company-details' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

}       