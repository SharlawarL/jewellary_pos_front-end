import React,{ Component, Suspense ,lazy  } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

  //images
import Logo from './assets/img/companylogo.png';

  //Other pages component
  const Home            = lazy(() => import('./component/home/home'));
  const HeadOfficeHome  = lazy(() => import('./component/home/homeHeadOffice'));
  const Login           = lazy(() => import('./component/login/login'));
  const HeadOfficeLogin = lazy(() => import('./component/login/HeadOfficeLogin'));

  //sales
  const Sales           = lazy(() => import('./component/sales/sales'));
  const SalesBill       = lazy(() => import('./component/sales/salesPoint.jsx'));
  const SalesReport    = lazy(() => import('./component/sales/salesReport.jsx'));
  const SalesReportDaily    = lazy(() => import('./component/sales/salesReportDaily.jsx'));
  const SalesReportCustomer    = lazy(() => import('./component/sales/salesReportCustomer.jsx'));
  const SalesReportCashier    = lazy(() => import('./component/sales/salesReportCashier.jsx'));
  const SalesReportPby   = lazy(() => import('./component/sales/salesReportPby.jsx'));
  const SalesReportRef   = lazy(() => import('./component/sales/salesReportRef.jsx'));
  const SalesReportRemark   = lazy(() => import('./component/sales/salesReportRemark.jsx'));
  const SalesReportDay  = lazy(() => import('./component/sales/salesReportDay.jsx'));
  const SalesReportSummary  = lazy(() => import('./component/sales/salesReportSummary.jsx'));
  const SalesReportItem  = lazy(() => import('./component/sales/salesReportItem.jsx'));
  const SalesReportCategory  = lazy(() => import('./component/sales/salesReportCategory.jsx'));
  const SalesReportItemType  = lazy(() => import('./component/sales/salesReportItemType.jsx'));
  const SalesView       = lazy(() => import('./component/sales/salesView'));
  const SalesPrint       = lazy(() => import('./component/sales/salesPrint.jsx'));

  //parchase
  const Purchase        = lazy(() => import('./component/purchase/purchase'));
  const PurchaseRegister        = lazy(() => import('./component/purchase/purchaseRegister'));
  const PurchaseReturn        = lazy(() => import('./component/purchaseReturn/purchaseRegister'));
  const PurchaseReturnView        = lazy(() => import('./component/purchaseReturn/purchase'));
  const PurchaseReport       = lazy(() => import('./component/purchase/purchaseReport.jsx'));
  const PurchaseSupplierReport       = lazy(() => import('./component/purchase/purchaseSupplierReport.jsx'));
  const PurchaseSummary       = lazy(() => import('./component/purchase/purchaseSummary.jsx'));
  const PurchaseSummaryItem       = lazy(() => import('./component/purchase/purchaseSummaryItem.jsx'));
  const PurchaseSummaryCat       = lazy(() => import('./component/purchase/purchaseSummaryCat.jsx'));
  const PurchaseSummarySupplier       = lazy(() => import('./component/purchase/purchaseSummarySupplier.jsx'));

  //Estimate
  const Estimate           = lazy(() => import('./component/estimate/estimate'));
  const EstimateBill       = lazy(() => import('./component/estimate/estimatePoint.jsx'));
  const EstimateReport    = lazy(() => import('./component/estimate/estimateReport.jsx'));
  const EstimateReportDaily    = lazy(() => import('./component/estimate/estimateReportDaily.jsx'));
  const EstimateReportCustomer    = lazy(() => import('./component/estimate/estimateReportCustomer.jsx'));
  const EstimateReportCashier    = lazy(() => import('./component/estimate/estimateReportCashier.jsx'));
  const EstimateReportPby   = lazy(() => import('./component/estimate/estimateReportPby.jsx'));
  const EstimateReportRef   = lazy(() => import('./component/estimate/estimateReportRef.jsx'));
  const EstimateReportRemark   = lazy(() => import('./component/estimate/estimateReportRemark.jsx'));
  const EstimateReportDay  = lazy(() => import('./component/estimate/estimateReportDay.jsx'));
  const EstimateReportSummary  = lazy(() => import('./component/estimate/estimateReportSummary.jsx'));
  const EstimateReportItem  = lazy(() => import('./component/estimate/estimateReportItem.jsx'));
  const EstimateReportCategory  = lazy(() => import('./component/estimate/estimateReportCategory.jsx'));
  const EstimateReportItemType  = lazy(() => import('./component/estimate/estimateReportItemType.jsx'));
  const EstimateView       = lazy(() => import('./component/estimate/estimateView'));
  // const EstimateMaster        = lazy(() => import('./component/estimate/estimateMaster.jsx'));
  // const EstimateReturn        = lazy(() => import('./component/estimate/estimateReturn.jsx'));

  //stock
  const StockMaster     = lazy(() => import('./component/stock/stockMaster.jsx'));
  const StockSummary          = lazy(() => import('./component/stock/stockSummary.jsx'));
  const StockSummaryItemType          = lazy(() => import('./component/stock/stockSummaryItemType.jsx'));
  const StockSummaryPurity         = lazy(() => import('./component/stock/stockSummaryPurity.jsx'));
  const StockSummaryPriceType         = lazy(() => import('./component/stock/stockSummaryPriceType.jsx'));
  const StockList         = lazy(() => import('./component/stock/stockList.jsx'));
  const StockListEntry         = lazy(() => import('./component/stock/stockListEntry.jsx'));
  const StockListOld        = lazy(() => import('./component/stock/stockListOld.jsx'));


  //item menu
  const ItemMaster         = lazy(() => import('./component/item/itemMaster.jsx'));
  const ItemMasterPurity         = lazy(() => import('./component/item/itemMasterPurity.jsx'));
  const ItemMasterPurityList         = lazy(() => import('./component/item/itemMasterPurityList.jsx'));
  const ItemUpdate         = lazy(() => import('./component/item/itemUpdate.jsx'));
  const ItemList     = lazy(() => import('./component/item/itemList.jsx'));
  const ItemListCat     = lazy(() => import('./component/item/itemListCat.jsx'));
  const ItemListItem     = lazy(() => import('./component/item/itemListitem.jsx'));
  const ItemListPurity     = lazy(() => import('./component/item/itemListPurity.jsx'));
  const ItemListPriceType     = lazy(() => import('./component/item/itemListPriceType.jsx'));
  const ItemSummaryCategory     = lazy(() => import('./component/item/itemSummaryCategory.jsx'));
  const ItemSummaryHSN    = lazy(() => import('./component/item/itemSummaryHSN.jsx'));

  
  //account
  const Account         = lazy(() => import('./component/account/account'));
  const CashBookRegister         = lazy(() => import('./component/account/cashbookRgister'));
  const BankBookRegister         = lazy(() => import('./component/account/bankbookRgister'));
  const CreateAccountMaster         = lazy(() => import('./component/account/createAccountMaster.jsx'));

  //scheme
  const Scheme          = lazy(() => import('./component/scheme/schemeRegistration.jsx'));
  const SchemePayment   = lazy(() => import('./component/scheme/schemePaymentRegistration.jsx'));
  const SchemeClose     = lazy(() => import('./component/scheme/schemeClosed.jsx'));
  const SchemeMasterName     = lazy(() => import('./component/scheme/schemeMaster.jsx'));
  const SchemeMaster     = lazy(() => import('./component/scheme/schemeMasterData.jsx'));
  const SchemeReports     = lazy(() => import('./component/scheme/schemeReports.jsx'));
  const SchemeReportsCat     = lazy(() => import('./component/scheme/schemeReportsCat.jsx'));
  const SchemeReportsCust     = lazy(() => import('./component/scheme/schemeReportsCust.jsx'));
  const SchemeReportsClient     = lazy(() => import('./component/scheme/schemeReportsClient.jsx'));
  const SchemeReportsOver     = lazy(() => import('./component/scheme/schemeReportsOver.jsx'));
  const SchemeReportsPayment     = lazy(() => import('./component/scheme/schemeReportsPayment.jsx'));
  const SchemeReportsPayBy     = lazy(() => import('./component/scheme/schemeReportsPayBy.jsx'));
  const SchemeReportsPayCust     = lazy(() => import('./component/scheme/schemeReportsPayCust.jsx'));
  const SchemeReportsPayScheme     = lazy(() => import('./component/scheme/schemeReportsPayScheme.jsx'));
  const SchemeReportsPayClient     = lazy(() => import('./component/scheme/schemeReportsPayClient.jsx'));
  const SchemeList     = lazy(() => import('./component/scheme/schemeList.jsx'));
  const SchemeListCat     = lazy(() => import('./component/scheme/schemeListCat.jsx'));

  const OrderEntry     = lazy(() => import('./component/order/orderEntry.jsx'));
  const OrderDelivery     = lazy(() => import('./component/order/orderDelivery.jsx'));
  const OrderActive     = lazy(() => import('./component/order/orderActive.jsx'));
  const OrderUnorder     = lazy(() => import('./component/order/orderUnorder.jsx'));
  const OrderReports     = lazy(() => import('./component/order/orderReport.jsx'));
  const OrderReportsType     = lazy(() => import('./component/order/orderReportType.jsx'));
  const PurchaseEntry     = lazy(() => import('./component/order/purchaseEntry.jsx'));
  const IssueToManu     = lazy(() => import('./component/order/issueToManu.jsx'));
  const ManuToShow     = lazy(() => import('./component/order/manuToShow.jsx'));
  const IssueToCust     = lazy(() => import('./component/order/issueToCust.jsx'));
  const OrderPrint     = lazy(() => import('./component/order/orderPrint.jsx'));
  const OrderIssuePrint     = lazy(() => import('./component/order/orderIssuePrint.jsx'));
  const OrderCustPrint     = lazy(() => import('./component/order/orderCustPrint.jsx'));
  const OrderManuPrint     = lazy(() => import('./component/order/orderManuPrint.jsx'));

  // gold smith
  const GoldsmithMaster           = lazy(() => import('./component/goldSmith/goldsmithMaster.jsx'));
  const GoldsmithReceiptEntry     = lazy(() => import('./component/goldSmith/goldsmithReceiptEntry.jsx'));
  const GoldsmithIssueEntry       = lazy(() => import('./component/goldSmith/goldsmithIssueEntry.jsx'));
  const GoldsmithStockReport      = lazy(() => import('./component/goldSmith/goldsmithStockReport.jsx'));
  const GoldsmithBook             = lazy(() => import('./component/goldSmith/goldsmithBook.jsx'));
  const GoldsmithBookPrint      = lazy(() => import('./component/goldSmith/goldsmithBookPrint.jsx'));
  const SupplierReceiptEntry      = lazy(() => import('./component/goldSmith/supplierReceiptEntry.jsx'));
  const SupplierIssueEntry        = lazy(() => import('./component/goldSmith/supplierIssueEntry.jsx'));
  const SupplierStockReport       = lazy(() => import('./component/goldSmith/supplierStockReport.jsx'));
  const SupplierBook            = lazy(() => import('./component/goldSmith/supplierBook.jsx'));
  const SupplierBookPrint       = lazy(() => import('./component/goldSmith/supplierBookPrint.jsx'));

  //agent
  const AgentMaster  = lazy(() => import('./component/client/clientMaster.jsx'));
  const AgentList    = lazy(() => import('./component/client/clientList.jsx'));

  const GstrPurchaseReports     = lazy(() => import('./component/GSTR/gstrPurchaseReports.jsx'));
  const GstrPurchaseRReports     = lazy(() => import('./component/GSTR/gstrPurchaseRReports.jsx'));
  const GstrSalesReports     = lazy(() => import('./component/GSTR/gstrSalesReports.jsx'));
  const GstrSalesRReports     = lazy(() => import('./component/GSTR/gstrSalesRReports.jsx'));

  const SummaryGstrPurchaseReports     = lazy(() => import('./component/GSTR/summaryGstrPurchaseReports.jsx'));
  const SummaryGstrPurchaseRReports     = lazy(() => import('./component/GSTR/summaryGstrPurchaseRReports.jsx'));
  const SummaryGstrSalesReports     = lazy(() => import('./component/GSTR/summaryGstrSalesReports.jsx'));
  const SummaryGstrSalesRReports     = lazy(() => import('./component/GSTR/summaryGstrSalesRReports.jsx'));

    //customer
    const CustomerMaster  = lazy(() => import('./component/customer/customerMaster.jsx'));
    const CustomerList    = lazy(() => import('./component/customer/customerList.jsx'));
    const CustomerListArea    = lazy(() => import('./component/customer/customerListArea.jsx'));
    const CustomerListState    = lazy(() => import('./component/customer/customerListState.jsx'));
    const CustomerListDue    = lazy(() => import('./component/customer/customerListDue.jsx'));
    const CustomerListDueWise    = lazy(() => import('./component/customer/customerListDueWise.jsx'));
    const CustomerListDueArea    = lazy(() => import('./component/customer/customerListDueArea.jsx'));
    const CustomerListDueOver    = lazy(() => import('./component/customer/customerListDueOver.jsx'));
    const CustomerListDueOverBl    = lazy(() => import('./component/customer/customerListDueOverBl.jsx'));
    const CustomerListDueReceipt    = lazy(() => import('./component/customer/customerListDueReceipt.jsx'));
    const CustomerListDueBill    = lazy(() => import('./component/customer/customerListDueBill.jsx'));

  //supplier
  const SupplierMaster     = lazy(() => import('./component/supplier/supplierMaster.jsx'));
  const SupplierList    = lazy(() => import('./component/supplier/supplierList.jsx'));
  const SupplierListArea    = lazy(() => import('./component/supplier/supplierListArea.jsx'));
  const SupplierListDue    = lazy(() => import('./component/supplier/supplierListDue.jsx'));
  const SupplierListDueSupplier    = lazy(() => import('./component/supplier/supplierListDueSupplier.jsx'));
  const SupplierListDueOver    = lazy(() => import('./component/supplier/supplierListDueOver.jsx'));
  const SupplierListDuePayment    = lazy(() => import('./component/supplier/supplierListDuePayment.jsx'));
  const SupplierListDuePaymentWise    = lazy(() => import('./component/supplier/supplierListDuePaymentWise.jsx'));
  const SupplierListDueBill    = lazy(() => import('./component/supplier/supplierListDueBill.jsx'));


  const Profile         = lazy(() => import('./component/profile/profile'));

  //setting
  const SettingRoutes   = lazy(() => import('./component/setting/settingRoutes'));

  const WebSetting   = lazy(() => import('./component/todays/webSetting'));
  const WebSettingAdd   = lazy(() => import('./component/todays/webSettingAdd'));
  const WebSettingDefault   = lazy(() => import('./component/todays/webSettingDefault'));
  const WebSettingUpdate   = lazy(() => import('./component/todays/webSettingUpdate'));
  const TextSetting   = lazy(() => import('./component/todays/taxDefault.jsx'));

  const BranchSetting   = lazy(() => import('./component/todays/branchSetting'));
  const SmsSetting   = lazy(() => import('./component/todays/smsSetting'));
  const WhatsSetting   = lazy(() => import('./component/todays/whatsSetting'));

  const BranchMaster    = lazy(() => import('./component/setting//branch/branch'));
  const AddBranch       = lazy(() => import('./component/setting//branch/addbranch'));
  const UpdateBranch    = lazy(() => import('./component/setting//branch/updateBranch'));

  const UserMaster      = lazy(() => import('./component/setting/user/usermaster'));
  const AddUser         = lazy(() => import('./component/setting/user/adduser'));
  const AddUserBranch        = lazy(() => import('./component/setting/user/adduserBranch'));
  const UpdateUser         = lazy(() => import('./component/setting/user/updateUser'));
  const UserListBranch      = lazy(() => import('./component/setting/user/userListBranch.jsx'));

  const HeadUserMaster  = lazy(() => import('./component/setting/headOfficeUser/headUsermaster'));
  const AddHeadUser     = lazy(() => import('./component/setting/headOfficeUser/addHeadUser'));


  // utils and error
  const Logout          = lazy(() => import('./component/home/logout'));
  const UnderDev        = lazy(() => import('./component/error/underdev'));
  const ApiFail         = lazy(() => import('./component/error/apiFail'));
  const PageNotFound    = lazy(() => import('./component/error/pageNotFound'));   
  
    

export default class RoutComponent extends Component {

  constructor(props){
    super(props)
    this.state ={
        loggedIn : 'LogOut',
        userData : {},
        token : localStorage.getItem("token")
    }
    this.handleLogin = this.handleLogin.bind(this);
  }


  handleLogin(data){
    this.setState({
      loggedIn : data.status,
      userData : data.data
    })
  }

  
  render(){

    return (
      <>
      <div>
        {/* <Offline>
          <div style={{textAlign:'center',padding: '100px',position:'fixed',zIndex:'1000',width:'100%',height:'100%',backgroundColor:'rgba(4, 5, 5,0.8)'}}>
            <div style={{backgroundColor:'white',width:'400px',height:'400px',margin:'10px auto',padding: '80px 0px',borderRadius:'200px',overflow:'hidden'}}>
              <img alt="images" src={Logo} height="200px"></img>
              <h3>You're offline!!</h3>
              <PermScanWifiIcon />
            </div>
          </div>
        </Offline> */}
      </div>
      <Suspense fallback={
        <div style={{textAlign:'center',padding: '100px'}}>
          <img alt="images" src={Logo} height="200px"></img>
          <h3><i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i></h3>
        </div>
      }>
      <Router>
        <Switch>
          <Route exact path="/"
            render = { props =>(
              <>
              {/* {!this.state.token?
                ( <> */}
                  <Login {...props} handleLogin={this.handleLogin}  loggedIn = {this.state.loggedIn}/>
                {/* </>):
                (
                <>
                  <Redirect to={{
                                  pathname: '/home',
                                  
                              }}
                              />
                </>
                )
              } */}
              </>
            )}></Route>
          <Route exact path="/headOfficeLogin" 
            render = { props =>(

              <HeadOfficeLogin {...props} handleLogin={this.handleLogin}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/home" 
            render = { props =>(
              <>
              {localStorage.getItem("Branch") === 'Head Office'?
              (<HeadOfficeHome {...props} loggedIn = {this.state.loggedIn}/>):
              (<Home {...props} loggedIn = {this.state.loggedIn}/>)}
              
              </>
            )}></Route>
          
          {/* Sales */}
          <Route exact path="/head-office-home" 
            render = { props =>(
              <HeadOfficeHome {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/sales" 
            render = { props =>(
              <Sales {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-bill" 
            render = { props =>(
              <SalesBill {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-report" 
            render = { props =>(
              <SalesReport {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/sales-daily-report" 
            render = { props =>(
              <SalesReportDaily {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
             <Route exact path="/sales-customer-report" 
            render = { props =>(
              <SalesReportCustomer {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/sales-cashier-report" 
            render = { props =>(
              <SalesReportCashier {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-reference-report" 
            render = { props =>(
              <SalesReportRef {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-remark-report" 
            render = { props =>(
              <SalesReportRemark {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-day-report" 
            render = { props =>(
              <SalesReportDay {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-summary-report" 
            render = { props =>(
              <SalesReportSummary {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-item-report" 
            render = { props =>(
              <SalesReportItem {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-category-report" 
            render = { props =>(
              <SalesReportCategory {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-item-type-report" 
            render = { props =>(
              <SalesReportItemType {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/sales-pay-mode-report" 
            render = { props =>(
              <SalesReportPby {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sales-view" 
            render = { props =>(
              <SalesView {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/sales-print" 
            render = { props =>(
              <SalesPrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>


          <Route exact path="/purchase" 
            render = { props =>(
              <Purchase {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-register" 
            render = { props =>(
              <PurchaseRegister {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-return" 
            render = { props =>(
              <PurchaseReturn {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-return-report" 
            render = { props =>(
              <PurchaseReturnView {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/purchase-report" 
            render = { props =>(
              <PurchaseReport {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-supplier-report" 
            render = { props =>(
              <PurchaseSupplierReport {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-summary" 
            render = { props =>(
              <PurchaseSummary {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/purchase-summary-item" 
            render = { props =>(
              <PurchaseSummaryItem {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-summary-category" 
            render = { props =>(
              <PurchaseSummaryCat {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/purchase-summary-supplier" 
            render = { props =>(
              <PurchaseSummarySupplier {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>


          <Route exact path="/estimate" 
            render = { props =>(
              <Estimate {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-bill" 
            render = { props =>(
              <EstimateBill {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-report" 
            render = { props =>(
              <EstimateReport {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/estimate-daily-report" 
            render = { props =>(
              <EstimateReportDaily {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
             <Route exact path="/estimate-customer-report" 
            render = { props =>(
              <EstimateReportCustomer {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/estimate-cashier-report" 
            render = { props =>(
              <EstimateReportCashier {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-reference-report" 
            render = { props =>(
              <EstimateReportRef {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-remark-report" 
            render = { props =>(
              <EstimateReportRemark {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-day-report" 
            render = { props =>(
              <EstimateReportDay {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-summary-report" 
            render = { props =>(
              <EstimateReportSummary {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-item-report" 
            render = { props =>(
              <EstimateReportItem {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-category-report" 
            render = { props =>(
              <EstimateReportCategory {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-item-type-report" 
            render = { props =>(
              <EstimateReportItemType {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/estimate-pay-mode-report" 
            render = { props =>(
              <EstimateReportPby {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-view" 
            render = { props =>(
              <EstimateView {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          {/* <Route exact path="/estimate-master" 
            render = { props =>(
              <EstimateMaster {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/estimate-return" 
            render = { props =>(
              <EstimateReturn {...props} loggedIn = {this.state.loggedIn}/>
            )}></Route> */}
          

            {/* Item Menu */}
          <Route exact path="/item-master" 
            render = { props =>(
              <ItemMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/item-purity-master" 
            render = { props =>(
              <ItemMasterPurity {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

            <Route exact path="/item-purity-master-list" 
            render = { props =>(
              <ItemMasterPurityList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

            <Route exact path="/item-update" 
            render = { props =>(
              <ItemUpdate {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/item-list" 
            render = { props =>(
              <ItemList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/item-category-list" 
            render = { props =>(
              <ItemListCat {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/item-item-type-list" 
            render = { props =>(
              <ItemListItem {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/item-purity-list" 
            render = { props =>(
              <ItemListPurity {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/item-price-type-list" 
            render = { props =>(
              <ItemListPriceType {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/category-item-summary" 
            render = { props =>(
              <ItemSummaryCategory {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/hsn-item-summary" 
            render = { props =>(
              <ItemSummaryHSN {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

            {/* stock */}
          <Route exact path="/stock-master" 
            render = { props =>(
              <StockMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/stock-summary" 
            render = { props =>(
              <StockSummary {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/stock-item-type-report" 
            render = { props =>(
              <StockSummaryItemType {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/stock-purity-report" 
            render = { props =>(
              <StockSummaryPurity {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/stock-price-type-report" 
            render = { props =>(
              <StockSummaryPriceType {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/stock-list" 
            render = { props =>(
              <StockList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/stock-entry-list" 
            render = { props =>(
              <StockListEntry {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/stock-old-list" 
            render = { props =>(
              <StockListOld {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          
          <Route exact path="/account" 
            render = { props =>(
              <Account {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/cash-book-register" 
            render = { props =>(
              <CashBookRegister {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route> 

          <Route exact path="/create-account-master" 
            render = { props =>(
              <CreateAccountMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/bank-book-register" 
            render = { props =>(
              <BankBookRegister {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/scheme-registration" 
            render = { props =>(
              <Scheme {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/scheme-payment-registration" 
            render = { props =>(
              <SchemePayment {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/scheme-close" 
            render = { props =>(
              <SchemeClose {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/scheme-name-master" 
            render = { props =>(
              <SchemeMasterName {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/scheme-master" 
            render = { props =>(
              <SchemeMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/scheme-reports" 
            render = { props =>(
              <SchemeReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/category-wise-scheme-reports" 
            render = { props =>(
              <SchemeReportsCat {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/customer-wise-scheme-reports" 
            render = { props =>(
              <SchemeReportsCust {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/client-wise-scheme-reports" 
            render = { props =>(
              <SchemeReportsClient {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/scheme-overdue-report" 
            render = { props =>(
              <SchemeReportsOver {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/scheme-payment-report" 
            render = { props =>(
              <SchemeReportsPayment {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/pay-mode-wise-report" 
            render = { props =>(
              <SchemeReportsPayBy {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/pay-customer-wise-report" 
            render = { props =>(
              <SchemeReportsPayCust {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/pay-scheme-wise-report" 
            render = { props =>(
              <SchemeReportsPayScheme {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/pay-client-wise-report" 
            render = { props =>(
              <SchemeReportsPayClient {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/scheme-list" 
            render = { props =>(
              <SchemeList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/scheme-list-by-cat" 
            render = { props =>(
              <SchemeListCat {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/order-entry" 
            render = { props =>(
              <OrderEntry {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

            <Route exact path="/order-delivery" 
            render = { props =>(
              <OrderDelivery {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/active-order" 
            render = { props =>(
              <OrderActive {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/undelivered-orders" 
            render = { props =>(
              <OrderUnorder {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/order-reports" 
            render = { props =>(
              <OrderReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/order-reports-type" 
            render = { props =>(
              <OrderReportsType {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/purchase-entry" 
            render = { props =>(
              <PurchaseEntry {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/issue-to-menu" 
            render = { props =>(
              <IssueToManu {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/menu-to-show" 
            render = { props =>(
              <ManuToShow {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/issue-to-cust" 
            render = { props =>(
              <IssueToCust {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/order-print" 
            render = { props =>(
              <OrderPrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/order-issue-print" 
            render = { props =>(
              <OrderIssuePrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/order-cust-print" 
            render = { props =>(
              <OrderCustPrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/order-manu-print" 
            render = { props =>(
              <OrderManuPrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/gold-smith-master" 
            render = { props =>(
              <GoldsmithMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/gold-smith-receipt-entry" 
            render = { props =>(
              <GoldsmithReceiptEntry {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/gold-smith-issue-entry" 
            render = { props =>(
              <GoldsmithIssueEntry {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/gold-smith-stock-report" 
            render = { props =>(
              <GoldsmithStockReport {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/gold-smith-book" 
            render = { props =>(
              <GoldsmithBook {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/gold-smith-book-print" 
            render = { props =>(
              <GoldsmithBookPrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-receipt-entry" 
            render = { props =>(
              <SupplierReceiptEntry {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-issue-entry" 
            render = { props =>(
              <SupplierIssueEntry  {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/supplier-stock-report" 
            render = { props =>(
              <SupplierStockReport {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/supplier-book" 
            render = { props =>(
              <SupplierBook {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/supplier-book-print" 
            render = { props =>(
              <SupplierBookPrint {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            


        <Route exact path="/client-master" 
            render = { props =>(
              <AgentMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/client-list" 
            render = { props =>(
              <AgentList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          {/* Customer */}
            <Route exact path="/customer-master" 
            render = { props =>(
              <CustomerMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/customer-list" 
            render = { props =>(
              <CustomerList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/customer-area-wise-list" 
            render = { props =>(
              <CustomerListArea {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-state-wise-list" 
            render = { props =>(
              <CustomerListState {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-due-report" 
            render = { props =>(
              <CustomerListDue {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-due-wise-report" 
            render = { props =>(
              <CustomerListDueWise {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-area-wise-due-report" 
            render = { props =>(
              <CustomerListDueArea {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-over-due-report" 
            render = { props =>(
              <CustomerListDueOver {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/customer-overall-balance-report" 
            render = { props =>(
              <CustomerListDueOverBl {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-receipts-report" 
            render = { props =>(
              <CustomerListDueReceipt {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/customer-bills-report" 
            render = { props =>(
              <CustomerListDueBill {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/supplier-list" 
            render = { props =>(
              <SupplierList {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/supplier-area-wise-list" 
            render = { props =>(
              <SupplierListArea {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-master" 
            render = { props =>(
              <SupplierMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-due-report" 
            render = { props =>(
              <SupplierListDue {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-wise-due-report" 
            render = { props =>(
              <SupplierListDueSupplier {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-over-due-report" 
            render = { props =>(
              <SupplierListDueOver {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-payment-wise-report" 
            render = { props =>(
              <SupplierListDuePayment {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-wise-payment-report" 
            render = { props =>(
              <SupplierListDuePaymentWise {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/supplier-bill-report" 
            render = { props =>(
              <SupplierListDueBill {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/profile" 
            render = { props =>(
              <Profile {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/gstr-purchase-return-reports" 
            render = { props =>(
              <GstrPurchaseRReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/gstr-purchase-reports" 
            render = { props =>(
              <GstrPurchaseReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/gstr-sales-reports" 
            render = { props =>(
              <GstrSalesReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/gstr-sales-return-reports" 
            render = { props =>(
              <GstrSalesRReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>


          <Route exact path="/gstr-purchase-return-summary" 
            render = { props =>(
              <SummaryGstrPurchaseRReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/gstr-purchase-summary" 
            render = { props =>(
              <SummaryGstrPurchaseReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/gstr-sales-summary" 
            render = { props =>(
              <SummaryGstrSalesReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/gstr-sales-return-summary" 
            render = { props =>(
              <SummaryGstrSalesRReports {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>


            {/* Setting Menu */}
          <Route exact path="/setting" 
            render = { props =>(
              <SettingRoutes {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/web-setting" 
            render = { props =>(
              <WebSetting {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/tax-setting" 
            render = { props =>(
              <TextSetting {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/add-web-setting" 
            render = { props =>(
              <WebSettingAdd {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/deafult-web-setting" 
            render = { props =>(
              <WebSettingDefault {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/update-web-setting" 
            render = { props =>(
              <WebSettingUpdate {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/branch-setting" 
            render = { props =>(
              <BranchSetting {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/sms-setting" 
            render = { props =>(
              <SmsSetting {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/whatsapp-setting" 
            render = { props =>(
              <WhatsSetting {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/branchmaster" 
            render = { props =>(
              <BranchMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/addbranch" 
            render = { props =>(
              <AddBranch {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/updatebranch" 
            render = { props =>(
              <UpdateBranch {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/user-list" 
            render = { props =>(
              <UserMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
            <Route exact path="/user-list-branch" 
            render = { props =>(
              <UserListBranch {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/user-master" 
            render = { props =>(
              <AddUser {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          
          <Route exact path="/branch-user-master" 
            render = { props =>(
              <AddUserBranch {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
             <Route exact path="/update-user" 
            render = { props =>(
              <UpdateUser {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/headuser-list" 
            render = { props =>(
              <HeadUserMaster {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>

          <Route exact path="/headuser-master" 
            render = { props =>(
              <AddHeadUser {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/uderdev" 
            render = { props =>(
              <UnderDev {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/error" 
            render = { props =>(
              <ApiFail {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route exact path="/logout" 
            render = { props =>(
              <Logout {...props} handleLogin={this.handleLogin}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          <Route
            render = { props =>(
              <PageNotFound {...props}  loggedIn = {this.state.loggedIn}/>
            )}></Route>
          
        </Switch>
      </Router>
      </Suspense>
      </>
    );
  }
}