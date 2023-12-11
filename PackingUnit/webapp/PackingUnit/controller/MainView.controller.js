        sap.ui.define([
            'jquery.sap.global',
            "sap/dm/dme/podfoundation/controller/PluginViewController",
            "sap/ui/model/json/JSONModel",
            "sap/m/MessageBox",
            "sap/m/MessageToast",
            'sap/m/MessagePopover',
            "sap/dm/dme/util/PlantSettings",
            "sap/ui/core/MessageType",
            "sap/ui/core/BusyIndicator",
            "../model/formatter",
            "sap/ui/model/Filter",
            "sap/ui/model/FilterOperator",
            "sap/m/library",
            "sap/m/Dialog",
            "sap/m/Button",
            "sap/m/Text"
        
        ], function (jQuery, PluginViewController, JSONModel,MessageBox,MessageToast,MessagePopover,PlantSettings,MessageType, BusyIndicator,formatter,Filter,FilterOperator,mobileLibrary, Dialog,Button,Text) {
            "use strict";
            var that = this;
        var oSfcArray=[];
        
        var sfcDetail,classDetail,
        isCatchWeight = false, isProductionCount = false,
        bomDetails,
        orderDetail,
        ORDERDetail,
        rootSFC = "",
        podModelData,
        materialDetails,
        responseGetWorkcenter,
        BATCH_DIALOG_FILTER_FIELD = "batchNumber",
        
        MAT_CUSTOM_BRAND_NAME = "BRAND_NAME",
        MAT_CUSTOM_CUSTOMER_UPC = "CUSTOMER_UPC",
        MAT_CUSTOM_GTIN = "GTIN",
        MAT_CUSTOM_PRODUCT_SIZE = "PRODUCT_SIZE",
        ORDER_CUSTOM_CUSTOMER_PO_NUMBER = "CUSTOMER_PO_NUMBER" ,
        WC_CUSTOM_CERTIFICATION_USDA = "CERTIFICATION_USDA" ,
        WC_CUSTOM_CERTIFICATION_ISSCL = "CERTIFICATION_ISSCL" ,
        WC_CUSTOM_FACILITY_ADDRESS = "FACILITY_ADDRESS" ,
        WC_CUSTOM_FEI = "FEI" ,
        WC_CUSTOM_PLANT_USDC = "PLANT_USDC",
        WC_CUSTOM_BRC = "BRC", 
        WC_CUSTOM_PLANT_CODE = "PLANT_CODE", 
        WC_CUSTOM_SHELFISH_SHIPPER_CERT = "SHELFISH_SHIPPER_CERT", 
        orderCustomDataForPrint = {},
        materialCustomDataForPrint ={},
        wcCustomDataForPrint = {};
        
              // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;
        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;
        
        var materialASINCharcValue = "";
        var materialALLERGEN1CharcValue = "";
        var materialALLERGEN2CharcValue = "";
        var materialALLERGEN3CharcValue = "";
        var materialALLERGEN4CharcValue = "";
        var materialSCINAME1CharcValue = "";
        var materialSCINAME2CharcValue = "";
        var materialCustBrandCharcValue = "";
        var materialCustNameCharcValue = "";
        var materialCustNumberCharcValue = "";
        var materialCustReqCharcValue = "";
        var materialDistByNameCharcValue = "";
        var materialDistByAdd1CharcValue = "";
        var materialDistByAdd2CharcValue = "";
        var materialPCountCharcValue = "";
        var materialHandlingInst1CharcValue = "";
        var materialHandlingInst2CharcValue = "";
        var materialHandlingInst3CharcValue = "";
        var materialLabelFormCharcValue = "";
        var materialLabelNameCharcValue = "";
        var materialprodFormCharcValue = "";
        var materialCustomerPLUCharcValue = "";
        var materialCubeCharcValue = "";
        var materialItemIngredientsCharValue = "";
        
            return PluginViewController.extend("shoubii.custom.plugins.PackingUnit.PackingUnit.controller.MainView", {
                formatter: formatter,
                onInit: function () {
                    var that = this;
                    PluginViewController.prototype.onInit.apply(this, arguments);
        
                    
        
                    this.SFCDataModel= new JSONModel();
                    this.getView().setModel(this.SFCDataModel,"SFCDataModel")
        
                    this.DataModel= new JSONModel();
                    this.getView().setModel(this.DataModel,"DataModel")
        
                    this.HUModel= new JSONModel();
                    this.getView().setModel(this.HUModel,"HUModel")
        
                    this.HUFragModel= new JSONModel();
                    this.getView().setModel(this.HUFragModel,"HUFragModel")
                    this.SFCModel= new JSONModel();
                    this.getView().setModel(this.SFCModel,"SFCModel")  
                    this.PackSFCModel= new JSONModel();
                    this.getView().setModel(this.PackSFCModel,"PackSFCModel")    
                    this.preloadData();
                    this.HULastPrintModel= new JSONModel();
                    this.getView().setModel(this.HULastPrintModel,"HULastPrintModel")    
                },
        
        
        
        
                onAfterRendering: function(){
                   
                    this.getView().byId("backButton").setVisible(this.getConfiguration().backButtonVisible);
                    this.getView().byId("closeButton").setVisible(this.getConfiguration().closeButtonVisible);
                    
                    this.getView().byId("headerTitle").setText(this.getConfiguration().title);
                    this.getView().byId("textPlugin").setText(this.getConfiguration().text); 
        
                },
        
                onBeforeRenderingPlugin: function () {
        
                    
                    
                },
        
                isSubscribingToNotifications: function() {
                    
                    var bNotificationsEnabled = true;
                   
                    return bNotificationsEnabled;
                },
        
        
                getCustomNotificationEvents: function(sTopic) {
                    //return ["template"];
                },
        
        
                getNotificationMessageHandler: function(sTopic) {
        
                    //if (sTopic === "template") {
                    //    return this._handleNotificationMessage;
                    //}
                    return null;
                },
        
                _handleNotificationMessage: function(oMsg) {
                   
                    var sMessage = "Message not found in payload 'message' property";
                    if (oMsg && oMsg.parameters && oMsg.parameters.length > 0) {
                        for (var i = 0; i < oMsg.parameters.length; i++) {
        
                            switch (oMsg.parameters[i].name){
                                case "template":
                                    
                                    break;
                                case "template2":
                                    
                                
                                }        
                  
        
                            
                        }
                    }
        
                },
                // getOrderdetails:function(){
                //     var that = this,output;
                //     var ORDER = this.getView().byId("id_Order");
                //     var Order = ORDER.getValue();
                //     var PLANT = PlantSettings.getCurrentPlant();
                //    var oArray=[];
                //    // var sUrl = "https://api.test.us20.dmc.cloud.sap/order/v1/orders?order=" +Order+ "&plant="+PLANT;
                //    // var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "/order/v1/orders?plant=" + PLANT + "&order=" + Order1;
                //    let orderDetail = jQuery.ajax({
                //     type: "GET",
                //     contentType: "application/json",
                //     url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/order/v1/orders?plant=" + PLANT + "&order=" + Order,
                //     async: false
            
                // });
                //     if (orderDetail) {
                //         var output = orderDetail;
                //         var data,sData;
                //         if (output) {
                //             sData = {
                //                 items: []
                //             }
        
                //             data = output.responseJSON.sfcs;
                            
                //             oSfcArray=data;
                //             for (var i = 0; i < data.length; i++) {
                //                 var sfc = data[i];
                //                 let values=that.getSFCdetails(sfc);
                //                 sData.items.push({"sfc":sfc,"quantity":values.quantity,"material":values.material.material,"materiaDesc":values.material.description,"UOM":output.responseJSON.erpUnitOfMeasure})
                               
                //             }
                //             that.SFCDataModel.setData(sData);
        
                //         }
                //     }
        
                
                // //return orderDetail;
                // },
        
         
                getOrderdetails:function(){
                    var that = this;
                    var order = this.getView().byId("id_Order").getValue();
                    var PLANT = PlantSettings.getCurrentPlant();
                    var ordermsg =  this._oPodController.getPublicApiRestDataSourceUri() + "order/v1/orders?order="+order+"&plant="+PLANT;
        
        
                    let ORDERDetail =jQuery.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url:ordermsg,
                        async: false
                    });
               var data = ORDERDetail.responseJSON
                      if(data.code){
                        MessageBox.error("invalid Order Number");
                           
                            //var oData=oSfcArray;
                            
                        }else {
                            // oGlobalBusyDialog.close();
                            // data="";
                           
                            }
                        return data;
                },
               
                getSFCdetails:function(sfc){
                    var that = this;
                    var PLANT = PlantSettings.getCurrentPlant();
                    var data,output;
                    var oGlobalBusyDialog = new sap.m.BusyDialog();
                    oGlobalBusyDialog.open();
        
                    var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "sfc/v1/sfcdetail?plant="+PLANT+"&sfc="+sfc;
                
                    let SFCDetail =jQuery.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url:sUrl,
                        async: false
                    });
                      if(SFCDetail){
                        oGlobalBusyDialog.close();
                            data = SFCDetail.responseJSON;
                            //var oData=oSfcArray;
                            
                        }else {
                            oGlobalBusyDialog.close();
                            data="";
                            }
                        return data;
                },
        
                cleatdata:function(){
                    var sData = {
                        items: []
                    }
                    this.getView().byId("id_Order").setValue("");
                    this.SFCDataModel.setData(sData);
                 
                },
        
                newfunctio:function(sfc){
                    var that = this,output;
                    var oGlobalBusyDialog = new sap.m.BusyDialog();
                    oGlobalBusyDialog.open();
                    var ORDER = this.getView().byId("id_Order");
                    var Order = ORDER.getValue();
                    var PLANT = PlantSettings.getCurrentPlant();
                    var oTable=this.getView().byId("Packing");
                    var aSelectedItems = oTable.getSelectedItems();
                    var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "sfc/v1/sfcdetail?plant="+PLANT+"&sfc="+sfc;
                
                    // let SFCDetail =jQuery.ajax({
                    //     type: "GET",
                    //     contentType: "application/json",
                    //     url:sUrl,
                    //     async: false
                    // });
                    
                    if(Order!=""&&Order!=undefined&&Order!=null){
                   let orderDetail = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    headers: { 'X-Dme-Plant': PLANT },
                    
                    url:"/sapdmdmepod/dme/packing.svc/GetSfcList()?$filter=contains(shopOrder,'"+Order+"') and status eq 'IN_QUEUE' and status eq 'ACTIVE' and status eq 'DONE'&$skip=0&$top=20",
                   // url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/order/v1/orders?plant=" + PLANT + "&order=" + Order,
                    async: false
                    
                });
                var oData=orderDetail.responseJSON.value;
                if(oData){
                var sData = {
                    items: []
                }
                sData.items=oData;
                for(var i=0;i<oData.length;i++){
                    var packqyt=oData[i].quantity-oData[i].availableQuantity
                    oData[i].packedQuantity=packqyt;
                    oData[i].orginalpackQuantity=oData[i].availableQuantity;
                }
                this.SFCDataModel.setData(sData);
                oGlobalBusyDialog.close();
            }
                }else{
                    oGlobalBusyDialog.close();
                    that.showErrorMessage("Enter a Order number", false, true, MessageType.Error);
                   
                }},
        
                
         /* *********************************************************Create and confirm pallet************************************************************************** */                  
        
                CreateandConfrimPallet: function(oEvent) {
                    var that = this;
                    var PLANT = PlantSettings.getCurrentPlant();
                   // check = false;
                    var osmodel = that.SFCDataModel.getData();
                    var oSelectedPaths = this.getView().byId("Packing").getSelectedContextPaths();
                    // In your JavaScript code
                    var url = "https://api.test.us20.dmc.cloud.sap/packingUnits/v1/packingUnits";
                    
        
                    var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "/packingUnits/v1/packingUnits";
        
                    var dsfc,dquantity;
                    
                    var cleardata = {
                        Order: []
                    };
                    
                    var livepayload=  {
                        "sfc": {
                          "plant": PLANT,
                          "sfc": ""
                        },
                        "quantity": "",
                        "unitOfMeasure": ""
                      };
        
                    var sPayload={
                        
                            "plant": PLANT,
                            "status": "OPEN",
                            "material": {
                              "plant": PLANT,
                              "material": "000000000001990007",
                              "version": "ERP001"
                            },
                            "content": []
                           
                          
                      };
                    if(oSelectedPaths.length!=0){
                    that.ajaxPostRequest(sUrl, sPayload, function(oResponseData) {
                        if (oResponseData) {
                            var output = oResponseData;
                            var data;
                            var HUNumber;
                            if (output.number&&output.number!=undefined&&output.number!=null) {
                                HUNumber=output.number;                    
                                that.sPackingunit(HUNumber,oEvent);
        
                            } else {
                                that.showErrorMessage(output.message, false, true, MessageType.Error)
                            }
                            return output;
                        }
                    },            
                    function(oError, sHttpErrorMessage) {
                        that.showErrorMessage(oError.error.message, false, true, MessageType.Error)
        
                    });
                }else{
        
                    that.showErrorMessage("Atleast select one SFC", false, true, MessageType.Error)
                }
                },
                    sPackingunit:function(HUNumber){
                        var that = this;
                        var oSelectedPaths = this.getView().byId("Packing").getSelectedContextPaths();
                        var PLANT = PlantSettings.getCurrentPlant();
                        var sUrl= this._oPodController.getPublicApiRestDataSourceUri() + "packingUnits/v1/packingUnits/content?plant="+PLANT+"&packingUnit="+HUNumber;
                        var key="REG_dacfaa2c-92f1-4fd3-8d73-4ee8859be992"
                        var sPayload=[];
                      var oUpdatedSFC="";    
                      for(var i=0;i<oSelectedPaths.length;i++){
                            var oSelectedObject=this.getView().getModel("SFCDataModel").getObject(oSelectedPaths[i]);
                            var oRow={"sfc":"","quantity":""};
                            oRow.sfc=oSelectedObject.sfc;
                            oRow.quantity=oSelectedObject.availableQuantity;
                            sPayload.push(oRow);
                            oUpdatedSFC=oUpdatedSFC+oSelectedObject.sfc+",";
                      }         
                        that.ajaxPostRequest(sUrl,sPayload, function(oResponseData) {
                            if (oResponseData) {
                                var output = oResponseData;
                                var data;
                                     that.PackHU(HUNumber,oUpdatedSFC);
                                     that.newfunctio();
                                    //  that.onCloseDialogforUnusedHU();
                                     that.getView().byId("Packing").removeSelections()
                                    
                                
                            }                
                        },function(oError, sHttpErrorMessage) {
                            // Your Code for Error
                            that.showErrorMessage(oError.error.message, false, true, MessageType.Error)
            
                        });
                    },
                    PackHU: function(HUNumber,oUpdatedSFC,mssg) {
                        var that = this;
                        var PLANT = PlantSettings.getCurrentPlant();
                        var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "packingUnits/v1/packingUnits/pack";                 
                        var sPayload={
                            
                                "plant": PLANT,
                                "packingUnitNumber": HUNumber    
                          };
                        that.ajaxPostRequest(sUrl, sPayload, function(oResponseData) {
                            if (oResponseData) {
                                if(!mssg){
                                that.showSuccessMessage("Pallet ID "+HUNumber+ " is created and packed the selected SFcs "+oUpdatedSFC+" ", false, true, MessageType.Success);
                                }else{
                                    that.showSuccessMessage(mssg, false, true, MessageType.Success);
                                }}
                        },              
                        function(oError, sHttpErrorMessage) {
                            // Your Code for Error
                            that.showErrorMessage(oError.detail, false, true, MessageType.Error)
            
                        });
                    },    
                    
                    
        /* *********************************************************END************************************************************************** */           
        
                    Packingunits:function(sfc){
                        var that = this,output;
                        var oGlobalBusyDialog = new sap.m.BusyDialog();
                        oGlobalBusyDialog.open();
                        var ORDER = this.getView().byId("id_Order");
                        var Order = ORDER.getValue();
                        var oSelectedItem = sap.ui.getCore().byId("UnPacking").getSelectedContextPaths();
                        var oSelectedObject=this.getView().getModel("HUModel").getObject(oSelectedItem[0]);
                        var PLANT = PlantSettings.getCurrentPlant();
                        if(oSelectedItem.length!=0){
                        if(oSelectedObject.status=="OPEN"){
                       let orderDetail = jQuery.ajax({
                        type: "GET",
                        contentType: "application/json",
                        headers: { 'X-Dme-Plant': PLANT },
                        
                        url:"/sapdmdmepod/dme/packing.svc/GetSfcList()?$filter=contains(shopOrder,'"+Order+"') and status eq 'IN_QUEUE' and status eq 'ACTIVE' and status eq 'DONE'&$skip=0&$top=20",
                       // url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/order/v1/orders?plant=" + PLANT + "&order=" + Order,
                        async: false
                        
                    });
                    var oData=orderDetail.responseJSON.value;
                    if(oData){
                    var sData = {
                        items: []
                    }
                    sData.items=oData;
                    for(var i=0;i<oData.length;i++){
                        var packqyt=oData[i].quantity-oData[i].availableQuantity
                        oData[i].packedQuantity=packqyt;
                    }
                    this.PackSFCModel.setData(sData);
                    that.PackPopup();
                    oGlobalBusyDialog.close();
                }
                    }else{
                        that.showErrorMessage("Please select Open Status Pallet ID", false, true, MessageType.Error);
                        oGlobalBusyDialog.close();
                    }}else{
                        that.showErrorMessage("Please select a row", false, true, MessageType.Error);
                        oGlobalBusyDialog.close();
                    }},
                    PackPopup:function(sfc){
                        if(!this.sDbox){
                            this.sDbox = sap.ui.xmlfragment("shoubii.custom.plugins.PackingUnit.PackingUnit.view.PackList",this);
                            this.getView().addDependent(this.sDbox);
                              }
                              this.sDbox.open();
                              
                    },
        
                    onClose:function(){
                        this.PackSFCModel.setData(null);
                        sap.ui.getCore().byId("UnPacking").removeSelections()
                        this.sDbox.close();
                       },
        
        
        /* *********************************************************Get HU LIST for UNPACK************************************************************************** */           
                      
                getHUlist:function(){
                    var that = this,output;  
                    var ORDER = this.getView().byId("id_Order");
                    var order = ORDER.getValue();
                    var PLANT = PlantSettings.getCurrentPlant();
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "MMM dd,yyyy HH:mm:ss"
                    });
                   let HUList = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    headers: { 'X-Dme-Plant': PLANT },
                    url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='"+order+"',material='')?$filter=status eq 'CLOSED'&$orderby=modifiedDateTime desc&$skip=0&$top=10000",
                    async: false
                    
                });
                var oData=HUList.responseJSON.value,vData=[];
                
                if(oData){
                    for(var i=0;i<oData.length;i++)
                    {
                        if(oData[i].status=="CLOSED"){
                        var fdateFormatted = oDateFormat.format(new Date(oData[i].modifiedDateTime));
                        oData[i].modifiedCONDateTime=fdateFormatted
                        
                        vData.push(oData[i]);
                        }
                    }
                var sData = {
                    items: []
                }
                sData.items=vData;
                that.HUModel.setData(sData);
                if(vData.length!=0){
                that.HUListPopup();
                }else{
                    that.showErrorMessage("No Pallet ID's are in Closed Status", false, true, MessageType.Error);
                }
            }
            
                },
            
             HUListPopup:function(){
                if(!this.Dbox){
                    this.Dbox = sap.ui.xmlfragment("shoubii.custom.plugins.PackingUnit.PackingUnit.view.PackingList",this);
                    this.getView().addDependent(this.Dbox);
                      }
                      this.Dbox.open();
                      
            },
            onCloseDialog:function(){
              //  this.HUModel.setData(null);
                this.Dbox.close();
               },
        /* *********************************************************UNPACK HU************************************************************************** */           
               UnPackingunits:function(oEvent){             
                var that = this;
                var oGlobalBusyDialog = new sap.m.BusyDialog();
                oGlobalBusyDialog.open();
                var order = this.getView().byId("id_Order").getValue();
                 var oSelectedItem = sap.ui.getCore().byId("UnPacking").getSelectedContextPaths();
                 if(oSelectedItem.length!=0){
                var oSelectedObject=this.getView().getModel("HUModel").getObject(oSelectedItem[0]);
                var HUnumberID = oSelectedObject.number
                if(oSelectedObject.status!="OPEN"){
                var PLANT = PlantSettings.getCurrentPlant();
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "MMM dd,yyyy HH:mm:ss"
                });
                var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "packingUnits/v1/packingUnits/unpack";   
                var unpacks={
                      "packingUnitNumber": HUnumberID,
                      "plant": PLANT
              };       
                that.ajaxPostRequest(sUrl,unpacks, function(oResponseData) {
                    if (oResponseData) {
                        var output = oResponseData;
                        var data;
                        var message="Pallet ID "+HUnumberID+ " is Unpacked successfully" 
                        that.showSuccessMessage(message, true, true, MessageType.Success)
                        that.gethudetails(HUnumberID)
                        sap.ui.getCore().byId("UnPacking").removeSelections()
                        //that.newfunctio();
                        
                        oGlobalBusyDialog.close();
                        that.onCloseDialog();
                            //  let HUList = jQuery.ajax({
                            //     type: "GET",
                            //     contentType: "application/json",
                            //     headers: { 'X-Dme-Plant': PLANT },
                            //     url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='"+order+"',material='')?$orderby=modifiedDateTime desc&$skip=0&$top=20",
                            //     async: false
                                
                            // });
                        
                    
                        //     var oData=HUList.responseJSON.value;
                        //     var vData=[];
                        //     if(oData){
                        //         for(var i=0;i<oData.length;i++)
                        //         if(oData[i].status=="CLOSED"){
                        //         {
                        //             var fdateFormatted = oDateFormat.format(new Date(oData[i].modifiedDateTime));
                        //             oData[i].modifiedCONDateTime=fdateFormatted
                        //         }
                        //         vData.push(oData[i])
                        //         }
                        //     var sData = {
                        //         items: []
                        //     }
                        //     sData.items=vData;
                        //     that.HUModel.setData(sData);
                           
                        // }
                    }                
                },function(oError, sHttpErrorMessage) {
                    // Your Code for Error
                    that.showErrorMessage(oError.detail, false, true, MessageType.Error)
                    oGlobalBusyDialog.close();
                });
                    } 
                    else {
                    that.showErrorMessage("Selected Pallet is already in Open Status", false, true, MessageType.Error);
                   oGlobalBusyDialog.close();
                }
            }else{
        
                that.showErrorMessage("Atleast select one Pallet", false, true, MessageType.Error)
                oGlobalBusyDialog.close();
        
            }
            },
        
        /* *********************************************************UNPACK HU************************************************************************** */           
        UnPackingunitsforHU:function(oEvent){             
            var that = this;
            var oGlobalBusyDialog = new sap.m.BusyDialog();
            oGlobalBusyDialog.open();
            var order = this.getView().byId("id_Order").getValue();
             var oSelectedItem = sap.ui.getCore().byId("UnPacking").getSelectedContextPaths();
             if(oSelectedItem.length!=0){
            var oSelectedObject=this.getView().getModel("HUModel").getObject(oSelectedItem[0]);
            var HUnumberID = oSelectedObject.number
            if(oSelectedObject.status!="OPEN"){
            var PLANT = PlantSettings.getCurrentPlant();
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "MMM dd,yyyy HH:mm:ss"
            });
            var sUrl = this._oPodController.getPublicApiRestDataSourceUri() + "packingUnits/v1/packingUnits/unpack";   
            var unpacks={
                  "packingUnitNumber": HUnumberID,
                  "plant": PLANT
          };       
            that.ajaxPostRequest(sUrl,unpacks, function(oResponseData) {
                if (oResponseData) {
                    var output = oResponseData;
                    var data;
                    var message="Pallet ID"+HUnumberID+ " is Unpacked successfully" 
                    that.showSuccessMessage(message, true, true, MessageType.Success)
                    that.gethudetails(HUnumberID)
                        //  let HUList = jQuery.ajax({
                        //     type: "GET",
                        //     contentType: "application/json",
                        //     headers: { 'X-Dme-Plant': PLANT },
                        //     url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='"+order+"',material='')?$orderby=modifiedDateTime desc&$skip=0&$top=20",
                        //     async: false
                            
                        // });          
                        oGlobalBusyDialog.close();
                        that.onSubmit();  
                        that.onCloseDialog();
                     //   var oData=HUList.responseJSON.value;
                    //    var vData=[];
                    //     if(oData){
                    //         for(var i=0;i<oData.length;i++)
                    //         if(oData[i].status=="CLOSED"){
                    //         {
                    //             var fdateFormatted = oDateFormat.format(new Date(oData[i].modifiedDateTime));
                    //             oData[i].modifiedCONDateTime=fdateFormatted
                    //         }
                    //         vData.push(oData[i])
                    //         }
                    //     var sData = {
                    //         items: []
                    //     }
                    //     sData.items=vData;
                    //     that.HUModel.setData(sData);
                       
                       
                    // }
                }                
            },function(oError, sHttpErrorMessage) {
                // Your Code for Error
                that.showErrorMessage(oError.error.detail, false, true, MessageType.Error)
            });
                } 
                else {
                that.showErrorMessage("Selected Pallet ID is already in Open Status", false, true, MessageType.Error);
               // oGlobalBusyDialog.close();
            }
        }else{
        
            that.showErrorMessage("Atleast select one Pallet ID", false, true, MessageType.Error)
            oGlobalBusyDialog.close();
        
        }
        },
            gethudetails:function(HUnumberID){
                var that = this;
                var PLANT=PlantSettings.getCurrentPlant();
                var details = sap.ui.getCore().byId("UnPacking").getSelectedContextPaths();       
                 let SFCList = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/packingUnits/v1/packingUnits?plant=" + PLANT + "&number=" + HUnumberID,
                     async: false
            
                    });
                    var oData=SFCList.responseJSON.content;
                    that.removeContentinHU(HUnumberID,oData)
                  },
            removeContentinHU:function(HUnumberID,oData){
                var that = this;
                var PLANT = PlantSettings.getCurrentPlant();
                var order = this.getView().byId("id_Order").getValue();
                var sRemoveContentKey="REG_d5b63c45-5034-4ad0-948d-f7c99b6a5ddd";
                //var sUrl= this._oPodController.getPublicApiRestDataSourceUri() + "packingUnits/v1/packingUnits/content?plant="+PLANT+"&packingUnit="+HUnumberID;
                var sUrl = this.getPodController()._oPodController.getPublicApiRestDataSourceUri()
                + "/pe/api/v1/process/processDefinitions/start?key=" + sRemoveContentKey + "&async=false&logLevel=Debug";
                var sPayload=[];
              var oUpdatedSFC="";    
              for(var i=0;i<oData.length;i++){
                    var oRow={"sfc":"","quantity":""};
                    oRow.sfc=oData[i].sfc.sfc;
                    oRow.quantity=oData[i].quantity;
                    sPayload.push(oRow);
                    oUpdatedSFC=oUpdatedSFC+oData[i].sfc.sfc+",";
              }       
                var payload={
                    "PU":HUnumberID,
                    "plant":PLANT,
                    "httpreq":sPayload
                }
             that.ajaxPostRequest(sUrl,payload, function(oResponseData) {
                    if (oResponseData) {
                    //     var output = oResponseData;
                    //     var data;
                    //     var ORDER = that.getView().byId("id_Order");
                    //     let HUList = jQuery.ajax({
                    //         type: "GET",
                    //         contentType: "application/json",
                    //         headers: { 'X-Dme-Plant': PLANT },
                    //         url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='"+ORDER+"',material='')?$orderby=modifiedDateTime desc&$skip=0&$top=20",
                    //         async: false
                            
                    //     });  
                    //     var oData=HUList.responseJSON.value;
                    //     if(oData){
                    //     var sData = {
                    //         items: []
                    //     }
                    //     sData.items=oData;
                    //     that.HUModel.setData(sData);
                    //     sap.ui.getCore().byId("UnPacking").removeSelections() 
                    // }
                    } 
                    let orderDetail = jQuery.ajax({
                        type: "GET",
                        contentType: "application/json",
                        headers: { 'X-Dme-Plant': PLANT },
                        
                        url:"/sapdmdmepod/dme/packing.svc/GetSfcList()?$filter=contains(shopOrder,'"+order+"') and status eq 'IN_QUEUE' and status eq 'ACTIVE' and status eq 'DONE'&$skip=0&$top=20",
                       // url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/order/v1/orders?plant=" + PLANT + "&order=" + Order,
                        async: false
                        
                    });
                    var oData=orderDetail.responseJSON.value;
                    if(oData){
                    var sData = {
                        items: []
                    }
                    sData.items=oData;
                    for(var i=0;i<oData.length;i++){
                        var packqyt=oData[i].quantity-oData[i].availableQuantity
                        oData[i].packedQuantity=packqyt;
                    }
                    that.SFCDataModel.setData(sData);
                }               
                },
        
             /*   let HUList = jQuery.ajax({
                    type: "DELETE",
                    contentType: "application/json",
                    headers: { 'X-Dme-Plant': PLANT },
                    url:sUrl,
                    async: false
                    
                })*/
                
                
              function(oError, sHttpErrorMessage) {
                    // Your Code for Error
                    that.showErrorMessage(oError.error.message, false, true, MessageType.Error)
        
                });
            },
             OnHUlist:function(sfc){
                var that = this;
                var details = sap.ui.getCore().byId("UnPacking").getSelectedContextPaths();
                if (details.length!=0){
                var sfcs = this.getView().getModel("HUModel").getProperty(details[0]);
                var ORDER = this.getView().byId("id_Order");
                var Order = ORDER.getValue();
                var PLANT = PlantSettings.getCurrentPlant();
                   var oArray=[];
                
                 let SFCList = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/packingUnits/v1/packingUnits?plant=" + PLANT + "&number=" + sfcs.number,
                     async: false
            
                    });
                    var oData=SFCList.responseJSON;
                    if(oData){
                    var sData = {
                        items: []
                    }
                    // for (var i = 0; i <= sfcs.HUModel.length; i++) {
                    // if(values[i].number == Packing && values[i].sfc == Packing && values[i].quantity == Packing && values[i].unitOfMeasure == Packing ){
                        var data = {};
                        data.number=oData.number;
                        data.material=oData.material.material;
                        for(var i=0;i<oData.content.length;i++){
                            if(oData.content[i].sfc){
                        var sfc=oData.content[i].sfc.sfc;
                        var quantity=oData.content[i].quantity;
                        var unitOfMeasure=oData.content[i].unitOfMeasure;
                        var data={
                        "number":oData.number,
                        "material":oData.material.material,
                        "sfc":sfc,
                        "quantity":quantity,
                        "unitOfMeasure":unitOfMeasure
                        }
                         sData.items.push(data);
                    }
                        }
                       
                        var Packing = new JSONModel(sData);
                        this.getView().setModel(Packing,"Packing");
                         
                //     }
                // }
                    //sData.items=oData;
                    that.SFCModel.setData(sData);
                    that.SFCListPopup();
                }
            }else{
                that.showErrorMessage("Please select Pallet ID", false, true, MessageType.Error)
            }          
                  },
        
                SFCListPopup:function(sfc){
                if(!this.Dbox1){
                    this.Dbox1 = sap.ui.xmlfragment("shoubii.custom.plugins.PackingUnit.PackingUnit.view.HUDetails",this);
                    this.getView().addDependent(this.Dbox1);
                      }
                      this.Dbox1.open(); 
                    },
        
                onSubmit:function(){
                    this.SFCModel.setData("");
                    this.Dbox1.close();
                   },
                   onFilterHUnumber: function (oEvent) {
                    // add filter for search
                      var aFilters = [];
                     var sQuery = oEvent.getSource().getValue();
                     if (sQuery && sQuery.length > 0) {
                     var filter = new Filter("number", sap.ui.model.FilterOperator.Contains, sQuery);
                        aFilters.push(filter);
                     }
                     // update list binding
                     var oList =sap.ui.getCore().byId("UnPacking");
                     var oBinding = oList.getBinding("items");
                     oBinding.filter(aFilters,"Application");
                    },
                    onFilterHU: function (oEvent) {
                        // add filter for search
                          var aFilters = [];
                         var sQuery = oEvent.getSource().getValue();
                         if (sQuery && sQuery.length > 0) {
                         var filter = new Filter("number", sap.ui.model.FilterOperator.Contains, sQuery);
                            aFilters.push(filter);
                         }
                         // update list binding
                         var oList =sap.ui.getCore().byId("Packing");
                         var oBinding = oList.getBinding("items");
                         oBinding.filter(aFilters,"Application");
                        },
                        checkpackquantity:function(oEvent){
                            
                            // var selectedvalue=oEvent.getParameters().value;
                            // var oSelectedPaths = this.getView().byId("Packing").getSelectedContextPaths();
                            // var oSelectedRow = this.getView().getModel("SFCDataModel").getObject(oSelectedPaths[0]);
                            var oSelectedRow1 = oEvent.getSource().getParent().getBindingContext("SFCDataModel").getObject();
                            
                            if(oSelectedRow1.orginalpackQuantity>=oSelectedRow1.availableQuantity){
        
                            }
                            else{
                                this.showErrorMessage("Entered quantity "+oSelectedRow1.availableQuantity+" is greater than " +"selected SFC "+oSelectedRow1.sfc+" available quantity "+oSelectedRow1.orginalpackQuantity+" ", false, true, MessageType.Error);
                                oEvent.getSource().setValue(oSelectedRow1.orginalpackQuantity);
        
        
                                
                            }
                         
                        },
                
        
         /* *********************************************************Get unused HU LIST for PACK************************************************************************** */           
                
                getUnusedHUlist:function(oEvent){
                    var that = this,output;  
                    var ORDER = this.getView().byId("id_Order");
                    var oSelectedPaths = this.getView().byId("Packing").getSelectedContextPaths();
                    var order = ORDER.getValue();
                    var PLANT = PlantSettings.getCurrentPlant();
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "MMM dd,yyyy HH:mm:ss"
                    });
                    if(oSelectedPaths.length>0){
                   let HUList = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    headers: { 'X-Dme-Plant': PLANT },
                    url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='',material='')?$filter=status eq 'CLOSED'&$orderby=modifiedDateTime desc&$skip=0&$top=10000",
                    async: false
                    
                });
                var oData=HUList.responseJSON.value;
                var vData=[];
                if(oData){
                    for(var i=0;i<oData.length;i++){
                    
                    {
                        var fdateFormatted = oDateFormat.format(new Date(oData[i].modifiedDateTime));
                        oData[i].modifiedCONDateTime=fdateFormatted
                    }
                    if(oData[i].status=="OPEN"){
                    vData.push(oData[i]);
                    }
                }
                var sData = {
                    items: []
                }
                sData.items=vData;
                that.HUModel.setData(sData);
                if(sData.length!=0){
                that.UnusedHUListPopup();
                }else{
                    that.showErrorMessage("No Pallet ID's are in Open Status", false, true, MessageType.Error);
                }
            }
                }else{
                    that.showErrorMessage("Please select SFC", false, true, MessageType.Error);
                }},
            
             UnusedHUListPopup:function(){
                if(!this.Ubox){
                    this.Ubox = sap.ui.xmlfragment("shoubii.custom.plugins.PackingUnit.PackingUnit.view.PackList",this);
                    this.getView().addDependent(this.Ubox);
                      }
                      this.Ubox.open();
                      
            },
        
        
            sExistPackingunit:function(HUNumber){
                var that = this;
                var oGlobalBusyDialog = new sap.m.BusyDialog();
                        oGlobalBusyDialog.open();
                var oSelectedPaths = this.getView().byId("Packing").getSelectedContextPaths();
                var PLANT = PlantSettings.getCurrentPlant();
                var sUrl= this._oPodController.getPublicApiRestDataSourceUri() + "packingUnits/v1/packingUnits/content?plant="+PLANT+"&packingUnit="+HUNumber;
                var key="REG_dacfaa2c-92f1-4fd3-8d73-4ee8859be992"
                var sPayload=[];
              var oUpdatedSFC="";    
              for(var i=0;i<oSelectedPaths.length;i++){
                    var oSelectedObject=this.getView().getModel("SFCDataModel").getObject(oSelectedPaths[i]);
                    var oRow={"sfc":"","quantity":""};
                    oRow.sfc=oSelectedObject.sfc;
                    oRow.quantity=oSelectedObject.availableQuantity;
                    sPayload.push(oRow);
                    oUpdatedSFC=oUpdatedSFC+oSelectedObject.sfc+",";
              }         
                that.ajaxPostRequest(sUrl,sPayload, function(oResponseData) {
                    if (oResponseData) {
                        var output = oResponseData;
                        var data;
                        
        
                            // that.showSuccessMessage("HU Number "+HUNumber+ " is created and packed the selected SFcs "+oUpdatedSFC+" ", false, true, MessageType.Success);
                            // that.showSuccessMessage("The selected sfc(s) "+oUpdatedSFC+" is Packed with Existing HU Number "+HUNumber+ " ", false, true, MessageType.Success);
                            var mssg="The selected sfc(s) "+oUpdatedSFC+" is Packed with Existing Pallet ID "+HUNumber;
                            that.PackHU(HUNumber,oUpdatedSFC,mssg);
                             that.newfunctio();
                             that.onCloseDialogforUnusedHU();
                             that.getView().byId("Packing").removeSelections()
                             oGlobalBusyDialog.close();
        
                    }                
                },function(oError, sHttpErrorMessage) {
                    oGlobalBusyDialog.close();
                    // Your Code for Error
                    that.showErrorMessage(oError.error.message, false, true, MessageType.Error)
        
                });
            },
        
            packHUandAddContent:function(){
                var that=this;
                var details = sap.ui.getCore().byId("Packing").getSelectedContextPaths();
                var oGlobalBusyDialog = new sap.m.BusyDialog();
                oGlobalBusyDialog.open();
                if (details.length!=0){
                var sObject = this.getView().getModel("HUModel").getProperty(details[0]);
                that.sExistPackingunit(sObject.number);
                oGlobalBusyDialog.close();
                }else{
                    that.showErrorMessage("Please select HU Number", false, true, MessageType.Error);
                    oGlobalBusyDialog.close();
                }
            },
            onCloseDialogforUnusedHU:function(){
                sap.ui.getCore().byId("Packing").removeSelections();
                this.HUModel.setData(null);
                this.Ubox.close();
               },
        
         /* *********************************************************REPRINT LABEL************************************************************************** */           
        
                    onReprint:function(){
                    var that = this;  
                    var ORDER = this.getView().byId("id_Order");
                    var order = ORDER.getValue();
                    var PLANT = PlantSettings.getCurrentPlant();
                   let HUList = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    headers: { 'X-Dme-Plant': PLANT },
                    url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='"+order+"',material='')?$orderby=modifiedDateTime desc&$skip=0&$top=20",
                    async: false
                    
                });
            
        
                var oData=HUList.responseJSON.value, vData=[];
                if(oData){
                    for(var i=0;i<oData.length;i++){
                          if(oData[i].status=="CLOSED"){
                            var ContentQty =  oData[i].contentQuantity + " - SFC(s) Packed";
                            oData[i].contentQuantity=ContentQty;
                            vData.push(oData[i]);
        
                        } 
                    }
                  
                var sData = {
                    items: []
                }
                sData.items=vData;
                that.HUFragModel.setData(sData);
                if(vData.length!=0){
        
                        if(!this._pValueHelpDialog){
                            this._pValueHelpDialog = sap.ui.xmlfragment("shoubii.custom.plugins.PackingUnit.PackingUnit.view.Reprint",this);
                            this.getView().addDependent(this._pValueHelpDialog);
                              }
                              this._pValueHelpDialog.open();
                            } 
                            else {
                                that.showErrorMessage("No Pallet ID is available for this Order ", false, true, MessageType.Error);
                
                            }    
                    }else {
                        that.showErrorMessage("No Pallet ID is available for this Order ", false, true, MessageType.Error);
        
                    }},
                    // onCloseDialog1:function(){
                    //     this.HUModel.setData(null);
                    //     this._pValueHelpDialog.close();
                    //    },
        
                       _handleValueHelpClose: function (evt) {
                        var aSelectedItems = evt.getParameter("selectedItems"),
                            oMultiInput = this.byId("multiInputBatches");
                        if (aSelectedItems && aSelectedItems.length > 0) {
                            aSelectedItems.forEach(function (oItem) {
                                oMultiInput.addToken(new Token({
                                    text: oItem.getTitle()
                                }));
                            });
                        }
                    },
            
                    
                       _handleValueHelpSearch: function (oEvent) {
                        // add filter for search
                          var aFilters = [];
                         var sQuery = oEvent.getParameters().value;
                         if (sQuery && sQuery.length > 0) {
                         var filter = new Filter("number", sap.ui.model.FilterOperator.Contains, sQuery);
                            aFilters.push(filter);
                         }
                         // update list binding
                         var oList =sap.ui.getCore().byId("valueHelpDialog");
                         var oBinding = oList.getBinding("items");
                         oBinding.filter(aFilters,"Application");
                        },
                    
        /* *********************************************************lABEL MAPPING************************************************************************** */
        
        
        
        _onPhaseSelectionEvent: function (oEvent) {
            console.log('orderlist  reload triggered');
            var order = this.getPodSelectionModel().getSelection().shopOrder.shopOrder;
            if (podModelData.workCenter != this.getPodSelectionModel().selectedPhaseWorkCenter
                || podModelData.order != order 
                || podModelData.operation != this.getPodSelectionModel().operations[0].operation) 
            {
                this.preloadData();
                // setTimeout(this.preloadData(), 5000); ;
            }
        
           // this.getView().byId("idCaseQty").focus();
        },
        
        _onOrderlistSelectEvent: function (oEvent) {
           
        },
        getClassification: function (aSelectedObject) {
            var that=this;
            ORDERDetail = that.getOrderdetails();
            var material = ORDERDetail.material.material
            // var material =podModelData.material;
            var className = "MATERIAL_CHARS";
            var classType = "001";
            var objectType = "MATERIAL";
            var objectKey = material;
            var PLANT = PlantSettings.getCurrentPlant(); 
            
            var sPayload = {
                
                    "plant": "1016",
                    "objectKeys": [
                        material
                    ],
                    "objectType": "MATERIAL",
                    "classType": classType,
                    "classes": [
                       "MATERIAL_CHARS"
                    ]
                 
            };
        
            var url = this._oPodController.getPublicApiRestDataSourceUri() + "/classification/v1/read";
            that.ajaxPostRequest(url, sPayload, function(oResponseData) {
                if (oResponseData) {
                var oCharList=oResponseData
                 that.getMaterialCharacterstics(oCharList,aSelectedObject);
              
                }
        
                },function (oError, sHttpErrorMessage) {
                    var err = oError || sHttpErrorMessage;
                    console.log(err);
                }     
            );  
        },
        
        getMaterialCharacterstics: function (oCharList,aSelectedObject,oSelectedObject) {
            var that=this;
            var material = podModelData.material;
           // var material = "MATERIAL";
            var className = "MATERIAL_CHARS";
            var classType = "001";
            var objectType = "MATERIAL";
            var objectKey = material;
            var PLANT = PlantSettings.getCurrentPlant(); 
          
            var catchWeightFlagCharName = "CW_FLAG";
            var parallelUOMCharName = "PARALLELUOM";
            var productionCountCharName = "PRODUCT_COUNT_FLAG";
            var bomAssemblyUOM, rawMaterialBaseUOM;
        
            var asinCharName = "ASIN";
            var allergen1CharName = "ALLERGEN_1";
            var allergen2CharName = "ALLERGEN_2";
            var allergen3CharName = "ALLERGEN_3";
            var allergen4CharName = "ALLERGEN_4";
            var scientificName1CharName = "SCIENTIFIC_NAME_1";
            var scientificName2CharName = "SCIENTIFIC_NAME_2";
            var customerBrandCharName = "CUSTOMER_BRAND";
            var customerNameCharName = "CUSTOMER_NAME";
            var customerNumberCharName = "CUSTOMER_NUMBER";
            var customerRequiredCharName = "CUSTOMER_REQUIRED";
            var distributedByNameCharName = "DISTRIBUTED_BY_NAME";
            var distributedByAdd1CharName = "DISTRIBUTED_BY_ADD_1";
            var distributedByAdd2CharName = "DISTRIBUTED_BY_ADD_2";
           
            var handlingInstructions1CharName = "HANDLING_INSTRUCTIONS_1";
            var handlingInstructions2CharName = "HANDLING_INSTRUCTIONS_2";
            var handlingInstructions3CharName = "HANDLING_INSTRUCTIONS_3";
            var labelFormCharName = "LABEL_FORM";
            var labelNameCharName = "LABEL_NAME";
            var productFormCharName = "PRODUCT_FORM";
            var customerPLUCharName = "CUSTOMER_PLU";
            var cubeCharName = "CUBE";
            var itemIngredientsCharName = "ITEM_INGREDIENTS";
        
            var materialCWCharcInternalId = "";
            var materialPUOMCharcInternalId = "";
            var materialPCountCharcInternalId = "";
            var materialASINCharcInternalId = "";
            var materialALLERGEN1CharcInternalId = "";
            var materialALLERGEN2CharcInternalId = "";
            var materialALLERGEN3CharcInternalId = "";
            var materialALLERGEN4CharcInternalId = "";
            var materialSCINAME1CharcInternalId = "";
            var materialSCINAME2CharcInternalId = "";
            var materialCustBrandCharcInternalId = "";
            var materialCustNameCharcInternalId = "";
            var materialCustNumberCharcInternalId = "";
            var materialCustReqCharcInternalId = "";
            var materialDistByNameCharcInternalId = "";
            var materialDistByAdd1CharcInternalId = "";
            var materialDistByAdd2CharcInternalId = "";
          
            var materialHandlingInst1CharcInternalId = "";
            var materialHandlingInst2CharcInternalId = "";
            var materialHandlingInst3CharcInternalId = "";
            var materialLabelFormCharcInternalId = "";
            var materialLabelNameCharcInternalId = "";
            var materialprodFormCharcInternalId = "";
            var materialCustomerPLUCharcInternalId = "";
            var materialCubeCharcInternalId = "";
            var itemIngredientsCharInternalId = "";
        
            //Reset Global Variables
            materialASINCharcValue = "";
            materialALLERGEN1CharcValue = "";
            materialPCountCharcValue = "";
            materialALLERGEN2CharcValue = "";
            materialALLERGEN3CharcValue = "";
            materialALLERGEN4CharcValue = "";
            materialSCINAME1CharcValue = "";
            materialSCINAME2CharcValue = "";
            materialCustBrandCharcValue = "";
            materialCustNameCharcValue = "";
            materialCustNumberCharcValue = "";
            materialCustReqCharcValue = "";
            materialDistByNameCharcValue = "";
            materialDistByAdd1CharcValue = "";
            materialDistByAdd2CharcValue = "";
           
            materialHandlingInst1CharcValue = "";
            materialHandlingInst2CharcValue = "";
            materialHandlingInst3CharcValue = "";
            materialLabelFormCharcValue = "";
            materialLabelNameCharcValue = "";
            materialprodFormCharcValue = "";
            materialCustomerPLUCharcValue = "";
            materialCubeCharcValue = "";
            materialItemIngredientsCharValue = "";
        
           
            // var classificationRequest = {
            //     "plant": PLANT,
            //     "objectKeys": [
            //         objectKey
            //     ],
            //     "objectType": objectType,
            //     "classType": classType,
            //     "classes": [
            //         className
            //     ]
            // };
                //     var url = this._oPodController.getPublicApiRestDataSourceUri() + "/classification/v1/read?async=false";
                //    let response = this.ajaxPostRequest(url, classificationRequest, 
                //       function (classificationResponse) {
                    
                        if(oCharList){
                    isProductionCount = false;
                    console.log(oCharList);
                    var classificationAssignmentHeaders = oCharList.classificationAssignmentHeaders;
                    if (classificationAssignmentHeaders.length>0) {
                        var materialClassificationAssignmentHeaders = classificationAssignmentHeaders.filter(function (value, index, arr) {
                            return (value.classType == classType && value.objectKey == objectKey && value.objectType == objectType);
                        });
        
                        if (materialClassificationAssignmentHeaders.length > 0) {
                            var assignmentCharacteristicValues = materialClassificationAssignmentHeaders[0].assignmentCharacteristicValues;
        
                            var classificationClasses = oCharList.classificationClasses;
                            if (classificationClasses.length > 0) {
                                var materialclassificationClasses = classificationClasses.filter(function (value, index, arr) {
                                    return (value.name == className);
                                });
                                if (materialclassificationClasses.length > 0) {
                                    var characteristicDetails = materialclassificationClasses[0].characteristicDetails;
        
        
                                    for (var i = 0; i < characteristicDetails.length; i++) {
        
                                        var internalId = characteristicDetails[i].charcInternalId;
                                        switch (characteristicDetails[i].name) {
                                            case catchWeightFlagCharName:
                                                materialCWCharcInternalId = internalId;
                                                break;
                                            case parallelUOMCharName:
                                                materialPUOMCharcInternalId = internalId;
                                                break;
                                            case productionCountCharName:
                                                materialPCountCharcInternalId = internalId;
                                                break;
                                            case asinCharName:
                                                materialASINCharcInternalId = internalId;
                                                break;
                                            case allergen1CharName:
                                                materialALLERGEN1CharcInternalId = internalId;
                                                break;
                                            case allergen2CharName:
                                                materialALLERGEN2CharcInternalId = internalId;
                                                break;
                                            case allergen3CharName:
                                                materialALLERGEN3CharcInternalId = internalId;
                                                break;
                                            case allergen4CharName:
                                                materialALLERGEN4CharcInternalId = internalId;
                                                break;
                                            case scientificName1CharName:
                                                materialSCINAME1CharcInternalId = internalId;
                                                break;
                                            case scientificName2CharName:
                                                materialSCINAME2CharcInternalId = internalId;
                                                break;
                                            case customerBrandCharName:
                                                materialCustBrandCharcInternalId = internalId;
                                                break;
                                            case customerNameCharName:
                                                materialCustNameCharcInternalId = internalId;
                                                break;
                                            case customerNumberCharName:
                                                materialCustNumberCharcInternalId = internalId;
                                                break;
                                            case customerRequiredCharName:
                                                materialCustReqCharcInternalId = internalId;
                                                break;
                                            case distributedByNameCharName:
                                                materialDistByNameCharcInternalId = internalId;
                                                break;
                                            case distributedByAdd1CharName:
                                                materialDistByAdd1CharcInternalId = internalId;
                                                break;
                                            case distributedByAdd2CharName:
                                                materialDistByAdd2CharcInternalId = internalId;
                                                break;                                         
                                            case handlingInstructions1CharName:
                                                materialHandlingInst1CharcInternalId = internalId;
                                                break;
                                            case handlingInstructions2CharName:
                                                materialHandlingInst2CharcInternalId = internalId;
                                                break;
                                            case handlingInstructions3CharName:
                                                materialHandlingInst3CharcInternalId = internalId;
                                                break;
                                            case labelFormCharName:
                                                materialLabelFormCharcInternalId = internalId;
                                                break;
                                            case labelNameCharName:
                                                materialLabelNameCharcInternalId = internalId;
                                                break;
                                            case productFormCharName:
                                                materialprodFormCharcInternalId = internalId;
                                                break;
                                            case customerPLUCharName:
                                                materialCustomerPLUCharcInternalId = internalId;
                                                break;
                                            case cubeCharName:
                                                materialCubeCharcInternalId = internalId;
                                                break;
                                            case itemIngredientsCharName:
                                                itemIngredientsCharInternalId = internalId;
                                                break;
        
                                        } //end of switch
        
                                    } //end of for loop
        
                                    if (materialCWCharcInternalId !="") {
                                   
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCWCharcInternalId);
                                        });
        
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            var materialCWCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
        
                                            console.log(materialCWCharcValue);
        
                                            if (materialCWCharcValue == "X") {
                                                var materialCWCharcValue = "1";
                                            }
                                            else {
                                                var materialCWCharcValue = "";
                                                console.log(materialCWCharcValue);
                                            }
                                        }
                                       
                                    }
                                    // Parallel UOM Config 
                                    if (isCatchWeight == true && materialPUOMCharcInternalId != "") {
                                       
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialPUOMCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            var materialPUOMCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialPUOMCharcValue);
                                        }                                    
                                    }
                                    else {
                                       // that.setParallelUOMListModel("");
                                       // that.getView().byId("idCWUOM").setSelectedKey("");
                                    }
                                    if (materialPCountCharcInternalId != "") {                              
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialPCountCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            var materialPCountCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialPCountCharcValue);
                                        }     
                                    }
                                    if (materialASINCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialASINCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialASINCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialASINCharcValue);
                                        }
                                    }
                                    if (materialALLERGEN1CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialALLERGEN1CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialALLERGEN1CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialALLERGEN1CharcValue);
                                        }
                                    }
                                    if (materialALLERGEN2CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialALLERGEN2CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialALLERGEN2CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialALLERGEN2CharcValue);
                                        }
                                    }
                                    if (materialALLERGEN3CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialALLERGEN3CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialALLERGEN3CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialALLERGEN3CharcValue);
                                        }
                                    }
                                    if (materialALLERGEN4CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialALLERGEN4CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialALLERGEN4CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialALLERGEN4CharcValue);
                                        }
                                    }
                                    if (materialSCINAME1CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialSCINAME1CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialSCINAME1CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialSCINAME1CharcValue);
                                        }
                                    }
                                    if (materialSCINAME2CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialSCINAME2CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialSCINAME2CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialSCINAME2CharcValue);
                                        }
                                    }
                                    if (materialCustBrandCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCustBrandCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialCustBrandCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialCustBrandCharcValue);
                                        }
                                    }
                                    if (materialCustNameCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCustNameCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialCustNameCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialCustNameCharcValue);
                                        }
                                    }
                                    if (materialCustNumberCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCustNumberCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialCustNumberCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialCustNumberCharcValue);
                                        }
                                    }
                                    if (materialCustReqCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCustReqCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialCustReqCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialCustReqCharcValue);
                                        }
                                    }                                   
                                    if (materialDistByNameCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialDistByNameCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialDistByNameCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialDistByNameCharcValue);
                                        }
                                    }
                                    if (materialDistByAdd1CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialDistByAdd1CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialDistByAdd1CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialDistByAdd1CharcValue);
                                        }
                                    }
                                    if (materialDistByAdd2CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialDistByAdd2CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialDistByAdd2CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialDistByAdd2CharcValue);
                                        }
                                    }
                                    if (materialHandlingInst1CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialHandlingInst1CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialHandlingInst1CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialHandlingInst1CharcValue);
                                        }
                                    }                                   
                                    if (materialHandlingInst2CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialHandlingInst2CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialHandlingInst2CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialHandlingInst2CharcValue);
                                        }
                                    }                
                                    if (materialHandlingInst3CharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialHandlingInst3CharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialHandlingInst3CharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialHandlingInst3CharcValue);
                                        }
                                    }
        
                                    if (materialLabelFormCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialLabelFormCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialLabelFormCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialLabelFormCharcValue);
                                        }
                                    }
        
                                    if (materialLabelNameCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialLabelNameCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialLabelNameCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialLabelNameCharcValue);
                                        }
                                    }
        
                                    if (materialprodFormCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialprodFormCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialprodFormCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialprodFormCharcValue);
                                        }
                                    }
        
                                    if (materialCustomerPLUCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCustomerPLUCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialCustomerPLUCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialCustomerPLUCharcValue);
                                        }
                                    }
        
                                    if (materialCubeCharcInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == materialCubeCharcInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialCubeCharcValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialCubeCharcValue);
                                        }
                                    }
        
                                    if (itemIngredientsCharInternalId != "") {
                                        var materialAssignmentCharacteristicValues = assignmentCharacteristicValues.filter(function (value, index, arr) {
                                            return (value.charcInternalId == itemIngredientsCharInternalId);
                                        });
                                        if (materialAssignmentCharacteristicValues.length > 0) {
                                            materialItemIngredientsCharValue = materialAssignmentCharacteristicValues[0].charcValue;
                                            console.log(materialItemIngredientsCharValue);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        }
                    }  
                            that.onReprintpallet(aSelectedObject);               
        
            //     },function (oError, sHttpErrorMessage) {
            //         var err = oError || sHttpErrorMessage;
            //         console.log(err);
            //     }     
            // );  
        },
        
        getBestBeforeDate: function(shelfLifeTime)
        { 
            var timezoneId = this.getPodSelectionModel().getTimeZoneId();
            var currentClientDate = new Date();
        
            // Add shelfLife days to current date
            currentClientDate.setDate(currentClientDate.getDate() + shelfLifeTime);
        
            var dateTimeString = currentClientDate.toLocaleString("en-US", { timeZone: timezoneId });
        
            var d = dateTimeString.split(",")[0];
        
            var month = d.split("/")[0]; //d.getMonth()+1;
        
            if (month < 10)
                month = "0" + month;
        
            var date = d.split("/")[1]; //d.getDate();
            if (date < 10)
                date = "0" + date;
        
        
            var datetime = month + "/" + date + "/" +d.split("/")[2];
        
           // format MM/DD/YYYY 
            var bestBeforeDate = datetime;
            return bestBeforeDate;
        
        },
        
        getProductionDate: function()
        {
            var timezoneId = this.getPodSelectionModel().getTimeZoneId();
        
            var currentClientDate = new Date();
        
            var dateTimeString = currentClientDate.toLocaleString("en-US", { timeZone: timezoneId });
        
            var d = dateTimeString.split(",")[0];
        
            var month = d.split("/")[0]; //d.getMonth()+1;
        
            if (month < 10)
                month = "0" + month;
        
            var date = d.split("/")[1]; //d.getDate();
            if (date < 10)
                date = "0" + date;
        
        
            var datetime = month + "/" + date + "/" +d.split("/")[2];
        
           // format MM/DD/YYYY 
            var productionDate = datetime;
            return productionDate;
        
        },
        
        
        getPostedTime: function () {
            var timezoneId = this.getPodSelectionModel().getTimeZoneId();
        
            var dateTimeString = new Date().toLocaleString("en-US", { timeZone: timezoneId });
        
            var d = dateTimeString.split(",")[0];
        
            var month = d.split("/")[0]; //d.getMonth()+1;
        
            if (month < 10)
                month = "0" + month;
        
            var date = d.split("/")[1]; //d.getDate();
            if (date < 10)
                date = "0" + date;
        
        
            var datetime = d.split("/")[2] + "-" + month + "-" + date + "T00:00:00Z";
        
            var postedDate = datetime;
            return postedDate;
        },
        getGiGrTimestampFromOrder: function () {
            orderDetail = this.getShopOrderDetails(podModelData);
            let customValueArray = orderDetail.responseJSON.customValues;
            let giTimestamp = "", grTimestamp = "";
            for (var i = 0; i < customValueArray.length; i++) {
        
                if (customValueArray[i].attribute == "PACKOUT_GI_TIMESTAMP")
                    giTimestamp = customValueArray[i].value;
        
                if (customValueArray[i].attribute == "PACKOUT_LAST_BATCH_SYNC_TIMESTAMP")
                    grTimestamp = customValueArray[i].value;
        
            }
        
            var response = {
                "GI_TIMESTAMP": giTimestamp,
                "GR_TIMESTAMP": grTimestamp
            };
            return response;
        },
        
        isBatchSyncRequired: function (giGrTimestamp) {
            var isBatchSyncRequired = false;
            var giTimestamp = giGrTimestamp.GI_TIMESTAMP;
            var grTimestamp = giGrTimestamp.GR_TIMESTAMP;
            if (grTimestamp == "") {
                isBatchSyncRequired = true;
            }
            else
                if (giTimestamp != "" && grTimestamp != "") {
                    if (Number(giTimestamp) > Number(grTimestamp)) {
                        isBatchSyncRequired = true;
                    }
                }
            return isBatchSyncRequired;
        
        },
        
        
        getBatchCharacteristics: function (batchCharacteristicPayload) {
            let batchCharacteristics = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() +
                    "inventory/v1/batches?plant=" + batchCharacteristicPayload.plant +
                    "&batchNumber=" + batchCharacteristicPayload.batch +
                    "&material=" + batchCharacteristicPayload.material +
                    "&includeCharacteristics=true",
                async: false
            });
            return batchCharacteristics;
        },
        getBatchCharacteristicsForPrint: function(responseGetBatchCharacteristics) {
        
            var responseBatchCharacteristicsForPrint = {
                'COOL_PRODUCT_OF' :'',
                'COOL_PROCESSED_IN':'',
                'COOL_FORM':'',
                'HARVEST_METHOD':'',
                'HARVEST_AREA_FAO':'',
                'HARVEST_AREA_D_CRAB':'',
                'HARVEST_DATES_WILD':'',
                'HARVEST_DATES_FARM':'',
                'HARVEST_TIME_FARM':'',
                'CERT_ADDITIONAL':'',
                'CERTIFICATION_MSC':'',
                'CERTIFICATION_USDA':'',
                'CERTIFICATION_BAP':'',
                'CERTIFICATION_ISSCL':'',
                'CERTIFICATION_ASC':'',
                'VESSEL_NAME':'',
                'LANDING_YEAR':''
            };
            var getBatchContent = responseGetBatchCharacteristics.responseJSON.content[0].batchCharacteristics;
            if(getBatchContent){
            for(var i=0;i<getBatchContent.length;i++)
            {
                if(getBatchContent[i].batchCharcValues.length > 0)
                {
                var batchCharcValues = getBatchContent[i].batchCharcValues;
                var charValuesLength = batchCharcValues.length;
                
                    switch (getBatchContent[i].charcName) {
                    case 'COOL_PRODUCT_OF':
                        responseBatchCharacteristicsForPrint.COOL_PRODUCT_OF = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
        
                    case 'COOL_PROCESSED_IN':
                        responseBatchCharacteristicsForPrint.COOL_PROCESSED_IN = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'COOL_FORM':
                        responseBatchCharacteristicsForPrint.COOL_FORM = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'HARVEST_METHOD':
                        responseBatchCharacteristicsForPrint.HARVEST_METHOD = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'HARVEST_AREA_FAO':
                        responseBatchCharacteristicsForPrint.HARVEST_AREA_FAO = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'HARVEST_AREA_D_CRAB':
                        responseBatchCharacteristicsForPrint.HARVEST_AREA_D_CRAB = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'HARVEST_DATES_WILD':
                        responseBatchCharacteristicsForPrint.HARVEST_DATES_WILD = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'HARVEST_DATES_FARM':
                        responseBatchCharacteristicsForPrint.HARVEST_DATES_FARM = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'HARVEST_TIME_FARM':
                        responseBatchCharacteristicsForPrint.HARVEST_TIME_FARM = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'CERT_ADDITIONAL':
                        responseBatchCharacteristicsForPrint.CERT_ADDITIONAL = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'CERTIFICATION_MSC':
                        responseBatchCharacteristicsForPrint.CERTIFICATION_MSC = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'CERTIFICATION_USDA':
                        responseBatchCharacteristicsForPrint.CERTIFICATION_USDA = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'CERTIFICATION_BAP':
                        responseBatchCharacteristicsForPrint.CERTIFICATION_BAP = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'CERTIFICATION_ISSCL':
                        responseBatchCharacteristicsForPrint.CERTIFICATION_ISSCL = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'CERTIFICATION_ASC':
                        responseBatchCharacteristicsForPrint.CERTIFICATION_ASC = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'VESSEL_NAME':
                        responseBatchCharacteristicsForPrint.VESSEL_NAME = batchCharcValues.map(function(val) {
                            return val.charcValue;
                        }).join(',');
                        break;
                    case 'LANDING_YEAR':
                        responseBatchCharacteristicsForPrint.LANDING_YEAR = batchCharcValues.map(function(val) {
                        return val.charcValue;
                        }).join(',');
                        break;
                    default:
                        // code
                    }
                }
                
            }
        
            return responseBatchCharacteristicsForPrint;
        }
        },
        
        getMaterialDetails: function (materialPayload) {
            let materialDetails = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/material/v1/materials?plant=" + materialPayload.plant + "&material=" + materialPayload.component + "&version=" + materialPayload.materialVersion,
                async: false
            });
            return materialDetails;
        },
        
        getBOMDetails: function (bomPayload) {
            var bomType;
            if (bomPayload.bomType == "USERBOM") { bomType = "MASTER" }
            else if (bomPayload.bomType == "SHOPORDERBOM") { bomType = "SHOP_ORDER" }
        
            let bomDetails = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/bom/v1/boms?plant=" + bomPayload.plant + "&bom=" + bomPayload.bom + "&type=" + bomType,
                async: false
            });
            return bomDetails;
        },
        
        generatePayloadByPodModel: function () {
            let material = "", materialVersion = "";
            let selectedSFC = "", sfcQuantity = 0;
            let selectedOrder = "", isInventoryManaged = "";
            let operation = "", operationVersion = "", stepId = "";
            let workCenter = "", selectedPhaseWorkCenter = "", timeZoneId = "";
            let podSelectionModel = this.getPodSelectionModel();
            let podType = podSelectionModel.podType;
            let plant = this.getPodController().getUserPlant();
        
            if (podSelectionModel.getSelection() != undefined) {
                selectedSFC = podSelectionModel.getSelection().input;
                sfcQuantity = podSelectionModel.getSelection().sfcData.quantity;
                material = podSelectionModel.getSelection().sfcData.material;
                materialVersion = podSelectionModel.getSelection().sfcData.materialVersion;
                selectedOrder = podSelectionModel.getSelection().shopOrder.shopOrder;
            }
            if (podSelectionModel.selectedPhaseWorkCenter != undefined) {
                selectedPhaseWorkCenter = podSelectionModel.selectedPhaseWorkCenter;
        
            }
            if (podSelectionModel.workCenter != undefined) {
                workCenter = podSelectionModel.workCenter;
            }
            if (podSelectionModel != undefined) {
                timeZoneId = podSelectionModel.timeZoneId;
                isInventoryManaged = podSelectionModel.isInventoryManaged;
            }
        
            if (podType == "OPERATION" || podType == "ORDER") {
                operation = podSelectionModel.operations[0].operation;
                operationVersion = podSelectionModel.operations[0].operationVersion;
                stepId = podSelectionModel.operations[0].stepId;
            }
            var payload =
            {
                'plant': plant,
                'order': selectedOrder,
                'material': material,
                'materialVersion': materialVersion,
                'workCenter': selectedPhaseWorkCenter,
                'resource': selectedPhaseWorkCenter,
                'operation': operation,
                'operationVersion': operationVersion,
                'stepId': stepId,
                'assemblyOperation': "",
                'assemblyStepId': "",
                'podType': podType,
                'sfc': selectedSFC,
                'sfcQuantity': sfcQuantity,
                'isInventoryManaged': isInventoryManaged,
                'timeZoneId': timeZoneId
            };
            return payload;
        },
        getShopOrderDetails: function (podModelData) {
        
            if (podModelData.order != "") {
                let orderDetail = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/order/v1/orders?plant=" + podModelData.plant + "&order=" + podModelData.order,
                    async: false
                });
                return orderDetail;
            }
            else
                return "ERROR";
        },
        getResource: function (resourceId) {
        
            let response = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() +
                    "/resource/v1/resources?plant=" + podModelData.plant +
                    "&resource=" + resourceId,
                async: false
            });
            return response;
        },
        
        getWorkcenter: function (wcId) {
        
            let response = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() +
                    "/workcenter/v2/workcenters?plant=" + podModelData.plant +
                    "&workCenter=" + wcId,
                async: false
            });
            return response;
        },
        
        getResourceType: function (resourceType) {
        
            let response = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() +
                    "/resourcetype/v1/resourcetypes?plant=" + podModelData.plant +
                    "&resourceType=" + resourceType,
                async: false
            });
            return response;
        },
        
               
        setMaterialCustomDataForPrint: function(){
        
            var materialCustomValues = materialDetails.responseJSON[0].customValues;
            materialCustomDataForPrint.MAT_DESC = materialDetails.responseJSON[0].description;
            for(var i = 0; i<materialCustomValues.length ; i++)
            {
                switch (materialCustomValues[i].attribute) {
                    case MAT_CUSTOM_BRAND_NAME:
                        materialCustomDataForPrint.BRAND_NAME = materialCustomValues[i].value;
                        break;
                    case MAT_CUSTOM_CUSTOMER_UPC:
                        materialCustomDataForPrint.CUSTOMER_UPC = materialCustomValues[i].value;
                        break;
                    case MAT_CUSTOM_GTIN:
                        materialCustomDataForPrint.GTIN = materialCustomValues[i].value;
                        break;
                    case MAT_CUSTOM_PRODUCT_SIZE:
                        materialCustomDataForPrint.PRODUCT_SIZE = materialCustomValues[i].value;
                        break;
                }
            }
          
        },
        
        setWCCustomDataForPrint: function(){
            var wcCustomValues = responseGetWorkcenter.responseJSON[0].customValues;
            for(var i = 0; i<wcCustomValues.length ; i++)
            {
                switch (wcCustomValues[i].attribute) {
                    case WC_CUSTOM_CERTIFICATION_ISSCL:
                        wcCustomDataForPrint.CERTIFICATION_ISSCL = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_CERTIFICATION_USDA:
                        wcCustomDataForPrint.CERTIFICATION_USDA = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_FACILITY_ADDRESS:
                        wcCustomDataForPrint.FACILITY_ADDRESS = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_FEI:
                        wcCustomDataForPrint.FEI = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_PLANT_USDC:
                        wcCustomDataForPrint.PLANT_USDC = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_BRC:
                        wcCustomDataForPrint.BRC = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_PLANT_CODE:
                        wcCustomDataForPrint.PLANT_CODE = wcCustomValues[i].value;
                        break;
                    case WC_CUSTOM_SHELFISH_SHIPPER_CERT:
                        wcCustomDataForPrint.SHELFISH_SHIPPER_CERT = wcCustomValues[i].value;
                        break;               
                }
            }
        },
        
        setOrderCustomDataForPrint: function(){
            var orderCustomValues = orderDetail.responseJSON.customValues;
            for(var i = 0; i<orderCustomValues.length ; i++)
            {
                switch (orderCustomValues[i].attribute) {
                    case ORDER_CUSTOM_CUSTOMER_PO_NUMBER:
                        orderCustomDataForPrint.CUSTOMER_PO_NUMBER = orderCustomValues[i].value;
                        break;
                   
                }
            }
        },
         
        preloadData: function () {
        
            podModelData = this.generatePayloadByPodModel();
            orderDetail = this.getShopOrderDetails(podModelData);
            sfcDetail = this.getSFCdetails(podModelData);
            if (orderDetail.status == 200) {
                var materialPayload = { "plant": podModelData.plant, "component": podModelData.material, "materialVersion": podModelData.materialVersion };
                materialDetails = this.getMaterialDetails(materialPayload)
                var alternateUOMList = materialDetails.responseJSON[0].alternateUnitsOfMeasure;
                podModelData.alternateUOMList = alternateUOMList;
                podModelData.materialBaseUOM = materialDetails.responseJSON[0].unitOfMeasure;
                this.setMaterialCustomDataForPrint();
                responseGetWorkcenter = this.getWorkcenter(podModelData.workCenter);
                this.setWCCustomDataForPrint();
                this.setOrderCustomDataForPrint();
                podModelData.orderBatch = orderDetail.responseJSON.batchNumber;
                this.setOrderUOMListModel();
                var orderSfcs = orderDetail.responseJSON.sfcs;
        
                for (var i = 0; i < orderSfcs.length; i++) {
                    if (orderSfcs[i].indexOf("_IS") == -1 && orderSfcs[i].indexOf("_C") == -1) {
                        rootSFC = orderSfcs[i];
                    }
                }
                var orderUOM = this.getView().getModel("ORDERUOMLIST").getProperty("/orderUOMList/0/uom");
               // this.getView().byId("idCaseUOM").setValue(orderUOM);
        
             
            }
            else
            {
                MessageBox.error("Get Shop Order Error.", {
                    title: "Packout Inital Load Error",
                    actions: MessageBox.Action.OK,
                    emphasizedAction: MessageBox.Action.OK
                });
            }          
        },
        
        setOrderUOMListModel: function () {
            var orderUOM = "";
            var orderInternalUOM = "";
            if (orderDetail.responseJSON.productionUnitOfMeasureObject != undefined) {
                orderUOM = orderDetail.responseJSON.productionUnitOfMeasureObject.uom;
                orderInternalUOM = orderDetail.responseJSON.productionUnitOfMeasureObject.internalUom;
            }
            else {
                orderUOM = orderDetail.responseJSON.baseUnitOfMeasureObject.uom;
                orderInternalUOM = orderDetail.responseJSON.baseUnitOfMeasureObject.internalUom;
            }
            var orderUOMList = { "orderUOMList": [{ "uom": orderUOM , "internalUom": orderInternalUOM }] };
        
            var orderUOMListModel = new JSONModel(orderUOMList);
            this.getView().setModel(orderUOMListModel, "ORDERUOMLIST");
        
        },
        setParallelUOMListModel: function (parallelUOM) {
            var parallelUOMArray = [];
            if (parallelUOM != "") {
                parallelUOMArray = [{ "uom": parallelUOM }];
            }
            var parallelUOMList = { "parallelUOMList": parallelUOMArray };
        
            var parallelUOMListModel = new JSONModel(parallelUOMList);
            this.getView().setModel(parallelUOMListModel, "PARALLELUOMLIST");
        
        },
        
        getOperationMaster: function (oEvent) {
            let operationRef = this.getPodSelectionModel().operations[0];
            let stepId = operationRef.recipeArray[0].stepId;
            let routing = operationRef.recipeArray[0].routing.routing;
            let routeVersion = operationRef.recipeArray[0].routing.version;
            let routeType = operationRef.recipeArray[0].routing.routingType;
            let order = podModelData.order;
            let sfc = podModelData.sfc;
            let operationDetail = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getPodController()._oPodController.getPublicApiRestDataSourceUri() + "/masterOperation/v1/masterOperation?plant="
                    + podModelData.plant + "&activityId=" + stepId + "&routing=" + routing +
                    "&routingType=" + routeType + "&routingVersion=" + routeVersion +
                    "&order=" + order + "&sfc=" + sfc,
                async: false
            });
            return operationDetail;
        },
        
          setPrinterListModel: function () {
                    const PRINTER_RESOURCE_TYPE = "PRINTER";
                    let responsePrinterResourceType = this.getResourceType(PRINTER_RESOURCE_TYPE);
                   
                    let wcCustomValues = responseGetWorkcenter.responseJSON[0].customValues;
                    var defPrinterResource = "";
                    var folderPath = "",webServer="";
        
                    var printerResources = [];
                    if (responsePrinterResourceType.responseJSON.length > 0) {
                        printerResources = responsePrinterResourceType.responseJSON[0].resources
        
        
                        if (wcCustomValues.length > 0) {
                            var filteredCustomValues = wcCustomValues.filter(function (value, index, arr) {
                                return value.attribute == "PRINTER";
                            });
                            if (filteredCustomValues.length > 0) {
                                defPrinterResource = filteredCustomValues[0].value;
                                if (defPrinterResource != "") {
                                    var responseResourceCustomFields = this.getFolderPathByResourcePrinter(defPrinterResource);
                                    folderPath = responseResourceCustomFields.folderPath;
                                    webServer = responseResourceCustomFields.webServer;
                                   
                                }
                                else {
                                    MessageToast.show("Default Printer is not assigned to workcenter: " + podModelData.workCenter + ".\nPlease assign default printer resource in Manage Workcenter application under custom data field PRINTER.");
                                }
                            }
                            else {
                                MessageBox.alert("Workcenter: " + podModelData.workCenter + " do not have custom data field configured in DMC.\nPlease configure the custom data PRINTER in Manage Custom Data application.", {
                                    title: "Validation Alert",
                                    actions: MessageBox.Action.OK,
                                    emphasizedAction: MessageBox.Action.OK
                                });
                            }
                        }
                        else {
                            MessageBox.alert("Workcenter: " + podModelData.workCenter + " do not have custom data field configured in DMC.\nPlease configure the custom data PRINTER in Manage Custom Data application.", {
                                title: "Validation Alert",
                                actions: MessageBox.Action.OK,
                                emphasizedAction: MessageBox.Action.OK
                            });
        
                        }
                    }
                    else {
                        MessageBox.alert("No Printer resource configured in DMC for resource type PRINTER", {
                            title: "Validation Alert",
                            actions: MessageBox.Action.OK,
                            emphasizedAction: MessageBox.Action.OK
                        });
                    }
        
        
                    let printerListJson = {
                        "printers": printerResources,
                        "selectedKey": defPrinterResource,
                        "selectedFolderPath" : folderPath,
                        'selectedWebServer': webServer
                    };
                    var oModel = new JSONModel(printerListJson);
                    this.getView().setModel(oModel, "PRINTERLISTMODEL");
                    if(defPrinterResource=="" || folderPath =="" || webServer=="" )
                    {    
                        this.onPrinterClear();
                    }
                },
        
                getFolderPathByResourcePrinter(resourcePrinter) {
                    var resourceDetail = this.getResource(resourcePrinter);
                    var folderPath = "";
                    var webServer = "";
                    var customValues = resourceDetail.responseJSON[0].customValues;
                    if (customValues.length > 0) {
                        var filteredCustomValues = customValues.filter(function (value, index, arr) {
                            return value.attribute == "FOLDER";
                        });
                        var filteredWebServerCustomValue = customValues.filter(function (value, index, arr) {
                            return value.attribute == "DMC_WEB_SERVER_NAME";
                        });
                        if (filteredCustomValues.length > 0) {
                            folderPath = filteredCustomValues[0].value;
                        }
                        else {
                            MessageBox.alert("Printer resource: " + printer + " do not have custom data field configured in DMC.\nPlease configure the custom data FOLDER in Manage Custom Data application.", {
                                title: "Validation Alert",
                                actions: MessageBox.Action.OK,
                                emphasizedAction: MessageBox.Action.OK
                            });
        
                        }
                        if(filteredWebServerCustomValue.length>0)
                        {
                            webServer = filteredWebServerCustomValue[0].value;
                        }
                    }
                    else {
                        MessageBox.alert("Printer resource: " + printer + " do not have custom data field configured in DMC.\nPlease configure the custom data FOLDER in Manage Custom Data application.", {
                            title: "Validation Alert",
                            actions: MessageBox.Action.OK,
                            emphasizedAction: MessageBox.Action.OK
                        });
        
                    }
                    return {"folderPath": folderPath, "webServer":webServer};
                },
        
        
                onPrinterClear: function () {
        
                    this.getView().getModel("PRINTERLISTMODEL").setProperty("/selectedKey", "");
                    this.getView().getModel("PRINTERLISTMODEL").setProperty("/selectedFolderPath", "");
                    this.getView().getModel("PRINTERLISTMODEL").setProperty("/selectedWebServer","" );
                  //  this.getView().byId("idComboBoxPrinter").setValue("");
        
                },
        
        
        onReprintpallet: function(aSelectedObject)
        {   var that = this;
            var PLANT = PlantSettings.getCurrentPlant(); 
            var podModelData;
            podModelData = this.generatePayloadByPodModel();
            // orderDetail = this.getShopOrderDetails(podModelData);
            ORDERDetail = that.getOrderdetails();
            var material = ORDERDetail.material.material
            var order = ORDERDetail.order
            var workCenter = podModelData.workCenter
            var orderBatch = ORDERDetail.batchNumber
            var orderUOM = ORDERDetail.erpUnitOfMeasure;
            var orderInternalUOM = ORDERDetail.baseUnitOfMeasureObject.internalUom;
            var shelLife = materialDetails.responseJSON[0].maxShelfLife;
            var requestGetBatchChar = { 
                                        'plant': PLANT,
                                        'batch': orderBatch,
                                        'material': material
                                    };
            var responseBatchCharacteristics = this.getBatchCharacteristics(requestGetBatchChar);
            var responseBatchCharacteristicsForPrint = this.getBatchCharacteristicsForPrint(responseBatchCharacteristics);
            var PackingPrint = "REG_d2f9c82e-86cc-4764-be9d-1494e36db39b"
            var url = this.getPodController()._oPodController.getPublicApiRestDataSourceUri()
                + "/pe/api/v1/process/processDefinitions/start?key=" + PackingPrint + "&async=false&logLevel=Debug"; 
           var catchWeightQtyWithUOM="";
           var Printer = "CLKSUN BARCODE LAB 01"
            var printerdetails = that.setPrinterListModel(); 
            var PalletID = aSelectedObject.number;
           var folderPath = this.getView().getModel("PRINTERLISTMODEL").getProperty("/selectedFolderPath");
           var webServer = this.getView().getModel("PRINTERLISTMODEL").getProperty("/selectedWebServer");
           var bestBeforeDate = this.getBestBeforeDate(shelLife);
           var giGrTimestamp = this.getGiGrTimestampFromOrder();
           var isBatchSyncRequired = this.isBatchSyncRequired(giGrTimestamp);
           var trimmedMaterial = material;
        
           if(isNaN(parseInt(material) ) )
           {
                trimmedMaterial = material;
           }
           else
           {
                trimmedMaterial =parseInt(material).toString() ;
           }
            var requestJSON = {
             //   'sfc': Packsfc,
                'isBatchSyncRequired': isBatchSyncRequired,
                //'quantity': Packquantity,
                'quantityUOM': orderInternalUOM,
                'plant': PLANT,
                'batch': orderBatch,
                'material': material,
                'trimmedMaterial' : trimmedMaterial,
                'order': order,
                'bestBefore' : bestBeforeDate,
                'productionDate' :this.getProductionDate(),
                'catchWeightQtyWithUOM' : catchWeightQtyWithUOM,
            //    'productionCount': materialCharacteristics.materialPCountCharcValue,
                'folderPath' : folderPath,
                'webServer' : webServer,
                'printer': Printer,
             //   'packSizeWeight' : packSizeWeight,
                'packSizeWeightUOM' : orderUOM, 
                'workcenter': workCenter,
                'PalletID': PalletID,
                'batchCharacteristics' : responseBatchCharacteristicsForPrint,
        
                'materialCharacteristics': 
                                        {
                                           
                                            'ASIN': materialASINCharcValue,
                                            'ALLERGEN1':materialALLERGEN1CharcValue,
                                            'ALLERGEN2':materialALLERGEN2CharcValue,
                                            'ALLERGEN3':materialALLERGEN3CharcValue , 
                                            'ALLERGEN4' :materialALLERGEN4CharcValue,  
                                            'SCIENTIFIC_NAME1' : materialSCINAME1CharcValue, 
                                            'SCIENTIFIC_NAME2':materialSCINAME2CharcValue ,
                                            'CUSTOMER_BRAND':materialCustBrandCharcValue,
                                            'CUSTOMER_NAME':materialCustNameCharcValue,
                                            'CUSTOMER_NUMBER':materialCustNumberCharcValue,
                                            'CUSTOMER_REQUIRED':materialCustReqCharcValue , 
                                            'DISTRIBUTED_BY_NAME' :materialDistByNameCharcValue,  
                                            'DISTRIBUTED_BY_ADD1' : materialDistByAdd1CharcValue, 
                                            'DISTRIBUTED_BY_ADD2':materialDistByAdd2CharcValue ,
                                           
                                            'HANDLING_INSTRUCTIONS_1':materialHandlingInst1CharcValue,
                                            'HANDLING_INSTRUCTIONS_2':materialHandlingInst2CharcValue,
                                            'HANDLING_INSTRUCTIONS_3':materialHandlingInst3CharcValue,
                                            'LABEL_FORM':materialLabelFormCharcValue,
                                            'LABEL_NAME':materialLabelNameCharcValue,
                                            'PRODUCT_FORM':materialprodFormCharcValue , 
                                            'CUSTOMER_PLU' :materialCustomerPLUCharcValue,  
                                            'CUBE' : materialCubeCharcValue,
                                            'ITEM_INGREDIENTS':materialItemIngredientsCharValue,
                                            'PRODUCT_COUNT_FLAG': materialPCountCharcValue
                                        },
                'customDataForPrint': {
                                    BRAND_NAME: materialCustomDataForPrint.BRAND_NAME,
                                    CUSTOMER_UPC: materialCustomDataForPrint.CUSTOMER_UPC,
                                    GTIN: materialCustomDataForPrint.GTIN,
                                    PRODUCT_SIZE: materialCustomDataForPrint.PRODUCT_SIZE,
                                    CERTIFICATION_ISSCL: wcCustomDataForPrint.CERTIFICATION_ISSCL,
                                    CERTIFICATION_USDA: wcCustomDataForPrint.CERTIFICATION_USDA,
                                    FACILITY_ADDRESS: wcCustomDataForPrint.FACILITY_ADDRESS,
                                    FEI: wcCustomDataForPrint.FEI,
                                    CUSTOMER_PO_NUMBER: orderCustomDataForPrint.CUSTOMER_PO_NUMBER,
                                    'MAT_DESC': materialCustomDataForPrint.MAT_DESC,
                                    PLANT_USDC : wcCustomDataForPrint.PLANT_USDC,
                                    BRC: wcCustomDataForPrint.BRC,
                                    PLANT_CODE: wcCustomDataForPrint.PLANT_CODE,
                                    SHELFISH_SHIPPER_CERT: wcCustomDataForPrint.SHELFISH_SHIPPER_CERT
                                },
             
            }; 
            var that = this;
             this.getPodController()._oPodController.ajaxPostRequest(url, requestJSON,
                 function (oResponseData) {
                    
                     if(oResponseData.STATUS == "SUCCESS")
                     {
                        
                            MessageToast.show("Print Successful.");
                            //that.updateOrderGRTimestampCustomData();
                        
                     }
                     else
                     if(oResponseData.STATUS == "FAILED")
                     {
                        MessageToast.show(oResponseData.MESSAGE);
                     }
                 },
                 function (oError, sHttpErrorMessage) {
                     var err = oError || sHttpErrorMessage;
                     console.log(err);
                     var message = err.errorMessageKey
                     MessageToast.show(message);
        
        
                 }
             );
        },
        
            _handleValueHelpConfirm: function(evt){
        
                var aSelectedItems = evt.getParameter("selectedItems");
                var aselectedPath=aSelectedItems[0].getBindingContext("HUFragModel").getPath();
                var aSelectedObject=aSelectedItems[0].getBindingContext("HUFragModel").getObject(aselectedPath);
                var that = this;
                //REG_f3b26ded-4468-4f77-a00c-f74e8d2be1e9
                //REG_f3b26ded-4468-4f77-a00c-f74e8d2be1e9
                if (aSelectedObject) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to re-print the Pallet ID "+aSelectedObject.number+" ?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                MessageToast.show("Reprint Initiated!");
                             that.getClassification(aSelectedObject);                      
                                this.oApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "No",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }
        
                this.oApproveDialog.open();
        
            },
        
        
            onLastReprint: function(evt){
                var that = this,output;  
                var ORDER = this.getView().byId("id_Order");
                var order = ORDER.getValue();
                var PLANT = PlantSettings.getCurrentPlant();
        
                let HUList = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    headers: { 'X-Dme-Plant': PLANT },
                    url:"/sapdmdmepod/dme/packing.svc/GetPackingsList(resource='',number='',order='"+order+"',material='')?$filter=status eq 'CLOSED'&$orderby=modifiedDateTime desc&$skip=0&$top=10000",
                    async: false
                    
                });
                var oData=HUList.responseJSON.value,vData=[];
                
                if(oData){
                    for(var i=0;i<oData.length;i++)
                    {
                        if(oData[i].status!="OPEN"){
                        var aSelectedObject = oData[i];                
                        var PalletID = aSelectedObject.number;                
                        vData.push(oData[i]);
                        break;
                        }
                    }
                var sData = {
                    items: []
                }
                sData.items=vData;
            }        if(vData.length!=0){
                // that.HUListPopup();
        
                if (!this.olApproveDialog) {
                    this.olApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to re-print the Pallet ID "+PalletID+" ?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                MessageToast.show("Reprint Initiated!");
                             that.getClassification(aSelectedObject);                      
                                this.olApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "No",
                            press: function () {
                                this.olApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }
        
                this.olApproveDialog.open();
        
                }else{
                    that.showErrorMessage("No Pallet ID's are in Closed Status", false, true, MessageType.Error);
                }
        
                    },
        
                onExit: function () {
                    PluginViewController.prototype.onExit.apply(this, arguments);
        
        
                }
            });
        });