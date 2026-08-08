Advaya.register("Advaya.Gms.Fees");

(function( ) {

    Advaya.Gms.Fees = function() {
        this.init( );
    };

    Fees = Advaya.Gms.Fees;
    Fees.instance = null;

    Advaya.Gms.Fees.handler = {
        
        checkAll : function(field) {
            var id = field.className;
            var items = Ext.getCmp(id).items.items;
            if(field.checked) {
                for(var i = 0 ; i < items.length ; i++) {
                    items[i].setValue(true);
                }
            }else{
                for(var i = 0 ; i < items.length ; i++) {
                    items[i].setValue(false);
                }
            }
        },
        check : function(field) {
            firstClick = false;
            var id = field.className;
            var feeField = Ext.getCmp("amoutTOtal");
            var items = Ext.getCmp(id).items.items;
            var total=0;
            if(field.checked) {
                for(var i = 0 ; i < items.length ; i++) {
                    items[i].setValue(true);
                    var value1 = items[i].boxLabel.split('-')[1];
                    total=total+parseInt(value1.trim(1,2), 10);
                }
                feeField.setValue(total);
            }else{
                for(var i = 0 ; i < items.length ; i++) {
                    items[i].setValue(false);
                }
                feeField.setValue(0);
            }
            firstClick = true;
        },
        hasDiscount: function( data, newValue, oldValue, eOpts ){
            var  inst = Advaya.Gms.Fees.instance;
            var maxDiscountInPct = Ext.getCmp('maxDiscountInPct');
            var hasDiscount = Ext.getCmp('hasDiscount').value;
            if(hasDiscount == 'true'){
                maxDiscountInPct.show();
            }else{
                maxDiscountInPct.hide();
                maxDiscountInPct.setValue(0);
            }
        },  
        getTotalApplicableFee:function(obj,newValue,oldValue,eOpts){
            var obj1 = obj;
            var items = obj1.items.items;
            var feeField = Ext.getCmp("amoutTOtal");
            var total=0;
            for(var i=0;i<=items.length;i++){
                if(obj.items.items[i] != undefined){
                    if(obj.items.items[i].checked){
                        var value1 = obj.items.items[i].boxLabel.split('-')[1];
                        total=total+parseInt(value1.trim(1,2), 10);
                    }
                    feeField.setValue(total);
                }
            }
        },
        
        getTotalAmount:function(dthis, record, item, index, e, eOpts){
            var totalAmountFld = Ext.getCmp("totalAmountId");
            var items = record.store.data.items;
            var total=0;
            for(var i=0; i<items.length ; i++){
                if(items[i].data.checked != null && items[i].data.checked){
                    var textValue = items[i].data.text.substr(-22);
                    var value = textValue.split('(')[1];
                    var value1 =value.substring(2,  value.indexOf(')'));
                    var value2 = value1.replace(',','');
                    total=total+parseInt(value2.trim(1,2), 10);
                }
                totalAmountFld.setValue(total);
            }
        },
        
        getTotalAmountOnRender:function(dthis, eOpts){
            var totalAmountFld = Ext.getCmp("totalAmountId");
            var items = dthis.items.items[0].store.data.items;
            var total=0;
            for(var i=0; i<items.length ; i++){
                if(items[i].data.checked != null && items[i].data.checked){
                    var textValue = items[i].data.text.substr(-22);
                    var value = textValue.split('(')[1];
                    var value1 =value.substring(2,  value.indexOf(')'));
                    var value2 = value1.replace(',','');
                    total=total+parseInt(value2.trim(1,2), 10);
                }
                totalAmountFld.setValue(total);
            }
        },
        
        disableAll: function(field, newValue,oldValue,obj){
            var branch = Ext.getCmp("rule-branch");
            var apply = Ext.getCmp("Apply-All");
                var quota = Ext.getCmp("rule-quota");
                var category = Ext.getCmp("rule-category");
                var stateQuota = Ext.getCmp("rule-stateQuota");
                var residentialStatus = Ext.getCmp("rule-residentialStatus");
                var course = Ext.getCmp("course");
            if(newValue["feeRule.applicability"]=="1"){
                category.hide();
                quota.hide();
                branch.hide();
                stateQuota.hide();
                residentialStatus.hide();
                course.hide(); 
                category.allowBlank=true;
                quota.allowBlank=true;
                branch.allowBlank=true;
                stateQuota.allowBlank=true;
//                residentialStatus.allowBlank=true;
                course.allowBlank=true;
                apply.allowBlank=false;
            }else{
                category.show();
                quota.show();
                branch.show();
                stateQuota.show();
                residentialStatus.show();
                course.show();
                category.allowBlank=false;
                quota.allowBlank=false;
                branch.allowBlank=false;
                stateQuota.allowBlank=false;
//                residentialStatus.allowBlank=false;
                course.allowBlank=false;
                apply.allowBlank=true;
            }
        },
        
        onCourse : function(field, newValue,oldValue,obj) {
            var branch = Ext.getCmp("rule-branch");
            var quota = Ext.getCmp("rule-quota");
            var category = Ext.getCmp("rule-category");
            var stateQuota = Ext.getCmp("rule-stateQuota");
            var residentialStatus = Ext.getCmp("rule-residentialStatus");
            branch.removeAll();
            quota.removeAll();
            category.removeAll();
            if (stateQuota != undefined) {
                stateQuota.removeAll();
                Ext.apply(stateQuota, {
                    allowBlank: true
                });
            }
            if (residentialStatus != undefined) {
                residentialStatus.removeAll();
            }
            Ext.apply(branch,{
                allowBlank : true
            });
            Ext.apply(quota,{
                allowBlank : true
            });
            Ext.apply(category,{
                allowBlank : true
            });
            
//            Ext.apply(residentialStatus,{
//                allowBlank : true
//            });
            
            if(newValue.length == 1 ) {
                var course = obj.params[newValue[0]];
                branch.add(course.branch);
                quota.add(course.quota);
                category.add(course.category);
                stateQuota.add(course.stateQuota);
                residentialStatus.add(course.residentialStatus);
                Ext.apply(branch,{
                    allowBlank : false
                });
                Ext.apply(quota,{
                    allowBlank : false
                });
                Ext.apply(category,{
                    allowBlank : false
                });
                Ext.apply(stateQuota,{
                    allowBlank : false
                });
//                Ext.apply(residentialStatus,{
//                    allowBlank : false
//                });
            }
        },
        
        onFilterChange : function(field,value) {
            if(value) {
                var inst = Advaya.Gms.Fees.instance;
                inst.feesGrid.grid.getStore().clearFilter();
                var groups = inst.feesFilter.query("radiogroup");
                for(var i = 0 ; i < groups.length ; i++) {
                    var check = Ext.getCmp(groups[i].getValue()["fltr."+groups[i].fieldLabel]);
                    if(check) {
                        inst.feesGrid.grid.getStore().filter([{
                            property:Ext.util.Format.lowercase(groups[i].fieldLabel),
                            value:check.inputValue,
                            caseSensitive:false
                        }]);
                    }
                }
                
                var key = field.up("radiogroup").fieldLabel;
                inst.feesGrid.grid.getStore().filter([{
                    property:Ext.util.Format.lowercase(key),
                    value:field.inputValue,
                    anyMatch:false,
                    caseSensitive:false
                }]);
                var totalStudents = inst.feesGrid.grid.getStore().getRange().length;
                Ext.getCmp("totalStudent").setValue(totalStudents);

//                Ext.getCmp("totalStudentss").setText("Total Students"+totalStudents);
            }
        },
        
        onWindowFilterChange : function(field,value) {
            if(value) {
                var key = field.up("radiogroup").fieldLabel;
                var inst = Advaya.Gms.Fees.instance;
                inst.winGrid.grid.getStore().clearFilter();
                var groups = inst.winForm.query("radiogroup");
                for(var i = 0 ; i < groups.length ; i++) {
                    var check = Ext.getCmp(groups[i].getValue()["fltr."+groups[i].fieldLabel]+"_"+groups[i].fieldLabel);
                    if(check) {
                        if(check.inputValue != "All"){
                            inst.winGrid.grid.getStore().filter([{
                                property:Ext.util.Format.lowercase(groups[i].fieldLabel),
                                value:check.inputValue,
                                caseSensitive:false,
                                anyMatch:false
                            }]);
                        }
                    }
                }
                
                
                if (field.inputValue != "All") {
                    inst.winGrid.grid.getStore().filter([{
                        property:Ext.util.Format.lowercase(key),
                        value:field.inputValue,
                        anyMatch:false,
                        caseSensitive:false
                    }]);
                }
                var totalStudents = inst.winGrid.grid.getStore().getRange().length;
                Ext.getCmp("totalStudent").setValue(totalStudents);
            }
        },
            
        onRowClick: function(rec, a, b, c) {
            var inst = Advaya.Gms.Fees.instance;
            var id = Ext.getCmp("studentFeeDetailId").getValue();
            var oldRec = inst.feesGrid.grid.store.findRecord("id", id);
            var selectedRec = rec.lastSelected;
            Ext.getCmp("studentPaymentDetailId").setValue(selectedRec.data.id);
            if(Ext.getCmp("totalDue").getValue() === "\u20b9 0"){
                Ext.getCmp("totalPayment").maxValue = selectedRec.data.paymentAmount;
            }
            Ext.getCmp("totalPayment").setValue(selectedRec.data.paymentAmount);
            Ext.getCmp("paymentMode").setValue(selectedRec.data.paymentMode);
            Ext.getCmp("paymentDate").setValue(selectedRec.data.paymentDate);
            Ext.getCmp("remarks").setValue(selectedRec.data.remarks);
            Ext.getCmp("bank").setValue(selectedRec.data.bank);
            Ext.getCmp("transactionNumber").setValue(selectedRec.data.transactionNumber);
        },
        onRowCLickStudentReq: function(rec, a, b, c){
            var selectedRec = rec.lastSelected;
            if(selectedRec.data.reportStatus == "Submitted" || selectedRec.data.reportStatus == "Approved")
            {
                Ext.MessageBox.show({
                    title: "Alert",
                    msg: "Submited/Approved Request can't be edited",
                    buttons: Ext.MessageBox.OK, 
                    fn: function(buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
                return;
            }else{
                Ext.getCmp("requestFor").setValue(selectedRec.data.request);
                Ext.getCmp("sr").setValue(selectedRec.data.id);
                Ext.getCmp("description").setValue(selectedRec.data.description);
                Ext.getCmp("amount").setValue(selectedRec.data.amount);
                Advaya.Gms.Fees.handler.studentfeeDetails();
                Ext.getCmp("requestedStaff").setValue(selectedRec.data.approverId);
            }
        },
        resetWaveOff : function() {
            Ext.getCmp("wavedOfAmount").setValue(0);
            Ext.getCmp("wavedOffAuthority").setValue();
            Ext.getCmp("wavedOffDate").setValue(new Date());
            Ext.getCmp("wavedOfRemark").setValue();
        },
        resetStudentDetails : function() {
            Ext.getCmp("requestFor").setValue(0);
            Ext.getCmp("amount").setValue(0);
            Ext.getCmp("description").setValue();
            Ext.getCmp("requestedStaff").setValue(new Date());
            Ext.getCmp("wayOfPenalty").setValue(0);
        },
        calculatePenaltyWaveOff:function(){
            var totalPenalty=  Ext.getCmp("penaltyAmount").value;
            var percentage=Ext.getCmp("wayOfPenalty").value;
            var waveOfPenaltyAmount=Ext.getCmp("waveOfPenaltyAmount");
            var approverComment=Ext.getCmp("approverComment");
            var amount=0;
            if(percentage!=0){
                amount=totalPenalty-((percentage/100)*totalPenalty);
                waveOfPenaltyAmount.setValue(Math.round(amount))
            }else{
                waveOfPenaltyAmount.setValue(Math.round(totalPenalty));
            }
            approverComment.setValue("total Penalty="+totalPenalty+" waive Off percentage="+percentage+" total penalty to be paid="+waveOfPenaltyAmount.value);
        },
        penaltyRule:function(obj){
          var value=obj.value;  
          var penaltyAmout=Ext.getCmp("amount");
          if(value!="NA"){
              penaltyAmout.setVisible(true);
              penaltyAmout.setDisabled(false);
          }else{
              penaltyAmout.setVisible(false);
              penaltyAmout.setDisabled(true);
          }
        },
        resetStudentRequestDetails: function () {
            Ext.getCmp("approverComment").setValue(0);
            Ext.getCmp("amount").setValue(0);
        },
        studentfeeDetails: function (combo, records, eOpts) {
            var requestFor = Ext.getCmp("requestFor").value;
            var inst = Advaya.Gms.Fees.instance;
            Ext.getCmp("amount").setValue(0);
            Ext.getCmp("amount").setMaxValue(0);
            var penaltyAmount=Ext.getCmp("penaltyAmountLabel");
            var challanNumber=Ext.getCmp("challanNo");
            if(requestFor!="Penalty Waive Off"){
                penaltyAmount.setDisabled(true);
                Ext.getCmp("amount").setVisible(true);
                Ext.getCmp("amount").setDisabled(false);
                challanNumber.setVisible(true);
                challanNumber.setDisabled(false);
            }else{
                penaltyAmount.setDisabled(false);
                Ext.getCmp("amount").setVisible(false);
                Ext.getCmp("amount").setDisabled(true);
                challanNumber.setVisible(false);
                challanNumber.setDisabled(true);
                Ext.getCmp("requestedStaff").store.loadData(JSON.parse(inst.ApproverStaff.WaiveOff));
            }
            if (requestFor == "Refund" || requestFor == "Excess-Refund" || requestFor == "Cancel") {
                var payableAmt = Ext.getCmp("studentFeeDetailpayableAmt").value;
                var deuAmt = parseInt(Ext.getCmp("studentFeeDetailDueAmt").value);
                Ext.getCmp("requestFor").setValue(requestFor);
                Ext.getCmp("requestedStaff").store.loadData(JSON.parse(inst.ApproverStaff.Refund));
                if (requestFor == "Excess-Refund" && deuAmt < 0) {
                    Ext.getCmp("amount").setMaxValue(Math.abs(deuAmt));
                    Ext.getCmp("amount").setValue(Math.abs(deuAmt));
                } else
                if ((requestFor == "Refund" ) && deuAmt >= 0) {
                    Ext.getCmp("amount").setMaxValue(payableAmt - deuAmt);
                    Ext.getCmp("amount").setValue(0);
                }else if ( requestFor == 'Cancel' && deuAmt >= 0){
                    Ext.getCmp("amount").setMaxValue(payableAmt - deuAmt);
                    Ext.getCmp("amount").setMinValue(payableAmt - deuAmt);
                    Ext.getCmp("amount").setValue(payableAmt - deuAmt);
                }
            }
            if (requestFor == "Waive Off") {
                var dueAmount = Ext.getCmp("studentFeeDetailDueAmt").value;
                Ext.getCmp("amount").setMaxValue(dueAmount);
                Ext.getCmp("requestFor").setValue(requestFor);
                Ext.getCmp("requestedStaff").store.loadData(JSON.parse(inst.ApproverStaff.WaiveOff));
            }
        },
        resetPayment: function () {
            Ext.getCmp("studentPaymentDetailId").setValue();
            Ext.getCmp("totalPayment").setValue(0);
            Ext.getCmp("paymentMode").setValue();
            Ext.getCmp("paymentDate").setValue(new Date());
            Ext.getCmp("remarks").setValue();
            Ext.getCmp("bank").setValue("Union Bank Of India");
            Ext.getCmp("transactionNumber").setValue();
        },
        historyPayments: function () {
            studentFeeDetail = Ext.getCmp("studentFeeDetailId").getValue();
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesWindow",
                req: "./fees/getPayment.action?id=" + studentFeeDetail + "&actionType=history"
            };
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        getChallanNo: function () {
            challanNO = Ext.getCmp("challanNO").getValue();
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesData",
                req: "./fees/studentFeeReport.action?challanNO=" + challanNO + "&actionType=searchChallan"
            };
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});

        },
        payment: function (download, src) {
            var inst = Advaya.Gms.Fees.instance;
            if (download) {
                inst.processIframeRequest(src);
            } else {
                var obj = {
                    form: true,
                    inst: Advaya.Gms.Fees.instance,
                    responseHandler: "setFeesWindow",
                    req: "./fees/getPayment.action?actionType=pay"
                };
                inst.loadFeesForm(obj);
            }
        },
        gridSearchName: function () {
            var inst = Advaya.Gms.Fees.instance;
            var nameFld = null
            if (Ext.getCmp("nameFld").value) {
                nameFld = Ext.getCmp("nameFld").value;
                inst.feesGrid.grid.getStore().clearFilter();
                if (nameFld.length >= 4) {
                    inst.feesGrid.grid.getStore().filter([{
                            property: "name",
                            value: nameFld,
                            anyMatch: true,
                            caseSensitive: false
                        }
                    ]);
                }
            }
            if (Ext.getCmp("challanNo").value) {
                nameFld = Ext.getCmp("challanNo").value;
                inst.feesGrid.grid.getStore().clearFilter();
                if (nameFld.length >= 4) {
                    inst.feesGrid.grid.getStore().filter([{
                            property: "challanNo",
                            value: nameFld,
                            anyMatch: true,
                            caseSensitive: false
                        }]);
                }
            }
            if (Ext.getCmp("usn").value) {
                nameFld = Ext.getCmp("usn").value;
                inst.feesGrid.grid.getStore().clearFilter();
                if (nameFld.length >= 4) {
                    inst.feesGrid.grid.getStore().filter([{
                            property: "usn",
                            value: nameFld,
                            anyMatch: true,
                            caseSensitive: false
                        }]);
                }
            }
        },
        challanDetails: function (type, src) {
            var inst = Advaya.Gms.Fees.instance;
            var record = inst.feesGrid.grid.getSelectionModel().getSelection();
            var req1 = null;
            if (type == "edit") {
                var stdate = Ext.getCmp('report_sdate').rawValue;
                var etdate = Ext.getCmp('report_edate').rawValue;
                req1 = "./fees/paymentByPC.action?actionType=editChallanDetails&challanNO=" + record[0].data.challanNo + "&type=" + type + "&sdate=" + stdate + "&edate=" + etdate
            } else {
                req1 = "./fees/paymentByPC.action?actionType=challanDetails&challanNO=" + record[0].data.challanNo + "&type=" + type
            }
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesWindow",
                req: req1
            };
            inst.loadFeesForm(obj);
        },
        challanPayment: function (eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            var challanNo = eOpts.params.challan;
            var type = eOpts.params.type;
            var msg1 = "";
            var req1 = null;
            var form;
            var paymentDate = Ext.getCmp('Pdate').rawValue;
            if (challanNo == undefined || challanNo == "" || paymentDate == undefined || paymentDate == "") {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Mandatory fields are left empty ",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            if (type == "edit") {
                records = inst.winGrid.grid.store.data.items;
                var jsonData = Advaya.Gms.Classes.handler.getGridDataAsJSON(records);
                var inputEle = document.createElement("input");
                var paymentStatus = Ext.getCmp("paidStatus").getValue();
                inputEle.name = 'jsonData';
                inputEle.value = jsonData;
                form = document.createElement("form");
                form.appendChild(inputEle);
                var remarks = Ext.getCmp("remarks").value;
                if (remarks == undefined || remarks == "" || paymentStatus.PaidStatus == undefined || paymentStatus.PaidStatus == "") {
                    Ext.MessageBox.show({
                        title: 'Alert!',
                        msg: "Mandatory fields are left empty",
                        buttons: Ext.MessageBox.OK
                    });
                    return;
                }
                msg1 = "Do you want to save details for" + challanNo;
                req1 = "./fees/paymentByPC.action?actionType=editPayment&challanNO=" + challanNo + "&sdate=" + paymentDate + "&studentPaymentDetail.remarks=" + remarks + "&paymentStatus=" + paymentStatus.PaidStatus;
            }else {
                var verified = eOpts.params.isVerified;
                if (verified == 'no') {
                    msg1 = "Do you want to verify payment for challan " + challanNo;
                    req1 = "./fees/paymentByPC.action?actionType=updateIsVerified&challanNO=" + challanNo + "&sdate=" + paymentDate
                } else {
                    msg1 = "Do you want to make Payment for Challan " + challanNo;
                    req1 = "./fees/paymentByPC.action?actionType=makePayment&challanNO=" + challanNo + "&sdate=" + paymentDate
                }
            }
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: msg1,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _P").disabled = true;
                            if (document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _C")) {
                                document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _C").disabled = true;
                            }
                            document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _P").className = "disabeldBtn disabled";
                            if (document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _C")) {
                                document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _C").className = "disabeldBtn disabled";
                            }
                            var obj = {
                                form: true,
                                inst: Advaya.Gms.Fees.instance,
                                responseHandler: "setFeesWindow",
                                req: req1
                            };
                            if (type == "edit") {
                                obj.form = form;
                                Advaya.App.Initiator.handler.showLoadMask();
                                inst.parent.getConfiguration(obj, {});
                                break;
                            }
                            inst.loadFeesForm(obj);
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        saveEditChallan: function (eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            var challanNo = eOpts.params.challan;
            var form;
            var msg1 = "";
            var req1 = null;
            var inputEle = document.createElement("input");
            var paymentStatus = Ext.getCmp("paidStatus").getValue();
            var paymentDate = Ext.getCmp('Pdate').rawValue;
            var stdate = Ext.getCmp('report_sdate').rawValue;
            var etdate = Ext.getCmp('report_edate').rawValue;
            records = inst.winGrid.grid.store.data.items;
            var jsonData = Advaya.Gms.Classes.handler.getGridDataAsJSON(records);
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            form = document.createElement("form");
            form.appendChild(inputEle);
            var remarks = Ext.getCmp("remarks").value;
            if (remarks == undefined || remarks == "" || paymentStatus.PaidStatus == undefined || paymentStatus.PaidStatus == "") {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Mandatory fields are left empty",
                    buttons: Ext.MessageBox.OK
                });
                return;
            } else if (paymentStatus.PaidStatus == 'Paid' && (paymentDate == undefined || paymentDate == "")) {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Mandatory fields are left empty",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            msg1 = "Do you want to save details for" + challanNo;
            req1 = "./fees/paymentByPC.action?actionType=editPayment&challanNO=" + challanNo + "&paymentDate=" + paymentDate + "&studentPaymentDetail.remarks=" + remarks + "&paymentStatus=" + paymentStatus.PaidStatus + "&sdate=" + stdate + "&edate=" + etdate;
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: msg1,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            var obj = {
                                form: true,
                                inst: Advaya.Gms.Fees.instance,
                                action: "loadFeesForm",
                                responseHandler: "setFeesData",
                                req: req1
                            };
                            obj.form = form;
                            Advaya.App.Initiator.handler.showLoadMask();
                            inst.parent.getConfiguration(obj, {});
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        refreshPayment: function (objs) {
            var insts = Advaya.Gms.Fees.instance;
            var stdate = Ext.getCmp('report_sdate').rawValue;
            var etdate = Ext.getCmp('report_edate').rawValue;
            var req1 = "&sdate=" + stdate + "&edate=" + etdate;
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                action: objs.params.action,
                responseHandler: objs.params.responseHandler,
                req: objs.params.req + req1
            };
            Advaya.App.Initiator.handler.showLoadMask();
            insts.parent.getConfiguration(obj, {});
        },
        challanCancel: function (eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            var challanNo = eOpts.params.challan;
            var remarks = Ext.getCmp("description").value;
            if (challanNo == undefined || challanNo == "" || remarks == undefined || remarks == "") {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Mandatory fields are left empty ",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: "Do you want to cancel for Challan" + challanNo,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _P").disabled = true;
                            document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _C").disabled = true;
                            document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _P").className = "disabeldBtn disabled";
                            document.getElementById(inst.feesGrid.grid.getSelectionModel().lastSelected.data.challanNo + " _C").className = "disabeldBtn disabled";
                            var obj = {
                                form: true,
                                inst: Advaya.Gms.Fees.instance,
                                responseHandler: "setFeesWindow",
                                req: "./fees/paymentByPC.action?actionType=cancelChallan&challanNO=" + challanNo + "&studentPaymentDetail.remarks=" + remarks
                            };
                            inst.loadFeesForm(obj);
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        dateChanger: function () {
            var etdate = Ext.getCmp('report_sdate').rawValue;

            document.getElementById(report_edate).maxValue = etdate;
        },
        paymentDetails: function () {
            var inst = Advaya.Gms.Fees.instance;
            studentFeeDetail = Ext.getCmp("studentFeeDetailId").getValue();
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesWindow",
                req: "./fees/getPayment.action?actionType=pay&id=" + studentFeeDetail
            };
            inst.loadFeesForm(obj);
        },
        printReceipt: function () {
            var inst = Advaya.Gms.Fees.instance;
            var transactionNumber = Ext.getCmp("transactionNumber").getValue().toString();
            var id = Ext.getCmp("studentFeeDetailId").getValue();
            var src = "./fees/getPayment.action?actionType=print&transactionNumber=" + transactionNumber + "&id=" + id;
            inst.processIframeRequest(src);
        },
        waveOff: function () {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesWindow",
                req: "./fees/waveOff.action?actionType=getwaveOffWindow"
            };
            inst.loadFeesForm(obj);
        },
        request: function (id,src) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesWindow",
//                req: "./fees/studentRequest.action?actionType=sendRequest&id="+id
                req:src+"&id="+id
            };
            inst.loadFeesForm(obj);
        },
        changeRequest: function (responseHandler,req) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: responseHandler,
                req: req
            };
            inst.loadFeesForm(obj);
        },
        studentRequestDetails: function (type, id) {
            var obj = {};
            obj.inst = Advaya.Gms.Fees.instance;
            if (type && type === "view") {
                obj.req = "./fees/displayStudentRequest.action?actionType=viewDetails&id=" + id;
            } else {
                obj.req = "./fees/displayStudentRequest.action?actionType=approveDetails&id=" + id;
            }
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        studentRequestRejected: function (id) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/displayStudentRequest.action?actionType=rejectedDetails&id=" + id;
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        studentRequest: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            var amount;
            var penalty=false;
            if(Ext.getCmp('amount')){
            amount = Ext.getCmp('amount').value;
            }else{
                amount=Ext.getCmp('waveOfPenaltyAmount').value;
                penalty=true;
            }
            var maxAmountRefund = Ext.getCmp('maxAmount').value;
            var maxAmountWaiveoff = Ext.getCmp('maxAmountWaiveoff').value;
            var requestFor = Ext.getCmp('requestFor').value;
            var form = inst.winForm.getForm();
            if (form.isValid()) {
                if (requestFor == 'Refund') {
                    if (maxAmountRefund < amount && maxAmountRefund != -1) {
                        Ext.MessageBox.show({
                            title: 'Alert!',
                            msg: "Amount exceeds max approval limit",
                            buttons: Ext.MessageBox.OK
                        });
                        return;
                    }
                }else if (requestFor == 'Waive Off') {
                    if (maxAmountWaiveoff < amount && maxAmountWaiveoff != -1) {
                        Ext.MessageBox.show({
                            title: 'Alert!',
                            msg: "Amount exceeds max approval limit",
                            buttons: Ext.MessageBox.OK
                        });
                        return;
                    }
                }
                Ext.MessageBox.show({
                    title: 'Confirmation',
                    msg: "Do you want to Approve Student Request",
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'yes':
                                var srId = Ext.getCmp('sr').value;
//                                var amount = Ext.getCmp('amount').value;
                                var approverComment = Ext.getCmp('approverComment').value;
                                var requestFor = Ext.getCmp('requestFor').value;
                                obj.inst = Advaya.Gms.Fees.instance;
                                obj.req = "./fees/displayStudentRequest.action?actionType=approved&sr.id=" + srId + "&sr.amount=" + amount + "&sr.approverComment=" + approverComment + "&sr.requestType=" + requestFor;
                                if(penalty){
                                    var waveoffPercent=Ext.getCmp("wayOfPenalty").value;
                                    var dateofExpPenalty=Ext.getCmp("lastDatePenalty").rawValue;
                                    obj.req=obj.req+"&studentFeeDetail.penaltyWaveOfInPct="+waveoffPercent+"&paymentDate="+dateofExpPenalty;
                                }
                                obj.responseHandler = "setapproverList";
                                Advaya.App.Initiator.handler.showLoadMask();
                                Advaya.App.Parent.instance.getConfiguration(obj, {});
                                break;
                            case 'no':
                                break;
                        }
                    }
                });
            } else {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
            }
        },
        studentReject: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: "Do you want to Reject Student Request ?",
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            var srId = Ext.getCmp('sr').value;
                            var approverComment = Ext.getCmp('approverComment').value;
                            obj.inst = Advaya.Gms.Fees.instance;
                            obj.req = "./fees/displayStudentRequest.action?actionType=rejected&sr.id=" + srId + "&sr.approverComment=" + approverComment;
                            obj.responseHandler = "setapproverList";
                            Advaya.App.Initiator.handler.showLoadMask();
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        paymentByPC: function (obj1) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            var stdate = Ext.getCmp('report_sdate').rawValue;
            var etdate = Ext.getCmp('report_edate').rawValue;
            var type = obj1.params.type;
            if (Ext.getCmp('report_sdate') == undefined || Ext.getCmp('report_sdate') == undefined) {
                alert("Mandatory fields are left empty");
            }
            obj.inst = Advaya.Gms.Fees.instance;
            if (type) {
                obj.req = "./fees/paymentByPC.action?actionType=paymentByPC&sdate=" + stdate + "&edate=" + etdate + "&type=" + type;
            } else {
                obj.req = "./fees/paymentByPC.action?actionType=paymentByPC&sdate=" + stdate + "&edate=" + etdate;
            }
            obj.responseHandler = "setFeesData";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});

        },
        
           paymentByPCForEPayments: function (obj1) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            var stdate = Ext.getCmp('report_sdate').rawValue;
            var etdate = Ext.getCmp('report_edate').rawValue;
            var stTime = Ext.getCmp('report_sTime').rawValue;
            var enTime = Ext.getCmp('report_eTime').rawValue;
            var type = obj1.params.type;
            if (Ext.getCmp('report_sdate') == undefined || Ext.getCmp('report_sdate') == undefined || Ext.getCmp('report_sTime') == undefined || Ext.getCmp('report_eTime') == undefined) {
                alert("Mandatory fields are left empty");
            }
            obj.inst = Advaya.Gms.Fees.instance;
            if (type) {
                obj.req = "./fees/paymentByPC.action?actionType=paymentByPC&sdate=" + stdate + "&edate=" + etdate + "&type=" + type;
            } else {
                obj.req = "./fees/paymentByPC.action?actionType=epayments&sdate=" + stdate + "&edate=" + etdate +"&startTime=" +stTime +"&endTime=" +enTime;
            }
            obj.responseHandler = "setFeesData";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        
        getChallanForDue: function (obj1) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            var jsonData = Advaya.Gms.Classes.handler.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: "Do you want to Submit the data ?",
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            obj.form = document.createElement("form");
                            obj.req = obj1.params.req;
                            obj.responseHandler = obj1.params.responseHandler;
                            obj.action = obj1.params.action;
                            obj.form.appendChild(inputEle);
                            obj.inst = inst;
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        applyDiscount: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form1 = inst.winForm.getForm();
            var usn;
            var count = 0;
            var obj = {};
            if (!form1.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var objArrayDiscount = new Array();
            if (Ext.getCmp('count').getValue()) {
                count = parseInt(Ext.getCmp('count').value);
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        objArrayDiscount[i] = Ext.getCmp('feeDetails').items.items[i + 1].items.items[2].value.toString() + "-" + Ext.getCmp('feeDetails').items.items[i + 1].items.items[2].id.toString();
                    }
                }
            }
            var jsonData;
            var inputEle = document.createElement("input");
            obj.form = document.createElement("form");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            obj.form.appendChild(inputEle);
            obj.inst = Advaya.Gms.Admission.instance;
            obj.req = "./fees/applyDiscount.action?type=discountApply" + "&objArrayDiscount=" + objArrayDiscount;
            if (Ext.getCmp('usn') != undefined)
            {
                usn = Ext.getCmp('usn').value;
                obj.req = obj.req + "&stdent.usn=" + usn;
            }
            obj.responseHandler = "setFeesData";
            obj.action = "loadFeesForm";
            inst.instWindow.destroy();
            Ext.MessageBox.show({
                title: "Confirmation",
                msg: "Do You Want To apply discount:" + usn,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        percentage: function (count, ids, amount) {
            var per = Ext.getCmp(ids).value
            var perc = 0;
            perc = (per / amount) * 100;
            perc = (perc).toFixed(2);
            Ext.getCmp('pct-' + count).setValue(perc + " %");
        },
        feeChallan: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var student_usn = Ext.getCmp('student_usn').value;
            var paymentCycle_id = Ext.getCmp('paymentCycle_id').value;
            if (paymentCycle_id == undefined || paymentCycle_id == "") {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: "Select Payment Cycle year",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }

            var PaymentMode = Ext.getCmp('challan_Payment_Type').value;
            if (PaymentMode != 'Cash') {
                var ddChequebank = Ext.getCmp('dd_cheque_bank').value;
                var ddChequedate = Ext.getCmp('dd_cheque_date').rawValue.toString();
                var ddChequeNo = Ext.getCmp('dd_cheque_no').value;
                var ddChequeDetails = ddChequebank + "-" + ddChequedate + "-" + ddChequeNo;
                obj.req = "./fees/getChallan.action?actionType=getFee&stdent.usn=" + student_usn + "&paymentCycle.id=" + paymentCycle_id
                        + "&restrictFee=" + obj.params.restrictFee + "&fee.id=" + obj.params.fee + "&paymentTypes=" + obj.params.paymentTypes + "&ddChequeDetails=" + ddChequeDetails + "&PaymentMode=" + PaymentMode;
            } else {
                obj.req = "./fees/getChallan.action?actionType=getFee&stdent.usn=" + student_usn + "&paymentCycle.id=" + paymentCycle_id
                        + "&restrictFee=" + obj.params.restrictFee + "&fee.id=" + obj.params.fee + "&paymentTypes=" + obj.params.paymentTypes + "&PaymentMode=" + PaymentMode;
            }
            obj.responseHandler = "setChallanWindow";
            obj.inst = inst;
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        paymentType: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var category = Ext.getCmp('challan_category').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/exportChallan.action?actionType=getFeeRules&fltr.branch=" + branch + "&paymentCycle.id="
                    + paymentCycleId + "&fltr.quota=" + quota + "&fltr.category=" + category + "&fltr.resindential=" + resindential +
                    "&fltr.stateQuota=" + stateQuota + "&paymentTypes=" + obj.params.paymentTypes;
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        paymentTypeByStudent: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var nameAsPuc = Ext.getCmp('nameAsPuc').value;
            var fatherName = Ext.getCmp('fatherName').value;
            var motherName = Ext.getCmp('motherName').value;
            var mobileNo = Ext.getCmp('mobileNo').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var category = Ext.getCmp('challan_category').value;
            var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            var fee_Type = Ext.getCmp('fee_Type').value;
            var partial = true;
            obj.inst = Advaya.Gms.Fees.instance;
            var req = "fltr.branch=" + branch + "&paymentCycle.id="
                    + paymentCycleId + "&fltr.quota=" + quota + "&fltr.category=" + category + "&fltr.resindential=" + resindential +
                    "&fltr.stateQuota=" + stateQuota + "&fltr.allotedCategory=" + allotedCategory + "&paymentTypes=" + obj.params.paymentTypes + "&nameAsPuc=" + nameAsPuc + "&partial=" + partial +
                    "&mobileNo=" + mobileNo + "&fatherName=" + fatherName + "&motherName=" + motherName;
            obj.responseHandler = "setFeesWindow";
            if(fee_Type == 'Academic'){
                obj.req= "./fees/exportChallanStudent.action?actionType=getFeeRules&"+req
            }else{
                obj.req ="./fees/challanByStudentPackage.action?actionType=getFeeRules&type=Package&"+req
            }
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        getByChallanType: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var challanType = Ext.getCmp('challanType').getValue().challanType;
            if (challanType == 'USN') {
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/challan.action?actionType=" + challanType + "&paymentCycle.id=" + paymentCycleId;
                obj.responseHandler = "setFeesWindow";
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
            if (challanType == 'StudentNew') {
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/exportChallanStudent.action?actionType=popUp&type=Academic&id=" + paymentCycleId;
                obj.responseHandler = "setFeesWindow";
                obj.action = "loadFeesForm";
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
            if (challanType == 'challanNO') {
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/challan.action?actionType=" + challanType + "&id=" + paymentCycleId;
                obj.responseHandler = "setFeesWindow";
                obj.action = "loadFeesForm";
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
            if (challanType == 'ReprintChallan') {
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/challan.action?actionType=" + challanType + "&id=" + paymentCycleId;
                obj.responseHandler = "setFeesWindow";
                obj.action = "loadFeesForm";
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
            if (challanType == 'appNo') {
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/challan.action?actionType=" + challanType + "&id=" + paymentCycleId;
                obj.responseHandler = "setFeesWindow";
                obj.action = "loadFeesForm";
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }

        },
        changePaymentMode: function (obj, newValue, oldValue, eOpts) {
            var paymentField = Ext.getCmp('challan_Payment_Type').value;
            var ddChequebank = Ext.getCmp('dd_cheque_bank');
            var ddChequedate = Ext.getCmp('dd_cheque_date');
            var ddChequeNo = Ext.getCmp('dd_cheque_no');
            if (newValue != "Cash") {
                ddChequebank.show();
                ddChequedate.show();
                ddChequeNo.show();
                ddChequebank.enable();
                ddChequedate.enable();
                ddChequeNo.enable();
            } else {
                ddChequebank.disable();
                ddChequedate.disable();
                ddChequeNo.disable();
                ddChequebank.hide();
                ddChequedate.hide();
                ddChequeNo.hide();
            }
        },
        getStudentUsn: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var stdentUsn = Ext.getCmp('stdentUsn').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/getChallan.action?actionType=getchallanWindow&stdent.usn=" + stdentUsn;
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        getStudentChallan: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var Challan_No = Ext.getCmp('Challan_No').value;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/challan.action?actionType=previousChallanNo&challanNO=" + Challan_No + "&id=" + paymentCycleId;
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        getApplicationChallan: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var app_No = Ext.getCmp('app_No').value;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/challan.action?actionType=previousAppliNo&appNO=" + app_No + "&id=" + paymentCycleId;
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        reprintChalla: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var Challan_No = Ext.getCmp('Challan_No').value;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            obj.inst = Advaya.Gms.Fees.instance;
            src = "./fees/challan.action?actionType=reprintChallas&challanNO=" + Challan_No + "&id=" + paymentCycleId;
            inst.processIframeRequest(src);
        },
        getAdmissionRegistration: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
            var stdent = Ext.getCmp('student_id').value;
            obj.inst = Advaya.Gms.Fees.instance;
            src = "./fees/getChallan.action?actionType=printRegstr&paymentCycle.id=" + paymentCycleId + "&stdent.id=" + stdent;
            inst.processIframeRequest(src);
        },
        feeByChallan: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var Challan_No = Ext.getCmp('Challan_No').value;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/challan.action?actionType=feeByChallan&challanNO=" + Challan_No + "&id=" + paymentCycleId;
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        exportChallan: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var copies = Ext.getCmp('challan_copies').value;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var category = Ext.getCmp('challan_category').value;
            var objArray = new Array();
            for (var i = 0; i < Ext.getCmp('feeRuleList').items.length; i++) {
                objArray[i] = Ext.getCmp('feeRuleList').items.items[i].getId() + "-" + Ext.getCmp('feeRuleList').items.items[i].getValue().toString();
            }
            var studyingYear = Ext.getCmp('challan_studying_year').getValue().toString();
            if (objArray == undefined) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: "Select fee and proceed to download challan",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            var src = "./fees/exportChallan.action?actionType=exportChallan&fltr.copies=" + copies + "&studyingYear=" + studyingYear + "&paymentCycle.id="
                    + paymentCycleId + "&fltr.quota=" + quota + "&fltr.category=" + category + "&fltr.branch=" + branch + "&objArray=" + objArray.toString();
            inst.instWindow.destroy();
            inst.processIframeRequest(src);
        },
        feeByChallanPayment: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            var req;
            var challanNo, applicationNumber;
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var copies = Ext.getCmp('challan_copies').value;
            if (Ext.getCmp('challanNo') != undefined) {
                challanNo = Ext.getCmp('challanNo').value;
                req = "&application.challanNo=" + challanNo;
            }
            if (Ext.getCmp('applicationNumber') != undefined) {
                applicationNumber = Ext.getCmp('applicationNumber').value;
                req = "&application.applicationNumber=" + applicationNumber;
            }
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var category = Ext.getCmp('challan_category').value;
            var objArray = new Array();
            for (var i = 0; i < Ext.getCmp('feeRuleList').items.length; i++) {
                objArray[i] = Ext.getCmp('feeRuleList').items.items[i].getId() + "-" + Ext.getCmp('feeRuleList').items.items[i].getValue().toString();
            }
            var studyingYear = Ext.getCmp('challan_studying_year').getValue().toString();
            var PaymentType = Ext.getCmp('challan_Payment_Type').value;
            var ddChequeDetails;
            if (PaymentType != 'Cash') {
                var ddChequebank = Ext.getCmp('dd_cheque_bank').value;
                var ddChequedate = Ext.getCmp('dd_cheque_date').rawValue.toString();
                var ddChequeNo = Ext.getCmp('dd_cheque_no').value;
                ddChequeDetails = PaymentType + "-" + ddChequebank + "-" + ddChequedate + "-" + ddChequeNo;
            } else {
                ddChequeDetails = PaymentType;
            }
            if (objArray == undefined) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: "Select fee and proceed to download challan",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            var src = "./fees/challan.action?actionType=exportChallanForApp&fltr.copies=" + copies + "&studyingYear=" + studyingYear + "&paymentCycle.id="
                    + paymentCycleId + "&fltr.quota=" + quota + "&fltr.category=" + category + "&fltr.branch=" + branch + "&objArray=" + objArray.toString() + req + "&ddChequeDetails=" + ddChequeDetails;
            inst.instWindow.destroy();
            inst.processIframeRequest(src);
        },
        enableDisableAmount: function (obj, newValue, oldValue, eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            if (obj.getValue()) {
                if (Ext.getCmp(obj.inputValue).getId() == obj.inputValue) {
                    Ext.getCmp(obj.inputValue).setDisabled(false);

                }
            } else {
                if (Ext.getCmp(obj.inputValue).getId() == obj.inputValue) {
                    Ext.getCmp(obj.inputValue).setDisabled("disaled");

                }
            }

        },
        enableDisableAmount :function (obj, newValue, oldValue, eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            if (obj.getValue()) {
                if (Ext.getCmp(obj.inputValue).getId() == obj.inputValue) {
                    Ext.getCmp(obj.inputValue).setDisabled(false);

                }
            } else {
                if (Ext.getCmp(obj.inputValue).getId() == obj.inputValue) {
                    Ext.getCmp(obj.inputValue).setDisabled("disaled");
                }
            }
        },
                notPayableAtCollage: function (obj) {
                    var inst = Advaya.Gms.Fees.instance;
                    var form = inst.winForm.getForm();
                    if (!form.isValid()) {
                        Advaya.Gms.Message.handler.show({
                            message: "Mandatory fields are left empty"
                        });
                        return;
                    }
                    var paymentCycleId = Ext.getCmp('paymentCycleId').value;
                    var branch = Ext.getCmp('challan_branch').value;
                    var quota = Ext.getCmp('challan_quota').value;
                    var partial = Ext.getCmp('partial').value;
                    var category = Ext.getCmp('challan_category').value;
                    var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
                    var resindential = Ext.getCmp('challan_resindential').value;
                    var studyingYear = Ext.getCmp('challan_studying_year').value;
                    var stateQuota = Ext.getCmp('challan_stateQuota').value;
                    var nameAsPuc = Ext.getCmp('nameAsPuc').value;
                    var fatherName = Ext.getCmp('fatherName').value;
                    var motherName = Ext.getCmp('motherName').value;
                    var mobileNo = Ext.getCmp('mobileNo').value;
//            var PaymentType = Ext.getCmp('challan_Payment_Type').value;
//            var challanssNoType = Ext.getCmp('challanss_no').value;
                    var obj1Params = obj.params;
                    var ddChequeDetails;
                    var appendReq = "";
                    var AdmissionOrderNo = Ext.getCmp('Admission_Order_No').value;
                    var AdmissionOrderDate = Ext.getCmp('Admission_Order_Date').rawValue.toString();
                    var PaymentType = Ext.getCmp('Admission_Order_Payment_Type').value;
                    if (PaymentType == undefined){
                        PaymentType="Cash";
                    }
//            if(PaymentType != 'Cash' ){
//                var ddChequeNo = Ext.getCmp('dd_cheque_no').value;
////                ddChequeDetails = PaymentType+"-"+challanssNoType+"-"+bankName+"-"+ddChequebank+"-"+ddChequedate+"-"+ddChequeNo;
//            }else{
////                ddChequeDetails = PaymentType+"-"+challanssNoType+"-"+bankName;
//            }
                    ddChequeDetails = PaymentType + "-" + AdmissionOrderNo + "-" + AdmissionOrderDate;
                    var objArray = new Array();
                    for (var i = 0; i < Ext.getCmp('feesDetails').items.length; i++) {
                        objArray[i] = Ext.getCmp('feesDetails').items.items[i].getValue() + "-" + Ext.getCmp('feesDetails').items.items[i].getId().toString();
                    }
                    if (objArray == undefined) {
                        Ext.MessageBox.show({
                            title: 'Info',
                            msg: "Select fee and proceed to next",
                            buttons: Ext.MessageBox.OK
                        });
                        return;
                    }
                    if (Ext.getCmp('SubsidyFeeRule') != undefined && obj1Params.applySubsidy == 'skip') {
                        Ext.getCmp('SubsidyFeeRule').allowBlank = false;
                    }

                    if (obj1Params.applySubsidy == 'apply') {
                        var objArraySubsidy = new Array();
                        for (var i = 0; i < Ext.getCmp('SubsidyFeeRule').items.length; i++) {
                            objArraySubsidy[i] = Ext.getCmp('SubsidyFeeRule').items.items[i].inputValue.toString();
                        }
                        if (objArraySubsidy == undefined) {
                            Ext.MessageBox.show({
                                title: 'Info',
                                msg: "Select Subsidy fee rule and proceed to next",
                                buttons: Ext.MessageBox.OK
                            });
                            return;
                        }
                        if (Ext.getCmp('SubsidyFeeRule').items.length > 2) {
                            Ext.MessageBox.show({
                                title: 'Info',
                                msg: "Select only one Subsidy fee rule to proceed next",
                                buttons: Ext.MessageBox.OK
                            });
                            return;
                        }
                        appendReq = "&objArraySubsidy=" + objArraySubsidy;
                    }

                    obj.inst = inst;
                    obj.req = "./fees/exportChallanStudent.action?actionType=getFeeRulesWithoutSubsidy&fltr.copies=" + "1" + "&studyingYear=&paymentCycle.id="
                            + paymentCycleId + "&fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory + "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential + "&fltr.branch=" + branch + "&objArray1=" + objArray.toString() +
                            "&nameAsPuc=" + nameAsPuc + "&partial=" + partial + "&mobileNo=" + mobileNo + "&motherName=" + motherName + "&fatherName=" + fatherName
                            + "&PaymentMode1=" + ddChequeDetails + "&applySubsidy=" + obj1Params.applySubsidy + appendReq + "&fltr.studyingYear=" + studyingYear;
                    obj.responseHandler = "setFeesWindow";
                    Advaya.App.Initiator.handler.showLoadMask();
                    Advaya.App.Parent.instance.getConfiguration(obj, {});
                },
        notPayableAtCollagePkg: function (obj) {
                    var inst = Advaya.Gms.Fees.instance;
                    var form = inst.winForm.getForm();
                    if (!form.isValid()) {
                        Advaya.Gms.Message.handler.show({
                            message: "Mandatory fields are left empty"
                        });
                        return;
                    }
                    var paymentCycleId = Ext.getCmp('paymentCycleId').value;
                    var branch = Ext.getCmp('challan_branch').value;
                    var quota = Ext.getCmp('challan_quota').value;
                    var partial = Ext.getCmp('partial').value;
                    var category = Ext.getCmp('challan_category').value;
                    var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
                    var resindential = Ext.getCmp('challan_resindential').value;
                    var stateQuota = Ext.getCmp('challan_stateQuota').value;
                    var nameAsPuc = Ext.getCmp('nameAsPuc').value;
                    var fatherName = Ext.getCmp('fatherName').value;
                    var motherName = Ext.getCmp('motherName').value;
                    var mobileNo = Ext.getCmp('mobileNo').value;
                    var fixedFees = Ext.getCmp('fixedFees').value;
                    var studyingYear = Ext.getCmp('challan_studying_year').value;
                    var tree = Ext.getCmp("fee-tree");
                    var records = tree.getView().getChecked();
                    var jsonData = Advaya.Gms.Fees.handler.getGridDataAsJSON(records);
                    obj.inst = inst;
                    obj.req = "./fees/challanByStudentPackage.action?actionType=applyPackages&fltr.copies=1&paymentCycle.id="
                            + paymentCycleId + "&fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory +
                            "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential +
                            "&fltr.branch=" + branch +"&nameAsPuc=" + nameAsPuc + "&partial=" + partial + "&mobileNo=" + mobileNo + 
                            "&motherName=" + motherName + "&fatherName=" + fatherName+"&fixedFees="+fixedFees +"&fltr.studyingYear=" + studyingYear;
                    obj.responseHandler = "setFeesWindow";
                    
                    var inputEle = document.createElement("input");
                    inputEle.name = 'jsonData';
                    inputEle.value = jsonData;
                    var form = document.createElement("form");
                    form.appendChild(inputEle)
                    obj.form = form;
                    
                    Advaya.App.Initiator.handler.showLoadMask();
                    Advaya.App.Parent.instance.getConfiguration(obj, {});
                },
        createFeeRule: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var partial = Ext.getCmp('partial').value;
            var category = Ext.getCmp('challan_category').value;
            var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            var nameAsPuc = Ext.getCmp('nameAsPuc').value;
            var fatherName = Ext.getCmp('fatherName').value;
            var motherName = Ext.getCmp('motherName').value;
            var mobileNo = Ext.getCmp('mobileNo').value;
            var totalField = Ext.getCmp('totalField').value;
            var studyingYear = Ext.getCmp('challan_studying_year').value;
            var totalPayableAmount = Ext.getCmp('totalPayableAmount').value;
            totalField=parseFloat(totalField);
            totalPayableAmount=parseFloat(totalPayableAmount);
             var objArray = new Array();
            var feeRuleList = Ext.getCmp("feeRuleList");
            var k=0;
            for(var i=0;i< feeRuleList.items.length;i++){
                for(var j=0;j< feeRuleList.items.items[i].items.length;j++){
                    objArray[k] = feeRuleList.items.items[i].items.items[j].value+"-"+ feeRuleList.items.items[i].id +"_"+feeRuleList.items.items[i].items.items[j].id
                    k++;
                }
            }
            obj.inst = inst;
            obj.req = "./fees/challanByStudentPackage.action?actionType=applyFeeRulePackages&fltr.copies=1&paymentCycle.id="
            + paymentCycleId +"&objArray="+objArray+" &fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory +
            "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential +
            "&fltr.branch=" + branch +"&nameAsPuc=" + nameAsPuc + "&partial=" + partial + "&mobileNo=" + mobileNo + "&motherName=" + motherName + "&fatherName=" + fatherName +"&fltr.studyingYear=" + studyingYear;
            obj.responseHandler = "setFeesWindow";
            Ext.MessageBox.show({
                title: "Confirmation",
                msg: "Do You Want To create overall Fees " + nameAsPuc,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            if(totalField > totalPayableAmount  || totalField < totalPayableAmount){ 
                                Advaya.Gms.Fees.handler.alert("Applied package need to be matched with total applied amount")
                                break;
                            }
                            if(Advaya.Gms.Fees.instance.instWindow){
                                Advaya.Gms.Fees.instance.instWindow.destroy();
                            }
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                        case 'no':
                            break;
                    }
                }
            });
            
//            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        exportChallanByStudent: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            var applicationNo;
            var applicationFeesRule;
            var flageType;
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var copies = Ext.getCmp('challan_copies').value;
            var objArray1 = Ext.getCmp('objArray1').value.toString();
            var objArraySubsidy = Ext.getCmp('objArraySubsidy').value.toString();
            var applySubsidy = Ext.getCmp('applySubsidy').value.toString();
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var partial = Ext.getCmp('partial').value;
            var category = Ext.getCmp('challan_category').value;
            var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            var nameAsPuc = Ext.getCmp('nameAsPuc').value;
            var fatherName = Ext.getCmp('fatherName').value;
            var motherName = Ext.getCmp('motherName').value;
            var mobileNo = Ext.getCmp('mobileNo').value;
            var PaymentMode1 = Ext.getCmp('PaymentMode1').value;
            var obj1 = obj.params;
            if (obj1 != undefined && obj1.paymentTypes == 'back') {
                var type=obj1.type;
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/exportChallanStudent.action?actionType=popUp&fltr.copies=" + copies + "&id="
                        + paymentCycleId + "&fltr.resindential=" + resindential + "&nameAsPuc=" + nameAsPuc + "&mobileNo=" + mobileNo +
                        "&PaymentMode1=" + PaymentMode1 + "&fatherName=" + fatherName + "&motherName=" + motherName+"&type="+type
            } else {
                var objArray = new Array();
                for (var i = 0; i < Ext.getCmp('feeRuleList').items.length; i++) {
                    objArray[i] = Ext.getCmp('feeRuleList').items.items[i].inputValue + "-" + Ext.getCmp('feeRuleList').items.items[i].getValue().toString();
                }
                if (objArray == undefined) {
                    Ext.MessageBox.show({
                        title: 'Info',
                        msg: "Select fee and proceed to download challan",
                        buttons: Ext.MessageBox.OK
                    });
                    return;
                }
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/exportChallanStudent.action?actionType=applicableFeeRules&fltr.copies=" + copies + "&studyingYear=&paymentCycle.id="
                        + paymentCycleId + "&fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory + "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential + "&fltr.branch=" + branch + "&objArray=" + objArray.toString() + "&nameAsPuc=" + nameAsPuc + "&partial=" + partial + "&mobileNo=" + mobileNo
                        + "&objArray1=" + objArray1 + "&PaymentMode1=" + PaymentMode1 + "&applySubsidy=" + applySubsidy +
                        "&objArraySubsidy=" + objArraySubsidy + "&fatherName=" + fatherName + "&motherName=" + motherName;
                if (Ext.getCmp('applicationNo') != undefined)
                {
                    applicationNo = Ext.getCmp('applicationNo').value;
                    obj.req = obj.req + "&applicationNo=" + applicationNo;
                }
                if (Ext.getCmp('flageType') != undefined)
                {
                    flageType = Ext.getCmp('flageType').value;
                    obj.req = obj.req + "&flageType=" + flageType;
                }
            }
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        
        exportChallanByStudent1: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            var applicationNo;
            var applicationFeesRule;
            var flageType;
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var copies = Ext.getCmp('challan_copies').value;
            var objArray1 = Ext.getCmp('objArray1').value.toString();
            var objArraySubsidy = Ext.getCmp('objArraySubsidy').value.toString();
            var applySubsidy = Ext.getCmp('applySubsidy').value.toString();
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var partial = Ext.getCmp('partial').value;
            var category = Ext.getCmp('challan_category').value;
            var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            var nameAsPuc = Ext.getCmp('nameAsPuc').value;
            var fatherName = Ext.getCmp('fatherName').value;
            var motherName = Ext.getCmp('motherName').value;
            var mobileNo = Ext.getCmp('mobileNo').value;
            var PaymentMode1 = Ext.getCmp('PaymentMode1').value;
            var studyingYear = Ext.getCmp('challan_studying_year').value;
            var obj1 = obj.params;
            if (obj1 != undefined && obj1.paymentTypes == 'back') {
                var type=obj1.type;
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/exportChallanStudent.action?actionType=popUp&fltr.copies=" + copies + "&id="
                        + paymentCycleId + "&fltr.resindential=" + resindential + "&nameAsPuc=" + nameAsPuc + "&mobileNo=" + mobileNo +
                        "&PaymentMode1=" + PaymentMode1 + "&fatherName=" + fatherName + "&motherName=" + motherName+"&type="+type
            } else {
                var objArray = new Array();
                for (var i = 0; i < Ext.getCmp('feeRuleList').items.length; i++) {
                    objArray[i] = Ext.getCmp('feeRuleList').items.items[i].inputValue + "-" + Ext.getCmp('feeRuleList').items.items[i].getValue().toString();
                }
                if (objArray == undefined) {
                    Ext.MessageBox.show({
                        title: 'Info',
                        msg: "Select fee and proceed to download challan",
                        buttons: Ext.MessageBox.OK
                    });
                    return;
                }
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/saveCreateApplicationAndShowFees.action?actionType=applicableFeeRules&fltr.copies=" + copies + "&studyingYear=&paymentCycle.id="
                        + paymentCycleId + "&fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory + "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential + "&fltr.branch=" + branch + "&objArray=" + objArray.toString() + "&nameAsPuc=" + nameAsPuc + "&partial=" + partial + "&mobileNo=" + mobileNo
                        + "&objArray1=" + objArray1 + "&PaymentMode1=" + PaymentMode1 + "&applySubsidy=" + applySubsidy +
                        "&objArraySubsidy=" + objArraySubsidy + "&fatherName=" + fatherName + "&motherName=" + motherName +"&fltr.studyingYear=" + studyingYear;
                if (Ext.getCmp('applicationNo') != undefined)
                {
                    applicationNo = Ext.getCmp('applicationNo').value;
                    obj.req = obj.req + "&applicationNo=" + applicationNo;
                }
                if (Ext.getCmp('flageType') != undefined)
                {
                    flageType = Ext.getCmp('flageType').value;
                    obj.req = obj.req + "&flageType=" + flageType;
                }
            }
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
                
        nextChallanWindow: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
            var residentialStatus = Ext.getCmp('Residential_Status').value;
            var studyingYear = Ext.getCmp('studyingYear').value;
            var usn = Ext.getCmp('student_usn').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/getChallan.action?actionType=getFee&paymentCycle.id=" + paymentCycleId + "&stdent.usn=" + usn + "&type=" + residentialStatus+"&studyingYear="+studyingYear;
            obj.responseHandler = "setChallanWindow";
            if (inst.winForm) {
                inst.winForm.destroy();
                inst.instWindow.destroy();
            }
            if (inst.challanWindow) {
                inst.challanWindow.destroy();
            }

            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        changeQuota: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var quota = Ext.getCmp('quota').rawValue;
            var usn = Ext.getCmp('student_usn').value;
            var category = Ext.getCmp('category').rawValue;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/getChallan.action?actionType=saveQuota&quota=" + quota + "&stdent.usn=" + usn + "&category=" + category;
            obj.responseHandler = "setChallanWindow";
            if (inst.winForm) {
                inst.winForm.destroy();
                inst.instWindow.destroy();
            }
            if (inst.challanWindow) {
                inst.challanWindow.destroy();
            }

            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        nextChallanWindow : function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
            if (Ext.getCmp('Residential_Status') != undefined) {
                var residentialStatus = Ext.getCmp('Residential_Status').value;
            }
            if (Ext.getCmp('studyingYear') != undefined) {
                var studyingYear = Ext.getCmp('studyingYear').value;
            }
            var usn = Ext.getCmp('student_usn').value;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = "./fees/getChallan.action?actionType=getFee&paymentCycle.id=" + paymentCycleId + "&stdent.usn=" + usn + "&type=" + residentialStatus+"&studyingYear="+studyingYear;
            obj.responseHandler = "setChallanWindow";
            if (inst.winForm) {
                inst.winForm.destroy();
                inst.instWindow.destroy();
            }
            if (inst.challanWindow) {
                inst.challanWindow.destroy();
            }

            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
                saveFeesDetails: function (obj) {
                    var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
                    var usn = Ext.getCmp('student_usn').value;
                    obj.inst = Advaya.Gms.Fees.instance;

                    obj.req = "./fees/getChallan.action?actionType=getFee&paymentCycle.id=" + paymentCycleId + "&stdent.usn=" + usn + "&type=" + residentialStatus;
                    obj.responseHandler = "setChallanWindow";
                    Advaya.App.Initiator.handler.showLoadMask();
                    Advaya.App.Parent.instance.getConfiguration(obj, {});
                },
        destroyChallanWindow: function ( ) {
            var inst = Advaya.Gms.Fees.instance;
            if (inst.challanWindow) {
                inst.challanWindow.destroy();
                inst.challanWindow = null;
            }
            if (inst.instWindow) {
                inst.instWindow.destroy();
//                inst.instWindow = null;
            }
        },
        printChallaByApplication: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }

            var totalField = Ext.getCmp('totalField').value;
            if (totalField == 0) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: "Fees amount cant be zero",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            var copies = Ext.getCmp('challan_copies').value;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var partial = Ext.getCmp('partial').value;
            var category = Ext.getCmp('challan_category').value;
            var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            var nameAsPuc = Ext.getCmp('nameAsPuc').value;
            var fatherName = Ext.getCmp('fatherName').value;
            var motherName = Ext.getCmp('motherName').value;
            var PaymentType = Ext.getCmp('challan_Payment_Type').value;
            var mobileNo = Ext.getCmp('mobileNo').value;
            var studyingYear = Ext.getCmp('challan_studying_year').getValue().toString();
            var objArray = Ext.getCmp('objArray').getValue().toString();
            var objArray1 = Ext.getCmp('objArray1').getValue().toString();
            var objArraySubsidy = Ext.getCmp('objArraySubsidy').getValue().toString();
            var applySubsidy = Ext.getCmp('applySubsidy').value.toString();
            var PaymentMode1 = Ext.getCmp('PaymentMode1').getValue().toString();
            var objArrayAmount = new Array();
            for (var i = 0; i < inst.winGrid.store.data.items.length; i++) {
                var pAmount=inst.winGrid.store.data.items[i].data.amount;
                var dAmount=inst.winGrid.store.data.items[i].data.dueamount;
                var lfName=inst.winGrid.store.data.items[i].data.feeName;
                if(pAmount>dAmount){
                    Ext.MessageBox.show({
                        title: 'Info',
                        msg: "Fees amount cant be more than due amount for "+lfName,
                        buttons: Ext.MessageBox.OK
                    });
                    return false;
                }
                objArrayAmount[i] = inst.winGrid.store.data.items[i].data.amount + "-" + inst.winGrid.store.data.items[i].data.id.toString();
            }
            var src = "./fees/exportChallanStudent.action?actionType=exportChallan&fltr.copies=" + copies + "&studyingYear=" + studyingYear + "&paymentCycle.id="
                    + paymentCycleId + "&fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory + "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential + "&fltr.branch=" + branch + "&objArray=" + objArray.toString() + "&nameAsPuc=" + nameAsPuc + "&partial=" + partial
                    + "&PaymentMode=" + PaymentType + "&mobileNo=" + mobileNo + "&objArrayAmount=" + objArrayAmount.toString() +
                    "&objArray1=" + objArray1.toString() + "&PaymentMode1=" + PaymentMode1 + "&applySubsidy=" + applySubsidy +
                    "&objArraySubsidy=" + objArraySubsidy + "&fatherName=" + fatherName + "&motherName=" + motherName;
            if (PaymentType != 'Cash') {
                var ddChequebank = Ext.getCmp('dd_cheque_bank').value;
                var ddChequedate = Ext.getCmp('dd_cheque_date').rawValue.toString();
                var ddChequeNo = Ext.getCmp('dd_cheque_no').value;
                var ddChequeDetails = ddChequebank + "-" + ddChequedate + "-" + ddChequeNo;
                src = src + "&ddChequeDetails=" + ddChequeDetails;
            }
            var applicationNo;
            var applicationFeesRule;
            var flageType;
            if (Ext.getCmp('applicationNo') != undefined)
            {
                applicationNo = Ext.getCmp('applicationNo').value;
                src = src + "&applicationNo=" + applicationNo;
            }
            if (Ext.getCmp('applicationFeesRule') != undefined)
            {
                applicationNo = Ext.getCmp('applicationFeesRule').value;
                src = src + "&applicationFeesRule=" + applicationFeesRule;
            }
            if (Ext.getCmp('flageType') != undefined)
            {
                flageType = Ext.getCmp('flageType').value;
                src = src + "&flageType=" + flageType;
            }
//            inst.instWindow.destroy();
            inst.processIframeRequest(src);
        },
        challanExport: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            var printPluginType = "";
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            if (obj.params) {
                printPluginType = obj.params.printType;
            }
            var printExcess;
            if (Ext.getCmp('printExcess')) {
                printExcess = Ext.getCmp('printExcess').value
            }
            if (printPluginType == "printPluginFee") {
                var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
                var stdent = Ext.getCmp('student_usn').value;
                var PaymentMode = Ext.getCmp('challan_Payment_Type').value;
                var noOfSubjects = Ext.getCmp('noOfSubjects').value;
                var ddChequeDetails = Ext.getCmp('dd_cheque_no').value;
                var objArrayAmount = new Array();
                for (var i = 0; i < inst.winGrid.store.data.items.length; i++) {
                    objArrayAmount[i] = inst.winGrid.store.data.items[i].data.id.toString() + "-" + inst.winGrid.store.data.items[i].data.amount;
                }
                var src = "./fees/getChallan.action?actionType=print&paymentCycle.id=" + paymentCycleId + "&objArray=" + objArrayAmount.toString() + "&PaymentMode=" + PaymentMode + "&stdent.usn=" + stdent + "&studentFeeInfo.item=" + noOfSubjects + "&data=" + obj.params.challanType;
                if (PaymentType != 'Cash') {
                    src = src + "&ddChequeDetails=" + ddChequeDetails;
                }
                if (printExcess) {
                    src = src + "&printExcess=" + printExcess;
                }
                if (inst.challanWindow) {
                    inst.challanWindow.destroy();
                }
                inst.processIframeRequest(src);
            } else {
                var paymentCycleIds = Ext.getCmp('paymentCycle_id').value;
                var totalField = Ext.getCmp("totalField").value;
                var stdents = Ext.getCmp('student_usn').value;
                var PaymentType = Ext.getCmp('challan_Payment_Type').value;
                var objArrayAmounts = new Array();
                if (totalField == 0) {
                    Advaya.Gms.Fees.handler.alert("fees amount cant be zero")
                }
                for (var j = 0; j < inst.winGrid.store.data.items.length; j++) {
                    var pAmount=inst.winGrid.store.data.items[j].data.amount;
                    var dAmount=inst.winGrid.store.data.items[j].data.dueAmount;
                    var lfName=inst.winGrid.store.data.items[j].data.feeName;
                    if(pAmount>dAmount){
                        Ext.MessageBox.show({
                            title: 'Info',
                            msg: "Fees amount cant be more than due amount for "+lfName,
                            buttons: Ext.MessageBox.OK
                        });
                        return false;
                    }
                    objArrayAmounts[j] = inst.winGrid.store.data.items[j].data.id.toString() + "-" + inst.winGrid.store.data.items[j].data.amount;
                }
                var srcs = "./fees/getChallan.action?actionType=print&paymentCycle.id=" + paymentCycleIds + "&objArray=" + objArrayAmounts.toString() + "&PaymentMode=" + PaymentType + "&stdent.usn=" + stdents;
                if (PaymentType != 'Cash') {
                    var ddChequebank = Ext.getCmp('dd_cheque_bank').value;
                    var ddChequedate = Ext.getCmp('dd_cheque_date').rawValue.toString();
                    var ddChequeNo = Ext.getCmp('dd_cheque_no').value;
                    var ddChequeDetail = ddChequebank + "-" + ddChequedate + "-" + ddChequeNo;
                    srcs = srcs + "&ddChequeDetails=" + ddChequeDetail;
                }
                if (printExcess) {
                    srcs = srcs + "&printExcess=" + printExcess;
                }
                if (inst.challanWindow) {
//                    inst.challanWindow.destroy();
                }
                inst.processIframeRequest(srcs);
            }
        },
        challanExportPlugin: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
            var stdent = Ext.getCmp('student_usn').value;
            var PaymentType = Ext.getCmp('challan_Payment_Type').value;
            var NoOfSubjects = Ext.getCmp('No_Of_Subject').value;
            var src = "./fees/getChallan.action?actionType=printPlugin&paymentCycle.id=" + paymentCycleId + "&PaymentMode=" + PaymentType + "&stdent.usn=" + stdent + "&studentFeeInfo.item=" + NoOfSubjects;
            if (PaymentType != 'Cash') {
                var ddChequebank = Ext.getCmp('dd_cheque_bank').value;
                var ddChequedate = Ext.getCmp('dd_cheque_date').rawValue.toString();
                var ddChequeNo = Ext.getCmp('dd_cheque_no').value;
                var ddChequeDetails = ddChequebank + "-" + ddChequedate + "-" + ddChequeNo;
                src = src + "&ddChequeDetails=" + ddChequeDetails;
            }

            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = src;
            obj.responseHandler = "setChallanWindow";
            if (inst.winForm) {
                inst.winForm.destroy();
                inst.instWindow.destroy();
            }
            if (inst.challanWindow) {
                inst.challanWindow.destroy();
            }
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        exportFeesDetails: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var stdate = Ext.getCmp('report_date').rawValue;
            var etdate = Ext.getCmp('report_edate').rawValue;
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('report_branch').value;
            var src = "./fees/paymentDetails.action?actionType=exportFeesDetails&paymentCycle.id="
                    + paymentCycleId + "&branch.id=" + branch + "&sdate=" + stdate + "edate=" + etdate;
            inst.instWindow.destroy();
            inst.processIframeRequest(src);
        },
        exportChallanDetails: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            var src = null;
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            if(obj.params.type == "exportChallanReport"){
            var stdate = Ext.getCmp('report_sdate').rawValue;
            var etdate = Ext.getCmp('report_edate').rawValue;
            var challanType = Ext.getCmp('challanType').getValue();
            var paymentStatus = Ext.getCmp('challanPaymentState').getValue();
            src = "./fees/exportChallanReport.action?actionType=exportChallanDetails&sdate="+stdate+"&edate="+etdate+"&challanType="+challanType+"&paymentStatus="+paymentStatus;
            }else if(obj.params.type == "exportDueReport"){
                var dueReport = Ext.getCmp('dueReport').value;
                var reportType = Ext.getCmp('reportType').value;
                var pcName = Ext.getCmp('pcNameComboId').value;
                src = "./fees/exportChallanReport.action?actionType=dueReport&paymentCycle.academicYear=" + 
                        dueReport + "&reportType=" + reportType + "&paymentCycle.includeAllHeaders=" + Ext.getCmp('includeAllHeadersId').value + "&paymentCycle.includeAllDues=" + Ext.getCmp('includeAllDuesId').value+"&paymentCycle.includePenalty="+ Ext.getCmp('includeAllPenalty').value;
                if(pcName !== null) {
                    src = src+"&paymentCycle.pcName="+pcName;
                }
            }else if(obj.params.type == "exportInstallmentReport"){
                var dueReport = Ext.getCmp('dueReport').value;
                var reportType = Ext.getCmp('reportType').value;
            src = "./fees/exportChallanReport.action?actionType=exportInstallmentReport&paymentCycle.academicYear="+dueReport+"&reportType="+reportType;
            }
            inst.instWindow.destroy();
            inst.processIframeRequest(src);
        },
        removeFee: function (id, src) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            var rec = inst.feesGrid.grid.store.findRecord("id", id).data;
            var msg = "Do you want to remove <b style='color:green;'>" + rec.title + "</b> for the Cycle <b style='color:green;'>" + rec.academicYear + "</b> from the Student <b style='color:green;'>" + rec.student + "</b>"
            Ext.MessageBox.show({
                title: 'Info',
                msg: msg,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            obj.inst = inst;
                            obj.req = src;
                            obj.responseHandler = 'setFeesData';
                            obj.inst.getConfiguration(obj, {});
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        removeStudentPayment: function (id, src) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            var rec = inst.feesGrid.grid.store.findRecord("id", id);
            var msg = "Do you want to remove for the Student Paid Amount"
            Ext.MessageBox.show({
                title: 'Info',
                msg: msg,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            obj.inst = inst;
                            obj.req = src;
                            obj.responseHandler = 'setFeesWindowV1';
                            obj.inst.getConfiguration(obj, {});
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        printChallenNo: function (id) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            obj.inst = inst;
            obj.req = "./fees/getPayment.action?actionType=challenDetails&id=" + id;
            obj.responseHandler = 'setFeesWindow';
            obj.inst.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        printPDF: function (src) {
            Advaya.App.Parent.prototype.processIframeRequest(src);
        },
        computeFee: function (obj) {
            var tree = Ext.getCmp("fee-tree");
            var records = tree.getView().getChecked();
            obj.params.form = document.createElement("form");
            var jsonData = Advaya.Gms.Fees.handler.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            obj.params.form.appendChild(inputEle);
            if (obj.params.paymentCycle) {
                if(Ext.getCmp('paymentCycle_id') == undefined || Ext.getCmp('paymentCycle_id') == null || Ext.getCmp('paymentCycle_id').value == undefined || Ext.getCmp('paymentCycle_id').value == ""){
                    Advaya.Gms.Message.handler.show({
                        message: "Mandatory fields are left empty"
                    });
                    return;
                }
                var pc=Ext.getCmp('paymentCycle_id').value;
                inputEle = document.createElement("input");
                inputEle.name = 'paymentCycle.id';
                inputEle.value = pc;
                obj.params.form.appendChild(inputEle);
            }
            if (obj.params.studentjsonData) {
                inputEle = document.createElement("input");
                inputEle.name = 'studentjsonData';
                inputEle.value = obj.params.studentjsonData;
                obj.params.form.appendChild(inputEle);
            }

            Advaya.App.Parent.instance.getConfiguration(obj.params, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        directComputeFees:function(obj){
            var inst = Advaya.Gms.Fees.instance;
            var form  = null;
            if (inst.challanForm === undefined) {
                form = inst.winForm.getForm();
            } else {
                form = inst.challanForm.getForm();
            }
            obj.inst= inst;
            if(!form.isValid()){
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var studyingYear ;
            var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
            if( Ext.getCmp('studyingYear')){
                studyingYear = Ext.getCmp('studyingYear').value;
                obj.params.req = obj.params.req+"&studyingYear="+studyingYear
            }
            obj.req = obj.params.req+"&paymentCycle.id="+paymentCycleId+"";
            obj.responseHandler="setChallanWindow";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        directComputeFee:function(obj){
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            obj.inst= inst;
            if(obj.params.type && obj.params.type == 'deleted'){
                obj.req = obj.params.req;
                obj.responseHandler="alert";
                inst.challanWindow.destroy();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
                Advaya.App.Initiator.handler.showLoadMask();
            }else{
                if(!form.isValid()){
                    Advaya.Gms.Message.handler.show({
                        message: "Mandatory fields are left empty"
                    });
                    return;
                }
                if(inst.winGrid){
                    var records=inst.winGrid.grid.store.getRange()
                    var jsonData = inst.getGridDataAsJSON(records);
                
                    obj.req = obj.params.req+"&studentjsonData="+jsonData;
                    if(Ext.getCmp('jsonDataDate')){
                        var jsonDataDate = Ext.getCmp('jsonDataDate').value;
                        obj.req = obj.req+"&jsonData="+jsonDataDate;
                    }
                    obj.responseHandler="alert";
                    inst.challanWindow.destroy();
                }else{
                    var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
                    obj.inst= inst;
                    obj.req = obj.params.req+"&paymentCycle.id="+paymentCycleId;
                    obj.responseHandler="setChallanWindow";
                    Advaya.App.Parent.instance.getConfiguration(obj, {});
                    Advaya.App.Initiator.handler.showLoadMask();
                }
                
                Advaya.App.Parent.instance.getConfiguration(obj, {});
                Advaya.App.Initiator.handler.showLoadMask();
                if (inst.winGrid) {
                    if (inst.winGrid) {
                        inst.winGrid.destroy();
                    }
                }
            }
        },
        nextInstallment:function(obj){
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            if(!form.isValid()){
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var paymentCycleId = Ext.getCmp('paymentCycle_id').value;
            var totalField = Ext.getCmp("noOfInst").getValue();
            var installmentId = Ext.getCmp("installmentId")
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            for (cnt = 0; cnt < installmentId.items.items.length; cnt++) {
                var data = installmentId.items.items[cnt].getValues();
                jsonData += sep + Ext.JSON.encode(data)
                sep = ",";
            }
            jsonData += "]";
            obj.inst= inst;
            obj.req = obj.params.req+"&paymentCycle.id="+paymentCycleId+"&noOfInstallment="+totalField+"&jsonData="+jsonData;
            obj.responseHandler="setChallanWindow";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },

        
        changeQuotaCategory: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.challanForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            if (obj.params.type == 'updateFees') {
                obj.inst = inst;
                var tree = Ext.getCmp("fee-tree");
                var records = tree.getView().getChecked();
                obj.params.form = document.createElement("form");
                var jsonData = Advaya.Gms.Fees.handler.getGridDataAsJSON(records);
                var inputEle = document.createElement("input");
                inputEle.name = 'jsonData';
                inputEle.value = jsonData;
                obj.params.form.appendChild(inputEle);
                if (obj.params.studentjsonData) {
                    inputEle = document.createElement("input");
                    inputEle.name = 'studentjsonData';
                    inputEle.value = obj.params.studentjsonData;
                    obj.params.form.appendChild(inputEle);
                }
                Advaya.App.Parent.instance.getConfiguration(obj.params, {});
                Advaya.App.Initiator.handler.showLoadMask();
                inst.destroyWindow();
            } else {
                obj.inst = inst;
                var usn = Ext.getCmp('usn').value;
                var quota = Ext.getCmp('quota').value;
                var category = Ext.getCmp('category').value;
                var allotedCategory = Ext.getCmp('allotedCategory').value;
                var paymentCycle = Ext.getCmp('paymentCycle_id').value;
                var studyingYear = Ext.getCmp('studyingYear').value;
                obj.req = obj.params.req + "&student1.usn=" + usn + "&allotedCategory=" + allotedCategory + "&category=" + category + "&quota=" + quota + "&paymentCycle.id=" + paymentCycle + "&studyingYear=" + studyingYear;
                obj.responseHandler = "setChallanWindow";
                Advaya.App.Parent.instance.getConfiguration(obj, {});
                Advaya.App.Initiator.handler.showLoadMask();
            }

        },
        validateEndDate: function (field, newValue) {
            Ext.getCmp("cycleEndDate").setMinValue(field.value);
        },
        onBack: function (obj) {
            obj.inst = Advaya.Gms.Fees.instance;
            obj.inst.destroy();
            obj.inst.destroyContent();
            obj.req = './fees/list.action?';
            obj.responseHandler = 'setFeesData';
            obj.inst.getConfiguration(obj, {});
        },
        
        onBack1 : function( obj ) {
            Advaya.Gms.Fees.instance.destroy();
            Advaya.Gms.Fees.instance.destroyContent();
            obj.req = './course/course.action?actionType=list';
            obj.responseHandler = 'setFeesData';
            obj.inst = Advaya.Gms.Fees.instance;
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
            
        },
        
        onBackPrintChallan: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            obj.inst = inst;
            obj.req = obj.params.req;
            obj.responseHandler = "setChallanWindow";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        
        getPendingRequests: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            obj.inst = inst;
            obj.req = obj.params.req;
            obj.responseHandler = obj.params.responseHandler;
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        makeEditable: function () {
            var inst = Advaya.Gms.Fees.instance;
            var rowColumns = inst.winGrid.grid.columns;
            for (var i = 0; i < rowColumns.length; i++) {
                var editColumn = rowColumns[i];
                var field = editColumn.editField;
                editColumn.setEditor(field);
            }
        },
        loadVTU: function (obj1) {
            var obj = obj1.params;
            var courseId = parseFloat(obj.courseId);
            var form = Ext.getCmp(obj.formId);
            var checkBoxGroup = form.items.items;
            var objArray = new Array();
            for (var i = 0; i < checkBoxGroup.length; i++) {
                if (checkBoxGroup[i].value == true) {
                    objArray[i] = checkBoxGroup[i].inputValue;
                }
            }
            var src = obj.req + "&objArray=" + objArray + "&year=" + obj.year + "&course.id=" + courseId;
            var inst = Advaya.Gms.Fees.instance;
            obj = {};
            obj.inst = inst;
            obj.req = src;
            obj.responseHandler = "setFeesData";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        addRow: function (obj) {
            var inst = Fees.instance;
            var data = [
                {
                    id: '',
                    ruleVariable: '',
                    feeAmount: ''
                }
            ];
            inst.winGrid.grid.store.add(data);
            var i = inst.winGrid.grid.store.getTotalCount();
            inst.winGrid.grid.plugins[0].startEditByPosition({
                row: i,
                column: 1
            });

            inst.instWindow.setHeight(inst.instWindow.getHeight() + 20);
        },
        
        sendSelectedRecord: function (obj1) {
            var inst = Fees.instance;
            var obj = obj1.params;
            var records;
            if (obj.winform) {
                records = inst.winGrid.grid.getSelectionModel().getSelection();
            } else {
                records = inst.feesGrid.grid.getSelectionModel().getSelection();
            }
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            var jsonData = Advaya.Gms.Classes.handler.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            if (obj.form && inst.feesFilter) {
                obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.feesFilter.getForm());
                if (inst.feesFilter.getForm().isValid() == false) {
                    return;
                }
            }
            if (obj.winform && inst.winForm) {
                obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.winForm.getForm());
                if (inst.winForm.getForm().isValid() == false) {
                    return;
                }
            } else {
                obj.form = document.createElement("form");
            }
            obj.form.appendChild(inputEle);
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        
        selectGridRow: function(obj1){
            var inst = Fees.instance;
            var obj = obj1.params;
            var records;
            records = inst.winGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            var jsonData = Advaya.Gms.Classes.handler.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            obj.form = document.createElement("form");
            obj.form.appendChild(inputEle);
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        getFeesReportXLS: function (obj) {
            var inst = Fees.instance;
//            var gridData = Advaya.App.Grid.instance.grid.getStore().getRange();
            var gridData = inst.filterGrid.grid.getStore().data.items;
//            var gridData = Advaya.App.Grid.instance.filterGrid.getStore().data.items;
            if (gridData.length == 0) {
                var obj1 = {};
                obj1.title = "Info";
                obj1.message = "No Record Found";
                Advaya.Gms.Message.handler.show(obj1);
                return;
            }
            var cnt = 0;
            var jsonData = "[";
            var label = "id:";
            for (cnt = 0; cnt < gridData.length; cnt++) {
                if (cnt != 0) {
                    jsonData += ",";
                }
                var data = gridData[cnt].data;
                jsonData += "{";
                jsonData += label + Ext.JSON.encode(data.id)
                jsonData += "}";
            }
            jsonData += "]";
            Advaya.App.Initiator.handler.showLoadMask();
            var src = obj.params.req + "&jsonData=" + jsonData;
            Advaya.App.Parent.prototype.processIframeRequest(src);
        },
        getSubsidyReportXLS: function (obj) {
            var src = obj.params.req;
            Advaya.App.Parent.prototype.processIframeRequest(src);
        },
        getGridDataAsJSON: function (records) {
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            for (cnt = 0; cnt < records.length; cnt++) {
                var data = records[cnt].data;
                jsonData += sep + Ext.JSON.encode(data)
                sep = ",";
            }
            jsonData += "]";
            return jsonData;
        },
        processFormResponse: function (form, response) {
            Advaya.App.Initiator.handler.hideLoadMask();
            var responseText = response.response.responseText;
            var responseHandler = response.scope.responseHandler;
            var inst = Fees.instance;
            var obj = response.scope;
            Advaya.App.Parent.handler.processResponse(responseText, inst, responseHandler, obj);
        },
        submit: function (obj) {
            var inst = Fees.instance;
            var dueReport = null;
            var form = inst[obj.params.submitForm];
            var url = obj.params.url;
            if (Ext.getCmp('dueReport')) {
                dueReport = Ext.getCmp('dueReport').value;
                url = url + dueReport;
                Advaya.Gms.Fees.handler.alert("The validation runs background as it takes time report will be sent to your mail")
            }
            if (form.getForm().isValid()) {
                form.getForm().submit({
                    url: url,
                    success: Fees.handler.processFormResponse,
                    failure: Fees.handler.processFormResponse,
                    scope: obj.params
                });
                Advaya.App.Initiator.handler.showLoadMask();
                if (inst.winForm) {
                    inst.instWindow.hide();
                }
               // Advaya.App.Initiator.handler.hideLoadMask();
            }
        },
        
        exportFeesExcel: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var form = inst.winForm.getForm();
            if (!form.isValid()) {
                Advaya.Gms.Message.handler.show({
                    message: "Mandatory fields are left empty"
                });
                return;
            }
            var course = Ext.getCmp('byCourse').value;
            var academicYear = Ext.getCmp('byAcademicYear').value;
            var studyingYear = Ext.getCmp('byStudyear').value;
            var src = "./fees/feesExports.action?fltr.course=" + course + "&fltr.academicYear=" + academicYear + "&fltr.studyYear=" + studyingYear ;
            inst.instWindow.destroy();
            inst.processIframeRequest(src);
        }, 
        
        formSubmit: function(obj) {
            var inst = Fees.instance;
            var form = inst[obj.params.submitForm];
            var url = obj.params.req;
            if (form.getForm().isValid()) {
                form.getForm().submit({
                    url: url,
                    success: Fees.handler.processFormResponse,
                    failure: Fees.handler.processFormResponse,
                    scope: obj.params
                });
            }
            Advaya.App.Initiator.handler.showLoadMask();
        },
        
        excelSubmit: function(obj) {
            var inst = Fees.instance;
            var form = inst[obj.params.submitForm];
            var url = obj.params.url;
            if (form.getForm().isValid()) {
                Advaya.App.Initiator.handler.showLoadMask();
                form.getForm().submit({
                    url: url,
                    success: Fees.handler.processFormResponse,
                    failure: Fees.handler.processFormResponse,
                    scope: obj.params
                });
                  inst.processIframeRequest(url);
            }else{
                var obj2 = {};
                obj2.title = "Info";
                obj2.message = "Marked fields needs to be filled to proceed";
                Advaya.Gms.Message.handler.show(obj2);
            }
        },
        
         formSubmit2:function(obj){
            var inst = Advaya.Gms.Fees.instance;
            var requiredForm =inst[obj.params.submitForm];
            var form=requiredForm.getForm();
            if(form.isValid()){
                Advaya.App.Initiator.handler.showLoadMask();
                var formValues = Advaya.App.Parent.handler.aggregateFormFields(form);
                obj.params.form=formValues;
                Advaya.App.Parent.instance.getConfiguration(obj.params,{});
            }else{
                var obj2 = {};
                obj2.title = "Info";
                obj2.message = "Marked fields needs to be filled to proceed";
                Advaya.Gms.Message.handler.show(obj2);
            }
        },
        
         formSubmit3:function(obj){
            var inst = Advaya.Gms.Fees.instance;
            var requiredForm =inst[obj.params.submitForm];
            var form=requiredForm.getForm();
            if(form.isValid()){
                Advaya.App.Initiator.handler.showLoadMask();
                form.submit({
                    url: obj.params.req,
                    success: Fees.handler.processFormResponse,
                    failure: Fees.handler.processFormResponse,
                    scope: obj.params
                });
            }else{
                var obj2 = {};
                obj2.title = "Info";
                obj2.message = "Marked fields needs to be filled to proceed";
                Advaya.Gms.Message.handler.show(obj2);
            }
        },
        
        
         formSubmit1: function(obj) {
            var inst = Fees.instance;
            var form = inst[obj.params.submitForm];
            var url = obj.params.req;
            if (form.getForm().isValid()) {
                form.getForm().submit({
                    url: url,
                    success: Fees.handler.processFormResponse,
                    failure: Fees.handler.processFormResponse,
                    scope: obj.params
                });
                Advaya.App.Initiator.handler.showLoadMask();
                if(obj.params.showMessage){
                    inst.instWindow.hide();
                    Advaya.App.Initiator.handler.hideLoadMask();
                    Advaya.Gms.Fees.handler.alert(obj.params.message);
                }
            }
        },
        formSubmitWithIframe:function(obj){
            var inst = Fees.instance;
            var form = inst[obj.params.submitForm];
            if (form.getForm().isValid()) {
                var formFieldsLenght=form.getForm()._fields.items.length;
                var req=null;
                req=obj.params.req;
                for(var i=0;i<formFieldsLenght;i++){
                    var item=form.getForm()._fields.items[i];
                    var parameter=item.name;
                    var value=item.rawValue;
                    req=req+"&"+parameter+"="+value;
                }
                inst.processIframeRequest(req);
            }
        },
        
        dataSubmit: function (obj1) {
            var inst = Fees.instance;
            var id = null;
            var fees = null;
            var ps = null;
            if (Ext.getCmp('subsidyRule')) {
                id = Ext.getCmp('subsidyRule').getValue().objArray;
            }
            if (Ext.getCmp('fees')) {
                fees = Ext.getCmp('fees').getValue();
            }
            if (Ext.getCmp('paymentScheduler')) {
                ps = Ext.getCmp('paymentScheduler').getValue();
            }
            var obj = obj1.params.req;
            var src = obj
            obj = {};
            obj.inst = inst;
            obj.req = src + "&id=" + id + "&fee.id=" + fees + "&scheduler.id=" + ps;
            obj.responseHandler = obj1.params.responseHandler
            inst.instWindow.destroy();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        getReportDetails: function (action, handler, req) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Fees.instance;
            var obj = {
                inst: Advaya.Gms.Fees.instance,
                responseHandler: handler,
                req: req
            };
            inst.parent.getConfiguration(obj, {});
        },
        alert: function (msg) {
            Ext.MessageBox.show({
                title: 'Alert!',
                msg: msg,
                buttons: Ext.MessageBox.OK
            });
        },
        getFeeReport: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            Ext.getCmp('feesFilterPanel').show();
            Ext.get("feesFilterPanel").slideIn('t', {
                easing: 'easeOut',
                duration: 500
            });
            var inst = Fees.instance;
            var req = "";
            if (obj.params.type === "getFilter") {
                inst.parent.getConfiguration(obj.params, {});
            } else if (obj.params.type === "filter") {
                var branch = Ext.getCmp('feesBranch');
                var feesType = Ext.getCmp('feesType');
                var feeId = Ext.getCmp('feeDesc');
                if (!branch.getValue() || !branch.getValue().branch) {
                    Advaya.Gms.Fees.handler.alert("Choose Branch to get details");
                    Advaya.App.Initiator.handler.hideLoadMask();
                    return;
                }
                if (branch.getValue().branch instanceof Array) {
                    for (var i = 0; i < branch.getValue().branch.length; i++) {
                        req = req + "&feesFilter.branch=" + branch.getValue().branch[i];
                    }
                } else {
                    req = req + "&feesFilter.branch=" + branch.getValue().branch
                }
                if (feeId.getValue()) {
                    req = req + "&fee.id=" + feeId.getValue()
                }
                if (feesType.getValue() && feesType.getValue().feesType) {
                    if (feesType.getValue().feesType instanceof Array) {
                        for (var i = 0; i < branch.getValue().branch.length; i++) {
                            req = req + "&feesFilter.feesType=" + feesType.getValue().feesType[i];
                        }
                    } else {
                        req = req + "&feesFilter.feesType=" + feesType.getValue().feesType
                    }
                }
                obj.params.req = obj.params.req + req
                inst.parent.getConfiguration(obj.params, {});
            }
            obj = null;
        },
        closeFeesReport: function () {
            Ext.get("feesFilterPanel").slideOut('t', {
                easing: 'easeIn',
                duration: 500,
                remove: false,
                useDisplay: false,
                callback: function () {
                    var field = Ext.getCmp('feesFilter');
                    field.removeAll();
                }
            });
        },
        onExpand: function (obj) {
            var clickedFldSet = Ext.getCmp(obj.params.id);
            var ownerCt = clickedFldSet.ownerCt.items.items;
            for (var i = 0; i < ownerCt.length; i++) {
                if (ownerCt[i].xtype != 'fieldset') {
                    continue;
                }
                if (clickedFldSet.id != ownerCt[i].id) {
                    ownerCt[i].setExpanded(false);
                }
                ownerCt[i].removeCls('feeExpandedFldSet');
                ownerCt[i].addCls('feeCollapsedFldSet');
            }
            if (!clickedFldSet.collapsed) {
                clickedFldSet.removeCls('feeCollapsedFldSet');
                clickedFldSet.addCls('feeExpandedFldSet');
            }
            var obj1 = obj;
        },
        onExpandInner: function (obj) {
            var clickedFldSet = Ext.getCmp(obj.params.id);
            var ownerCt = clickedFldSet.ownerCt.items.items;
            for (var i = 0; i < ownerCt.length; i++) {
                if (ownerCt[i].xtype != 'fieldset') {
                    continue;
                }
                if (clickedFldSet.id != ownerCt[i].id) {
                    ownerCt[i].setExpanded(false);
                }
                ownerCt[i].removeCls('.feeExpandedInnerFldSet');
                ownerCt[i].addCls('feeCollapsedInnerFldSet');
            }
            if (!clickedFldSet.collapsed) {
                clickedFldSet.removeCls('feeCollapsedInnerFldSet');
                clickedFldSet.addCls('.feeExpandedInnerFldSet');
            }
            var obj1 = obj;
        },
        closeCycle: function () {
            var inst = Fees.instance;
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            if (records[0].data.currentState == "Closed") {
                Advaya.Gms.Fees.handler.alert("Payment Cycle is already closed.");
                return;
            }
            var msg = "Do you want to close <b style='color:green;'>" + records[0].data.course + "</b> [ <b style='color:green;'>" + records[0].data.academicYear + "</b> ] Cycle for  <b style='color:green;'>" + records[0].data.academicYear + "</b>"
            Ext.MessageBox.show({
                title: 'Info',
                msg: msg,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            var obj = {};
                            obj.inst = inst;
                            obj.req = "./fees/closeCycle.action?paymentCycle.id=" + records[0].data.id;
                            obj.responseHandler = "setFeesData";
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            Advaya.App.Initiator.handler.showLoadMask();
                        case 'no':
                            break;
                    }
                }
            });
        },
        paymentCalendar: function (obj) {
            var inst = Fees.instance;
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            if (records[0].data.currentState == "Computed") {
                Advaya.Gms.Fees.handler.alert("Payment Calendar is already Computed.");
                return;
            }
            inst.parent.getConfiguration(obj.params, {});
        },
        applicableScholarship: function (obj) {
            var inst = Fees.instance;
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            inst.parent.getConfiguration(obj.params, {});
        },
        shedulePaymentCalendarAgain: function (obj) {
            var inst = Fees.instance;
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            if (records[0].data.currentState == "Created") {
                Advaya.Gms.Fees.handler.alert("Payment Calendar is already initiated.");
                return;
            }
            if (records[0].data.currentState == "Scheduled" && obj.params.stateCheck != 'removeFees') {
                Advaya.Gms.Fees.handler.alert("Payment Calendar is already Scheduled.");
                return;
            }
            if (records[0].data.currentState == "Computed") {
                var gridData = inst.feesGrid.grid.getStore().data.items;
                for (var i = 0; i < gridData.length; i++) {
                    var rowData = gridData[i].data;
                    if (rowData.currentState == "Created" &&
                            rowData.description == records[0].data.description &&
                            rowData.periodicity == records[0].data.periodicity &&
                            rowData.amount == records[0].data.amount &&
                            rowData.title == records[0].data.title) {
                        Advaya.Gms.Fees.handler.alert("Payment Calendar is already Created.");
                        return;
                    }
                }
            }
            if (obj.params != null && obj.params.stateCheck == 'removeFees') {
                var msg = "Do you want to Remove it permanently"
            } else {
                var msg = "Do you want to shedule it again"
            }

            Ext.MessageBox.show({
                title: 'Info',
                msg: msg,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            inst.parent.getConfiguration(obj.params, {});
                        case 'no':
                            break;
                    }
                }
            });
        },
        currencyRenderer: function (amount, symbol, format) {
            var val = Ext.util.Format.number(amount, format)
            return symbol + val;
        },
        
        summerRenderOfFees: function(records){
            var total=0;
            var length=records.length;
            for (var i=0; i < length; ++i) {
                var   record = records[i];
                var status=record.get('currentState');
                if(status=='Active'){
                    total += record.get('payableAmount');
                }
            }
            return total;
        },
        
        
        summeryRenderOfPaid:function(records){
             var total=0;
            var length=records.length;
            for (var i=0; i < length; ++i) {
                var   record = records[i];
                var status=record.get('currentState');
                if(status=='Active'){
                    total += record.get('paymentAmount');
                }
            }
            return total;
        },
        
        summeryRenderOfPenalty:function(records){
            var total=0;
            var length=records.length;
            for (var i=0; i < length; ++i) {
                var   record = records[i];
                var status=record.get('currentState');
                if(status=='Active'){
                    total += record.get('totalPenalty');
                }
            }
            return total;
        },
        
        summeryRenderOfWaveOff:function(records){
             var total=0;
            var length=records.length;
            for (var i=0; i < length; ++i) {
                var   record = records[i];
                var status=record.get('currentState');
                if(status=='Active'){
                    total += record.get('waveOffAmount');
                }
            }
            return total;
        },
        
        summeryRenderOfRefund:function(records){
             var total=0;
            var length=records.length;
            for (var i=0; i < length; ++i) {
                var   record = records[i];
                var status=record.get('currentState');
                if(status=='Active'){
                    total += record.get('refundAmount');
                }
            }
            return total;
        },
        summeryRenderOfDue:function(records){
            var total=0;
            var length=records.length;
            for (var i=0; i < length; ++i) {
                var   record = records[i];
                var status=record.get('currentState');
                if(status=='Active'){
                    total += record.get('dueAmount');
                }
            }
            return total;
        },
        
        summeryRenderOfPa:function(records){
            var length=records.length;
            var total=0;
            var   record;
            for (var i=0; i < records.length; ++i) {
               record = records[i];
                var status=record.get('currentState');
                if(status=='Active' && record.get('paymentAmount')){
                    total += record.get('paymentAmount');
//                    continue;
//                    return;
                }
                if(status == 'Active' && record.get('payableAmount')){
                    total += record.get('payableAmount');
//                    continue;
                }
                if(status == 'Active' && record.get('totalPenalty')){
                    total += record.get('totalPenalty');
//                    continue;
                }
                if(status === 'Active' && record.get('waveOffAmount')){
                    total += record.get('waveOffAmount');
//                    continue;
                }
                if(status == 'Active' && record.get('refundAmount')){
                    total += record.get('refundAmount');
//                    continue;
                }
                if(status == 'Active' && record.get('dueAmount')){
                    total += record.get('dueAmount');
//                    continue;
                }
            }
           return total;
        },
        
        
        currencyFormater: function (amount, format) {
            var val = Ext.util.Format.number(amount, format)
            return val;
        },
        indianCurrency:function(val, symbol){
            var value;
            if(symbol){
                value=symbol+  parseInt(val).toLocaleString('en-In');
            }else{
                value=parseInt(val).toLocaleString('en-In');
            }
            return value;
        },
        indianCurrencyFloat:function(val, symbol){
            var value;
            if(symbol){
                value=symbol+  parseInt(val).toLocaleString('en-In');
            }else{
                value=parseFloat(val).toLocaleString('en-In');
            }
            return value;
        },
        print: function (amnt, fee) {

            console.log("fees  " + fee);
            console.log("total =" + amnt);
        },
        importFees: function (obj) {
            var inst = Fees.instance;
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            if (records[0].data.currentState != "Active") {
                Advaya.Gms.Fees.handler.alert("Payment Cycle is not Active to Import.");
                return;
            }
            inst.parent.getConfiguration(obj.params, {});
        },
        challanNoReports: function (obj) {
            var inst = Fees.instance;
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            inst.parent.getConfiguration(obj.params, {});
        },
        popUpWindow: function (obj1, handler, url, firstClick) {
            obj1.onclick = function (e) {
                topValue = e.clientX + 10;
                leftValue = e.clientY + 30;
                Advaya.Gms.Fees.handler.setPopUpWindow(this, e, handler, url);
            }
            if (firstClick) {
                firstClick = false;
                Advaya.Gms.Fees.handler.setPopUpWindow(this, null, handler, url);
            }
        },
        setPopUpWindow: function (obj1, e, handler, url) {
            var inst = Advaya.Gms.Fees.instance;
            var obj = {};
            obj.req = url;
            obj.responseHandler = handler;
            obj.inst = inst;
            Advaya.App.Parent.instance.getConfiguration(obj, {});
//            document.body.onclick= Advaya.Gms.Fees.handler.hidePopUpWindow;
            if (e)
                e.stopPropagation();
            Advaya.App.Initiator.handler.showLoadMask();
        },
        hidePopUpWindow: function (obj) {
            var div = document.getElementById("FeeDetails");
            if (div != null) {
                div.parentNode.removeChild(div)
                if (div.style.display == "block" || div.style.display == "") {
                    div.style.display = "none";
                }
            }
        },
        togglePopUpWindow: function (obj) {
            var src = ($("#theImg").attr('src') === './img/black_up.png')
                    ? './img/black_down.png'
                    : './img/black_up.png';
            $("#theImg").attr('src', src);
            $('#FeeDetailsBody').slideToggle("slow");
        },
        divEventHandler: function (e) {
            e.stopPropagation();
        },
        feePlugin: function (field, newValue, oldValue, eOpts) {
            var feePlugin = Ext.getCmp("feePlugin");
            if (newValue) {
                feePlugin.show();
            } else {
                feePlugin.hide();
//                feePlugin.setValue('');
            }
        },
        onSpecialKey: function (obj, e, eOpts) {
            var gridPanel = Fees.instance.feesGrid.grid;
            var store = gridPanel.store;
            var selModel = gridPanel.getSelectionModel();
            var selectedRecord = selModel.getLastSelected();
            var recordIndex = store.indexOf(selectedRecord);
            var columns = gridPanel.columns;
            if (e.getKey() == e.ENTER && store.data.items.length != recordIndex + 1) {
                var nextRecord = store.getAt(recordIndex + 1);
                selModel.select(nextRecord);
                if (gridPanel.getPlugin().context.colIdx == gridPanel.columns.length - 1) {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].field || columns[i].editor) {
                            gridPanel.getPlugin().startEditByPosition({
                                row: recordIndex + 1,
                                column: i
                            });
                            break;
                        }
                    }
                } else {
                    gridPanel.getPlugin().startEditByPosition({
                        row: recordIndex + 1,
                        column: gridPanel.getPlugin().context.colIdx
                    });
                }
            }
            if (e.getKey() == 38) { //for Keyup

                var previousRecord = store.getAt(recordIndex - 1);
                selModel.select(previousRecord);
                gridPanel.getPlugin().startEditByPosition({
                    row: recordIndex - 1,
                    column: gridPanel.getPlugin().context.colIdx
                });
            }
            if (e.getKey() == 39) { //for forward column
                if (gridPanel.getPlugin().context.colIdx == gridPanel.columns.length - 1) {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].field || columns[i].editor) {
                            gridPanel.getPlugin().startEditByPosition({
                                row: recordIndex + 1,
                                column: i
                            });
                            break;
                        }
                    }
                } else {
                    gridPanel.getPlugin().startEditByPosition({
                        row: recordIndex,
                        column: gridPanel.getPlugin().context.colIdx + 1
                    });
                }
            }
            if (e.getKey() == 9) { //for tab
                if (gridPanel.getPlugin().context.colIdx == gridPanel.columns.length - 1) {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].field || columns[i].editor) {
                            gridPanel.getPlugin().startEditByPosition({
                                row: recordIndex + 1,
                                column: i
                            });
                            break;
                        }
                    }
                } else {
                    gridPanel.getPlugin().startEditByPosition({
                        row: recordIndex,
                        column: gridPanel.getPlugin().context.colIdx
                    });
                }
            }
            if (e.getKey() == 37) { //for backward column

                gridPanel.getPlugin().startEditByPosition({
                    row: recordIndex,
                    column: gridPanel.getPlugin().context.colIdx - 1
                });
            }
        },
        refundFees: function (obj) {
            var inst = Fees.instance;
            Advaya.App.Initiator.handler.showLoadMask();
            var approver = Ext.getCmp("requestedStaff").getValue();
            var records = inst.feesGrid.grid.store.getRange();
            var jsonData = inst.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            var form = document.createElement("form");
            form.appendChild(inputEle)
            obj.form = form;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = obj.params.req;
            if (approver) {
                obj.req = obj.req + "&sr.approver.id=" + approver;
            } else {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Select Approver",
                    buttons: Ext.MessageBox.OK
                });
                Advaya.App.Initiator.handler.hideLoadMask();
                return;
            }
            obj.responseHandler = obj.params.responseHandler;
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        displayAllChallans: function (obj) {
            var inst = Fees.instance;
            var type = obj.params.type;
            var records = null;
            Advaya.App.Initiator.handler.showLoadMask();
            if (type) {
                records = inst.reqTable.grid.store.getRange();
            } else {
                records = inst.feeGrid.grid.getSelectionModel().getSelection();
            }
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            var jsonData = inst.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            if (type == 'submit') {
                if (jsonData) {
                    var jsonObj = JSON.parse(jsonData);
                    for (var i = 0; i < jsonObj.length; i++) {
                        var jObj = jsonObj[i];
                        if (jObj.comment == "") {
                            Ext.MessageBox.show({
                                title: 'Alert!',
                                msg: "Comment has to be entered",
                                buttons: Ext.MessageBox.OK
                            });
                            Advaya.App.Initiator.handler.hideLoadMask();
                            return;
                        }
                    }
                    jsonData = JSON.stringify(jsonObj);
                }
            }
            var form = document.createElement("form");
            form.appendChild(inputEle)
            obj.inst = inst;
            obj.form = form;
            obj.req = obj.params.req;
            obj.responseHandler = obj.params.responseHandler;
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        closeWindow: function (obj) {
            var inst = Fees.instance;
            if (inst.reqWindow) {
                inst.reqWindow.destroy();
            }
            if (inst.reqPanel) {
                inst.reqPanel.destroy();
            }
            if (obj.params) {
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = obj.params.req;
                obj.responseHandler = obj.params.responseHandler;
                obj.action = obj.params.action;
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
        },
        sendReq: function (obj) {
            var obj1 = {};
            obj1.req = obj.params.req;
            obj1.responseHandler = obj.params.responseHandler;
            obj1.inst = obj.params.inst;
            obj1.action = obj.params.action;
            Advaya.App.Parent.instance.getConfiguration(obj1, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        onChange: function (field, newVal, odlVal, obj) {
            var inst = Fees.instance;
            var totalField = Ext.getCmp("totalField");
            var selection = "";
            var items = "";
            if (field.id && field.id == "challanPayment") {
                selection = inst.feesGrid.grid.getSelectionModel().getSelection()[0];
                items = inst.feesGrid.store.data.items;
            } else {
                selection = inst.winGrid.grid.getSelectionModel().getSelection()[0];
                items = inst.winGrid.store.data.items;
            }
            var totalAmount = 0;
            for (var i = 0; i < items.length; i++) {
                var id = items[i].data.id;
                var selectionId = selection.data.id;
                var amount = items[i].data.amount;
                if (id == selectionId) {
                    continue;
                }
                var amnt = parseFloat(amount);
                if (amnt) {
                    totalAmount = totalAmount + amnt;
                }
            }
            var changedAmount = parseFloat(field.value);
            if (changedAmount) {
                totalAmount = totalAmount + changedAmount;
            }
            totalField.setValue(totalAmount);
        },
        
        onChangeValue: function (field, newVal, odlVal, obj) {
            var inst = Fees.instance;
            var totalField = Ext.getCmp("totalField");
            var feeRuleList = Ext.getCmp("feeRuleList");
            var selection = "";
            var items = "";
            var totalAmount = 0;
            for(var i=0;i< feeRuleList.items.length;i++){
                //                var id = items[i].data.id;
                for(var j=0;j< feeRuleList.items.items[i].items.length;j++){
                    var amount = feeRuleList.items.items[i].items.items[j].value
                    var amnt = parseFloat(amount);
                    if (amnt) {
                        totalAmount = totalAmount + amnt;
                    }
                }
                
            }
            totalField.setValue(totalAmount);
        },
        
        exportFees: function (obj) {
            if (obj.params.iframe) {
                var inst = obj.params.inst;
                var prntId = Advaya.App.Parent.instance.prnt_reqParams;
                if (prntId != null) {
                    var req = obj.params.req + prntId.id;
                    inst.processIframeRequest(req);
                } else {
                    inst.showErrorMessage();
                }
            }
        },
        
        exportStudentFees: function(obj){
            if(obj.params.iframe){
                var inst = obj.params.inst;
                var req = obj.params.req ;
                inst.processIframeRequest(req);
            }
        },
        
        gridExport : function(src){
            var inst = Advaya.Gms.Fees.instance;
            inst.processIframeRequest( src );
        },
        
        addDateFeild : function(obj){
            var inst = Fees.instance;
            var totalField = Ext.getCmp("noOfInst").getValue();
            var installmentId = Ext.getCmp("installmentId");
            if(totalField > 0){
                installmentId.removeAll();
                var formContent = {
                    layout : 'anchor',
                    id:'',
                    items : [
                                {
                                    xtype:'datefield',
                                    anchor:'100%',
                                    format: 'd/m/Y',
                                    name:'fltr.to',
                                    id:'dueDate',
                                    fieldLabel:'Due Date'
                                }
                            ]
                }
                for(var i=0;totalField>i;i++){
                    formContent.id="date_"+(i+1);
                  //  formContent.items[0].fieldLabel=formContent.items[0].fieldLabel+"-"+i;
                    formContent.items[0].id=formContent.items[0].id+"_"+i;
                    inst.addStudentForm = new Ext.form.Panel(formContent);
                    installmentId.add(inst.addStudentForm);
                }
            }else{
                installmentId.removeAll();
            }
        },
        academicYearChange: function (combo, records, eOpts) {
            var inst = eOpts.params.inst;
            var obj = {};
            obj = {};
            obj.inst = inst;
            obj.req = eOpts.params.req+"&paymentCycle.academicYear="+combo.lastValue;
            obj.responseHandler = eOpts.params.responseHandler;
            inst.instWindow.destroy();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
         filterGrid : function(field,newVal,odlVal,obj) {
            var inst =obj.params.inst;
            var grid = inst[obj.params.grid];
            grid.grid.getStore().clearFilter();
            grid.grid.getStore().filter([{
                property:obj.params.property,
                value:newVal,
                anyMatch:true,
                caseSensitive:false
            }]);
        },
        numberRenderWithHyperLink:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrency(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/exportChallanReportDisplay.action?paymentCycle.academicYear='+record.data.academicYear +'&reportType='+reportType+'","true")>'+val+'</a>';
        },

        getBranchDistinctAcademicLink:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getStudentBranchByAcademicYear.action?branchCode='+record.data.branch+'&studyingYear='+record.data.studyingYear+'&reportType='+reportType+'","true")>'+val+'</a>';
        },
        
        getStudentFeeDetailsByBranchAndAcademicYear:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrency(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getStudentFeeDetailsByAcademicYear.action?branchCode='+record.data.branch+'&branchYear='+record.data.academicYear+'&studyingYear='+record.data.studyingYear+'&reportType='+reportType+'","true")>'+val+'</a>';
        },

        getBranchesByCourse:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllBranchesByCourse.action?actionType=none&branchCode='+record.data.branch+'&studyingYear='+record.data.studyingYear+'&reportType='+reportType+'","true")>'+value+'</a>';
        },
        
        getFeeBySY:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllfeesByStudyingYear.action?studyingYear='+record.data.studyingYear+'&id='+record.data.branchId+'","true")>'+val+'</a>';
        },
        
        getFeeByBRForStudents:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllStudentFeesByBranch.action?id='+record.data.branchId+'","true")>'+val+'</a>';
        },
        
        getFeeByBRAndSyForStudents:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllStudentFeesBySYAndBy.action?id='+record.data.branchId+'&studyingYear='+record.data.studyingYear+'","true")>'+val+'</a>';
        },
        
        getFeeAndAcademicYearLink:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getFeeByFeeAndAcademicYear.action?fee.id='+record.data.feeId+'&academicYear='+record.data.paymentCycle+'&reportType='+reportType+'","true")>'+val+'</a>';
        },
        
        getFeesByStudentsLink:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getFeeReportsByStudents.action?fee.id='+record.data.feeId+'&academicYear='+record.data.academicYear+'&branch.id='+record.data.branchId+'&reportType='+reportType+'","true")>'+val+'</a>';
        },
        
        getStudentFeesByAcademicYear:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrency(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllStudentFeesByAcademicyear.action?paymentCycle.academicYear='+record.data.academicYear +'&reportType='+reportType+'","true")>'+val+'</a>';
        },
    
         gridCheckBoxSelectAndDeSelect2:function(obj,index){
            var  inst=Advaya.Gms.Fees.instance;
            inst.selected[index]=obj.checked;
        },
        
        getAllFeesByBranchAcademic:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrencyFloat(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllBrStudentByFeesAY.action?branchCode='+record.data.branch+'&studyingYear='+record.data.studyingYear+'&reportType='+reportType+'","true")>'+val+'</a>';
        },
        
        getAllStudentFeeDetailsByBranchAndAcademicYear:function(value, metaData, record, rowIdx, colIdx, store,reportType,symbol){
            var val=Advaya.Gms.Fees.handler.indianCurrency(value,symbol);
            return '<a style="cursor:pointer;" onClick=Advaya.Gms.Fees.handler.popUpWindow(this,"setFeesData","./fees/getAllStudentByFeesAndAY.action?branchCode='+record.data.branch+'&branchYear='+record.data.academicYear+'&studyingYear='+record.data.studyingYear+'&reportType='+reportType+'","true")>'+val+'</a>';
        },
        
        gridSelectAll:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var requiredGrid=inst[obj.params.gridName].grid    
            var gridStore=requiredGrid.store;
            gridStore.each(function(record,idx){
                if(obj.params.updateCell){
                    var  val = record.get(obj.params.getCellName);
                    if(obj.checked){
                        record.set(obj.params.updateCellName,val);
                    }else{
                        record.set(obj.params.updateCellName,"");
                    }
                }
                var id=record.get('id');
                var checkBox=document.getElementById("id_"+id);
                if(obj.checked){
                    if(!checkBox.checked){
                        checkBox.checked=true;
                        checkBox.disabled=true;
                        checkBox.onchange();
                    }
                }
                else{
                    checkBox.checked=false;
                    checkBox.disabled=false;
                    checkBox.onchange();
                }
            });
        },
        submitGridAndForm:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var form =null;
            var records=null;    
            form= inst[obj.params.submitForm];
            
            if(!form.getForm().isValid() ){
                Advaya.Gms.Fees.handler.showFieldsRequiredError();
                return;
            }
            records=Advaya.Gms.Fees.handler.validateGridRecords(obj.params);
            if(records ==null || records.length==0){
                Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
            }
            var jsonData = inst.getGridDataAsJSON(records);
            var formValues = Advaya.App.Parent.handler.aggregateFormFields(form.getForm());
            var inputEle = document.createElement("input");
            inputEle.name = obj.params.parameterName;
            inputEle.value = jsonData;
            formValues.appendChild(inputEle);
            obj.params.form=formValues;
            Advaya.App.Initiator.handler.showLoadMask();    
            Advaya.App.Parent.instance.getConfiguration(obj.params,{});
        },
        
        validateGridRecords:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var indexs=inst.selected;
            var grid=null;
            grid=inst[obj.grid].grid;
            var validateGrid=false;
            var validateField;
            var isError=false;
            if(obj.validateGrid){
                validateGrid=true;
                validateField=obj.validateField
            }
            var checkedRecords=[];
            var gridStore=grid.store;
            gridStore.each(function(record,idx){
                var value=indexs[idx];
                if(value){
                    if(validateGrid){
                        var validateValue= record.get(validateField);  
                        if(validateValue==undefined || validateValue==''){
                            isError=true;    
                            //                            Advaya.Gms.Fees.handler.showFieldsRequiredError()
                            return false;
                        }
                    } 
                    checkedRecords.push(record);   
                }
            });   
            if(isError){
                return null
            }else{
                return checkedRecords;
            }
        },
        submitGridAndForm1:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var form =null;
            var records=null;
            form= inst[obj.params.submitForm];
            if(!form.getForm().isValid() ){
                Advaya.Gms.Fees.handler.showFieldsRequiredError();
                return;
            }
            records=Advaya.Gms.Fees.handler.validateGridRecords1(obj.params);
            if(records ==null || records.length==0){
                Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
            }
            var jsonData = inst.getGridDataAsJSON(records);
            var formValues = Advaya.App.Parent.handler.aggregateFormFields(form.getForm());
            var inputEle = document.createElement("input");
            inputEle.name = obj.params.parameterName;
            inputEle.value = jsonData;
            formValues.appendChild(inputEle);
            obj.params.form=formValues;
            Advaya.App.Initiator.handler.showLoadMask();    
            Advaya.App.Parent.instance.getConfiguration(obj.params,{});
        },
        
         validateGridRecords1:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var grid=null;
            grid=inst[obj.grid].grid;
            var validateAllRecords=false;
            var validateField=[];
            var isError=false;
            validateField=obj.validateField.split(",")
            if(obj.validateAllRecords){
                validateAllRecords=true;
            }
            var checkedRecords=[];
            var gridStore=grid.store;
            gridStore.each(function(record,idx){
                for(var i=0;i<validateField.length;i++){
                    var validateValue= record.get(validateField[i]); 
                    if(validateValue==undefined || validateValue==''){
                        isError=true;    
                        return false;
                    }
                }
                checkedRecords.push(record);   
            });
            if(validateAllRecords){
                var updateRecordCount=checkedRecords.length;
                var gridRecordsSize=gridStore.getTotalCount();
                if(updateRecordCount!=gridRecordsSize){
                    return null;
                }
            }
            if(isError){
                return null
            }else{
                return checkedRecords;
            }
        },
        
        submitGridAndForm2:function(obj){
             var  inst=Advaya.Gms.Fees.instance;
            var form =null;
            var records=null;    
            form= inst[obj.params.submitForm];
            
            if(!form.getForm().isValid() ){
                Advaya.Gms.Fees.handler.showFieldsRequiredError();
                return;
            }
            records=Advaya.Gms.Fees.handler.validateGridRecords2(obj.params);
            if(records ==null || records.length==0){
                Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
            }
            var jsonData = inst.getGridDataAsJSON(records);
            var formValues = Advaya.App.Parent.handler.aggregateFormFields(form.getForm());
            var inputEle = document.createElement("input");
            inputEle.name = obj.params.parameterName;
            inputEle.value = jsonData;
            formValues.appendChild(inputEle);
            obj.params.form=formValues;
            Advaya.App.Initiator.handler.showLoadMask();    
            Advaya.App.Parent.instance.getConfiguration(obj.params,{});
        },
        
        validateGridRecords2:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var indexs=inst.selected;
            var grid=null;
            grid=inst[obj.grid].grid;
            var validateGrid=false;
            var validateField;
            var isError=false;
            if(obj.validateGrid){
                validateGrid=true;
                validateField=obj.validateField
            }
            var checkedRecords=[];
            var gridStore=grid.store;
            gridStore.each(function(record,idx){
                var id=record.get("id");
                var value=indexs[id];
                if(value){
                    if(validateGrid){
                        var validateValue= record.get(validateField);  
                        if(validateValue==undefined || validateValue==''){
                            isError=true;    
                            //                            Advaya.Gms.Fees.handler.showFieldsRequiredError()
                            return false;
                        }
                    } 
                    checkedRecords.push(record);   
                }
            });   
            if(isError){
                return null
            }else{
                return checkedRecords;
            }
        },
        
        showFieldsRequiredError:function(){
                    var obj = {};
                    obj.title = "Info";
                    obj.message = "Some fields has to be filled";
                    Advaya.Gms.Message.handler.show(obj);
        },
        
         gridButtonClick:function(responseHandler,req){
           var inst = Advaya.Gms.Fees.instance;
            var obj={};
            obj.params={}
            obj.params.req = req;
            obj.params.responseHandler = responseHandler;
            obj.params.inst = inst;
            Advaya.Gms.Fees.handler.sendReq(obj);
        },
        
        gridBeforeEdit:function(editor,e){
            var editorField=editor.column.getEditor();
            var record=editor.record.data;
            var maximumValue=record.maximumAmount;
            editorField.maxValue=maximumValue;
            var inst = Advaya.Gms.Fees.instance;
            var checkbox=document.getElementById("id_"+record.id);
            if(checkbox.disabled){
                return false;
            }
            var selected=inst.selected[editor.rowIdx];
            if(selected!=undefined){
                return selected;
            }else{
                return false;
            }
        },
        
        gridAfterEdit:function(a,b,c){
            var selected=document.getElementById("id_"+b.record.data.id);
            if(selected.checked==false){
                selected.checked=true;
            }
        },
        
         gridSelectRequestOnClick1:function(obj){
            var obj1={};
            obj1.params={};
            var grid=null;
            var inst = Advaya.Gms.Fees.instance;
            for(var key in obj.params){
                obj1.params[key]=obj.params[key];    
            }
            grid=inst[obj1.params.gridName].grid;
            
            if(grid){
                if(grid.getSelectionModel().lastSelected!=null){
                    var id=grid.getSelectionModel().lastSelected.data.id
                    obj1.params.req=obj1.params.req+"&"+obj1.params.customIdMap+"="+id;
                    Advaya.Gms.Fees.handler.sendReq(obj1)
                }else{
                    Advaya.App.Parent.instance.showErrorMessage();
                }
            }
        },
        
        radioButtonChangeOperation:function(obj,newValue,oldValue,eOpts){
        var notfication=Ext.getCmp("notification");
        var dueBtDate=Ext.getCmp("DueNtBd");
        var overFrequecy=Ext.getCmp("lastDayNt");
        var overDueDate=Ext.getCmp("overDue");
        var scholarShip=Ext.getCmp("scholarShip");
            switch(newValue['paymentCycle.dueNotification']){
                case 'false':
                            notfication.setDisabled(true);
                            dueBtDate.setDisabled(true);
                            overFrequecy.setDisabled(true);
                            overDueDate.setDisabled(true);
                            scholarShip.setDisabled(true);
                            break;
                case 'true':
                            notfication.setDisabled(false);
                            dueBtDate.setDisabled(false);
                            overFrequecy.setDisabled(false);
                            overDueDate.setDisabled(false);
                            scholarShip.setDisabled(false);
                            break;
            }
        } ,
        
        packageAfterEditCell:function(obj){
            if(obj.context.value !=undefined){
                var totalAmount=Ext.getCmp("totalAmount");
                var value=totalAmount.getValue();
                var totalAmountValue=parseFloat(value)+obj.context.value;
                totalAmount.setValue(totalAmountValue);
            }
        },
        feesAfterEditCell: function (obj) {
            if (obj.context.value === null || obj.context.value !== undefined) {
                var totalAmount = Ext.getCmp("newAmount");
                var value = parseFloat(totalAmount.getValue());
                value = value - parseFloat(obj.context.originalValue);
                var totalAmountValue = null;
                if (obj.context.value === null) {
                    totalAmountValue = parseFloat(value) + parseFloat(0);
                } else {
                    totalAmountValue = parseFloat(value) + parseFloat(obj.context.value);
                }
                totalAmount.setValue(totalAmountValue);
                var totalAmt=Ext.getCmp("totalAmount");
                totalAmt.setValue(totalAmountValue);
            }
        },
        packageBeforeCellEdit:function(obj){
            var editorField=obj.column.getEditor();
            var maximumValue;
            var oldValue=obj.value;
            var totalAmount=Ext.getCmp("totalAmount");
            var value=totalAmount.getValue();
            if(oldValue !='' || oldValue!=undefined){
                var totalAmountValue=parseFloat(value)-oldValue;
                totalAmount.setValue(totalAmountValue);
                var totalPackageAmount=Ext.getCmp("totalPackageAmount");
                var tpa=parseFloat(totalPackageAmount.getValue());
                maximumValue=tpa-totalAmountValue;
            }else{
               maximumValue=parseFloat(value);
            }
            editorField.maxValue=maximumValue;
        },
        
        submitEditPackage:function(obj){
             var  inst=Advaya.Gms.Fees.instance;
             var tpkAt=Ext.getCmp("totalPackageAmount").getValue();
             var epkAt=Ext.getCmp("totalAmount").getValue();
             if(tpkAt!=epkAt){
                 Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
             }
           var records=Advaya.Gms.Fees.handler.validateGridRecords1(obj.params);
            if(records ==null || records.length==0){
                Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
            }
           var jsonData = inst.getGridDataAsJSON(records);
           var inputEle = document.createElement("input");
           inputEle.name = obj.params.parameterName;
           inputEle.value = jsonData;
           var form = document.createElement("form");
           form.appendChild(inputEle)
           obj.params.form=form; 
           Advaya.App.Initiator.handler.showLoadMask();    
           Advaya.App.Parent.instance.getConfiguration(obj.params,{});
            
        },
        
         formSubmitWithIframeForExcel:function(obj){
            var inst = Fees.instance;
            var form = inst[obj.params.submitForm];
            if (form.getForm().isValid()) {
                var formFieldsLenght=form.getForm()._fields.items.length;
                var req=null;
                req=obj.params.req;
                for(var i=0;i<formFieldsLenght;i++){
                    var item=form.getForm()._fields.items[i];
                    if(item.rawValue){
                        var value = item.inputValue;
                        var parameter=item.name;
                        req=req+"&"+parameter+"="+value;
                    }
                }

                inst.processIframeRequest(req);
            }
        },
        
        branchsForCourse:function(field, newValue,oldValue,obj){
            var branch = Ext.getCmp("rule-branch");
            var courseIds = Object.values(newValue);
            //            var coIds = Object.values(courseIds);
            branch.removeAll();
            Ext.apply(branch,{
                allowBlank : true
            });
            for(var i =0 ; i<courseIds.length ; i++){
                if(Array.isArray(courseIds[i]))
                    for(var j =0 ;j< courseIds[i].length;j++)
                        branch.add(obj.params[courseIds[i][j]].branch);
                else
                    branch.add(obj.params[courseIds[i]].branch);
            }
        },
        
        destroyReqWindow:function(){
            var  inst=Advaya.Gms.Fees.instance;
            if(inst.reqWindow){
                inst.reqWindow.destroy();
                inst.reqWindow = null;
            }
            if(inst.reqForm){
                inst.reqForm.destroy();
                inst.reqForm=null;
            }
            if(inst.reqForm1){
                inst.reqForm1.destroy();
                inst.reqForm1=null;
            }
            if(inst.reqGrid){
                inst.reqGrid.destroy();
                inst.reqGrid=null;
            }
            if(inst.reqGrid1){
                inst.reqGrid1.destroy();
                inst.reqGrid1=null;
            }
        },
        
        submitDelete: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var requiredForm = inst[obj.params.submitForm];
            var form = requiredForm.getForm();
            if (form.isValid()) {
                Advaya.App.Initiator.handler.showLoadMask();
                var valueElement = Ext.getCmp("search");
                var value=valueElement.getValue();
                var commaValue=value.replace(/[\n\r\t]/g, ",")
                var inputEle = document.createElement("input");
                inputEle.name = 'jsonData';
                inputEle.value = commaValue;
                obj.params.form = document.createElement("form");
                obj.params.form.appendChild(inputEle);
                Advaya.App.Parent.instance.getConfiguration(obj.params, {});
            } else {
                var obj2 = {};
                obj2.title = "Info";
                obj2.message = "Marked fields needs to be filled to proceed";
                Advaya.Gms.Message.handler.show(obj2);
            }
        },
        
        disableTheCheckBoxFields:function(field, isChecked){
            var challan = Ext.getCmp("challan");
            var due = Ext.getCmp("feesDues");
            if(field.params.inputValueParameter =="fltr.challan"){
                if(isChecked[field.params.inputValueParameter]  == "True"){
                    challan.setDisabled(false);
                    challan.setVisible(true);
                }else{
                    challan.setDisabled(true);
                    challan.setVisible(false);
                }
            }
            if(field.params.inputValueParameter =="fltr.isIncludeAllHeaders"){
                if(isChecked[field.params.inputValueParameter] == "True"){
                    due.setDisabled(false);
                    due.setVisible(true);
                }else{
                    due.setDisabled(true);
                    due.setVisible(false);
                }
            }
        },
        
//         ListingTypeDropdown:function(field, isChecked){
//            var challan = Ext.getCmp("groupByValues");
//            if(field.params.inputValueParameter ==="fltr.listingType"){
//                if(field.originalValue["fltr.listingType"] =="groupBy"){
//                    challan.setDisabled(false);
//                    challan.setVisible(true);
//                }else{
//                    challan.setDisabled(true);
//                    challan.setVisible(false);
//                }
//            }
//        },
        
        listingTypeDropdown: function(field,isChecked){
         var sanction = Ext.getCmp("group");
         if(isChecked[field.params.inputValueParameter] == "groupBy"){
             sanction.setDisabled(false);
             sanction.setVisible(true);
         }else if(isChecked[field.params.inputValueParameter] == "summary"){
             sanction.setDisabled(true);
             sanction.setVisible(false);
         }
     },
     
        
        challanWindow: function (id,src) {
            var inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
//            inst.destroyChallanWindow();
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setAllocateFeeWindow",
                req:src+"&id="+id
            };
            inst.loadFeesForm(obj);
        },
        pullStudentsData : function(responseHandler,req){
            var obj1 = {};
            var inst = Advaya.Gms.Fees.instance;
            obj1.responseHandler = responseHandler;
            obj1.req = req;
            obj1.inst = inst;
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj1, {});
        },
        
        dueChallanDetails: function (type, src) {
            var inst = Advaya.Gms.Fees.instance;
            var record = inst.winGrid.grid.getSelectionModel().getSelection();
            var req1 = null;
            if (type == "edit") {
                var stdate = Ext.getCmp('report_sdate').rawValue;
                var etdate = Ext.getCmp('report_edate').rawValue;
                req1 = "./fees/paymentByPC.action?actionType=editChallanDetails&challanNO=" + record[0].data.challanNo + "&type=" + type + "&sdate=" + stdate + "&edate=" + etdate
            } else {
                req1 = "./fees/paymentByPC.action?actionType=challanDetails&dueChallan=true&challanNO=" + record[0].data.challanNo + "&type=" + type
            }
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                responseHandler: "setFeesWindow",
                req: req1
            };
            inst.loadFeesForm(obj);
        },
        
        dueChallanPayment: function (eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            var challanNo = eOpts.params.challan;
            var type = eOpts.params.type;
            var msg1 = "";
            var req1 = null;
            var form;
            var paymentDate = Ext.getCmp('Pdate').rawValue;
            if (challanNo == undefined || challanNo == "" || paymentDate == undefined || paymentDate == "") {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Mandatory fields are left empty ",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            if (type == "edit") {
                records = inst.winGrid.grid.store.data.items;
                var jsonData = Advaya.Gms.Classes.handler.getGridDataAsJSON(records);
                var inputEle = document.createElement("input");
                var paymentStatus = Ext.getCmp("paidStatus").getValue();
                inputEle.name = 'jsonData';
                inputEle.value = jsonData;
                form = document.createElement("form");
                form.appendChild(inputEle);
                var remarks = Ext.getCmp("remarks").value;
                if (remarks == undefined || remarks == "" || paymentStatus.PaidStatus == undefined || paymentStatus.PaidStatus == "") {
                    Ext.MessageBox.show({
                        title: 'Alert!',
                        msg: "Mandatory fields are left empty",
                        buttons: Ext.MessageBox.OK
                    });
                    return;
                }
                msg1 = "Do you want to save details for" + challanNo;
                req1 = "./fees/paymentByPC.action?actionType=editPayment&challanNO=" + challanNo + "&sdate=" + paymentDate + "&studentPaymentDetail.remarks=" + remarks + "&paymentStatus=" + paymentStatus.PaidStatus;
            }else {
                var verified = eOpts.params.isVerified;
                if (verified == 'no') {
                    msg1 = "Do you want to verify payment for challan " + challanNo;
                    req1 = "./fees/paymentByPC.action?actionType=updateIsVerified&dueChallan=true&challanNO=" + challanNo + "&sdate=" + paymentDate
                } else {
                    msg1 = "Do you want to make Payment for Challan " + challanNo;
                    req1 = "./fees/paymentByPC.action?actionType=makePayment&dueChallan=true&challanNO=" + challanNo + "&sdate=" + paymentDate
                }
            }
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: msg1,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            var obj = {
                                form: true,
                                inst: Advaya.Gms.Fees.instance,
                                responseHandler: "setDueChallanWindow",
                                req: req1
                            };
                            if (type == "edit") {
                                obj.form = form;
                                Advaya.App.Initiator.handler.showLoadMask();
                                inst.parent.getConfiguration(obj, {});
                                break;
                            }
                            inst.loadFeesForm(obj);
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        
        dueChallanCancel: function (eOpts) {
            var inst = Advaya.Gms.Fees.instance;
            var challanNo = eOpts.params.challan;
            var remarks = Ext.getCmp("description").value;
            if (challanNo == undefined || challanNo == "" || remarks == undefined || remarks == "") {
                Ext.MessageBox.show({
                    title: 'Alert!',
                    msg: "Mandatory fields are left empty ",
                    buttons: Ext.MessageBox.OK
                });
                return;
            }
            Ext.MessageBox.show({
                title: 'Confirmation',
                msg: "Do you want to cancel for Challan" + challanNo,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            var obj = {
                                form: true,
                                inst: Advaya.Gms.Fees.instance,
                                responseHandler: "setDueChallanWindow",
                                req: "./fees/paymentByPC.action?actionType=cancelChallan&dueChallan=true&challanNO=" + challanNo + "&studentPaymentDetail.remarks=" + remarks
                            };
                            inst.loadFeesForm(obj);
                            break;
                        case 'no':
                            break;
                    }
                }
            });
        },
        
        submitGridAndFormForFees:function(obj){
             var  inst=Advaya.Gms.Fees.instance;
             var tpkAt=Ext.getCmp("totalPackageAmount").getValue();
             var epkAt=Ext.getCmp("totalAmount").getValue();
             if(tpkAt!=epkAt){
                 Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
             }
           var records=Advaya.Gms.Fees.handler.validateGridRecordForFees(obj.params);
            if(records ==null || records.length==0){
                Advaya.Gms.Fees.handler.showFieldsRequiredError()
                return;
            }
           var jsonData = inst.getGridDataAsJSON(records);
           var inputEle = document.createElement("input");
           inputEle.name = obj.params.parameterName;
           inputEle.value = jsonData;
           var form = document.createElement("form");
           form.appendChild(inputEle)
           obj.params.form=form; 
           Advaya.App.Initiator.handler.showLoadMask();    
           Advaya.App.Parent.instance.getConfiguration(obj.params,{});
            
        },
        
        validateGridRecordForFees:function(obj){
            var  inst=Advaya.Gms.Fees.instance;
            var grid=null;
            grid=inst[obj.grid].grid;
            var validateAllRecords=false;
            var validateField=[];
            var isError=false;
            validateField=obj.validateField.split(",")
            if(obj.validateAllRecords){
                validateAllRecords=true;
            }
            var checkedRecords=[];
            var gridStore=grid.store;
//            
            for (var i = 0; i < grid.store.data.items.length; i++) {
                for (var j = 0; j < validateField.length; j++) {
                    var validateValue = gridStore.data.items[i].data.amount;
                    if (validateValue === undefined || validateValue === '') {
                        isError = true;
                        return false;
                    }
                }
                if (!isError) {
                    checkedRecords.push(gridStore.data.items[i]);
                }
            }
            if(validateAllRecords){
                var updateRecordCount=checkedRecords.length;
                var gridRecordsSize=gridStore.getTotalCount();
                if(updateRecordCount!=gridRecordsSize){
                    return null;
                }
            }
            if(isError){
                return null
            }else{
                return checkedRecords;
            }
        },
        closeDueChallan: function (objs) {
            var inst = Advaya.Gms.Fees.instance;
            var req1 = "&stdent.usn=" + inst.feesForm.items.items[0].items.items[1].value;
            var obj = {
                form: true,
                inst: Advaya.Gms.Fees.instance,
                action: objs.params.action,
                responseHandler: objs.params.responseHandler,
                req: objs.params.req + req1
            };
            Advaya.App.Initiator.handler.showLoadMask();
            inst.parent.getConfiguration(obj, {});
        },
        printChallanByStudentPage: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var applicationNo;
            var flageType;
            var copies = Ext.getCmp('challan_copies').value;
            var objArray1 = Ext.getCmp('objArray1').value.toString();
            var objArraySubsidy = Ext.getCmp('objArraySubsidy').value.toString();
            var applySubsidy = Ext.getCmp('applySubsidy').value.toString();
            var paymentCycleId = Ext.getCmp('paymentCycleId').value;
            var branch = Ext.getCmp('challan_branch').value;
            var quota = Ext.getCmp('challan_quota').value;
            var partial = Ext.getCmp('partial').value;
            var category = Ext.getCmp('challan_category').value;
            var allotedCategory = Ext.getCmp('challan_AllotedCategory').value;
            var resindential = Ext.getCmp('challan_resindential').value;
            var stateQuota = Ext.getCmp('challan_stateQuota').value;
            var nameAsPuc = Ext.getCmp('nameAsPuc').value;
            var fatherName = Ext.getCmp('fatherName').value;
            var motherName = Ext.getCmp('motherName').value;
            var mobileNo = Ext.getCmp('mobileNo').value;
            var PaymentMode1 = Ext.getCmp('PaymentMode1').value;
            var studyingYear = Ext.getCmp('challan_studying_year').value;
            var obj1 = obj.params;
            if (obj1 != undefined && obj1.paymentTypes == 'back') {
                var type=obj1.type;
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/exportChallanStudent.action?actionType=popUp&fltr.copies=" + copies + "&id="
                        + paymentCycleId + "&fltr.resindential=" + resindential + "&nameAsPuc=" + nameAsPuc + "&mobileNo=" + mobileNo +
                        "&PaymentMode1=" + PaymentMode1 + "&fatherName=" + fatherName + "&motherName=" + motherName+"&type="+type
            } else {
                var objArray = new Array();
                for (var i = 0; i < Ext.getCmp('feeRuleList').items.length; i++) {
                    objArray[i] = Ext.getCmp('feeRuleList').items.items[i].inputValue + "-" + Ext.getCmp('feeRuleList').items.items[i].getValue().toString();
                }
                if (objArray == undefined) {
                    Ext.MessageBox.show({
                        title: 'Info',
                        msg: "Select fee and proceed to download challan",
                        buttons: Ext.MessageBox.OK
                    });
                    return;
                }
                obj.inst = Advaya.Gms.Fees.instance;
                obj.req = "./fees/saveCreateApplicationAndShowFees.action?actionType=applicableFeeRules&fltr.copies=" + copies + "&studyingYear=&paymentCycle.id="
                        + paymentCycleId + "&fltr.quota=" + quota + "&fltr.allotedCategory=" + allotedCategory + "&fltr.category=" + category + "&fltr.stateQuota=" + stateQuota + "&fltr.resindential=" + resindential + "&fltr.branch=" + branch + "&objArray=" + objArray.toString() + "&nameAsPuc=" + nameAsPuc + "&partial=" + partial + "&mobileNo=" + mobileNo
                        + "&objArray1=" + objArray1 + "&PaymentMode1=" + PaymentMode1 + "&applySubsidy=" + applySubsidy +
                        "&objArraySubsidy=" + objArraySubsidy + "&fatherName=" + fatherName + "&motherName=" + motherName +"&fltr.studyingYear=" + studyingYear;
                if (Ext.getCmp('applicationNo') != undefined)
                {
                    applicationNo = Ext.getCmp('applicationNo').value;
                    obj.req = obj.req + "&applicationNo=" + applicationNo;
                }
                if (Ext.getCmp('flageType') != undefined)
                {
                    flageType = Ext.getCmp('flageType').value;
                    obj.req = obj.req + "&flageType=" + flageType;
                }
            }
            obj.responseHandler = "setFeesWindow";
            Advaya.App.Parent.instance.getConfiguration(obj, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
        calculateFeesTotalAmt: function () {
            var totalAmt = 0;
            for (var i = 1; i <= Ext.getCmp('feesDetails').items.length; i++) {
                var feei = Ext.getCmp('feeCount' + i);
                var feeAmt = Ext.getCmp(feei.value);
                if (feeAmt.value) {
                    totalAmt = totalAmt + feeAmt.value;
                }
            }
            var totalFeeAmt = Ext.getCmp('totalFeeAmt');
            totalFeeAmt.setValue(totalAmt);
        }
        
    };

    YAHOO.extend(Fees, Parent, {
        feesForm: null,
        feesGrid: null,
//      courses:null,
        filterGrid: null,
        firstClick: true,
        selected:{},
        init: function ( ) {
            Advaya.Gms.Fees.instance = this;
            Advaya.Gms.Fees.instance.parent = Advaya.App.Parent.instance;
            Advaya.App.Parent.instance.currentInst = this;
        },
        loadFeesForm: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            var reqParams = {};
            if (obj.form) {
                if (obj.validate) {
                    if (!inst.feesForm.getForm().isValid()) {
                        var message = "Mandatory fields are left empty";
                        Advaya.Gms.Message.handler.show({
                            message: message
                        });
                        return;
                    }
                }
                obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.feesForm.getForm());
            }
            if (obj.grid && !Advaya.App.Parent.instance.prnt_reqParams) {
                inst.showErrorMessage();
                return;
            }
            if (obj.checkFeeType && Advaya.App.Parent.instance.prnt_reqParams) {
                var rec = inst.feesGrid.grid.getSelectionModel().getSelection()[0].data;
                if (rec.type != "Fixed") {
                    Advaya.Gms.Fees.handler.alert("You can't allocate selected fee to the students here. Go to FeeRule for allocating to the students.");
                    Advaya.App.Initiator.handler.hideLoadMask();
                    return;
                }
            }
            inst.parent.getConfiguration(obj, reqParams);
            obj = null;
        },
        loadWinForm: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            var reqParams = {};
            if (obj.form) {
                obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.winForm.getForm());
            }
            inst.parent.getConfiguration(obj, reqParams);
        },
        
        loadChallanForm: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            var reqParams = {};
            if (obj.form) {
                obj.form = Advaya.Gms.Fees.instance.formFields(inst.reqWindow);
            }
            inst.parent.getConfiguration(obj, reqParams);
        },
        
        formFields : function( xform ) {
            var formFields =xform.items;
            var form = document.createElement("form");
            for( var key in formFields){
                var inputEle = document.createElement("input");
                inputEle.name = key;
                inputEle.value = formFields[key];
                form.appendChild(inputEle);
            }
            return form;
        },
        
        loadStudentFee: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var totalPay = Ext.getCmp("totalPayment").value;
            var totalDue = Ext.getCmp("totalDue").value;
            if (totalPay > totalDue) {
                var message = "Payment exceeds Total Due";
                Advaya.Gms.Message.handler.show({
                    message: message
                });
                return;
            }
            var form = inst.winForm.getForm();
            if (form.isValid()) {
                inst.loadWinForm(obj);
            } else {
                var message = "Mandatory fields are left empty";
                Advaya.Gms.Message.handler.show({
                    message: message
                });
            }
//            return;
        },
        getSearch: function (obj) {
            var yr = Ext.getCmp('searchYr').getValue();
            obj.reqParams = {};
            obj.reqParams["year"] = yr;
            if (yr == "") {
                Ext.getCmp('searchYr').markInvalid("This field is required");
                return;
            }
            if (Ext.getCmp('searchYr').isValid()) {
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
        },
        setFeesData: function (response, inst) {
            Advaya.App.Parent.instance.prnt_reqParams = null;
            inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (typeof content === "undefined" || typeof content.results === "undefined" || content.results === null) {

            } else {
                console.log("Results:", content.results);
            }
            inst.hideMessage();
            inst.destroyWindow();
            inst.destroyContent();
            Ext.override(Ext.selection.RowModel, {
                onRowMouseDown: function (view, record, item, index, e) {
                    this.selectWithEvent(record, e);
                }
            });
//            inst.destroy();
            var prnt = document.getElementById("dynacontent");
            inst.updateWindowTitle(content.formHeader);
            inst.updateHeader(content.title);
            if (content.saved) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: 'Payment  Saved Sucessfully !',
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            if (content.toolbarData) {
                inst.feesToolbar = new Advaya.App.Menubar(content.toolbarData, "dynacontent", inst);
            }

            if (content.wizardHdr) {
                if (inst.wizardHdr) {
                    inst.wizardHdr.destroy();
                }
                inst.wizardHdr = new Advaya.App.Wizard(content.wizardHdr, inst, {});

            }
            if (content.activeTab) {
                Advaya.App.Wizard.handler.setWizard(content.activeTab);
            }

            if (content.formData) {
                inst.feesForm = new Ext.FormPanel(content.formData);
            }

            if (content.filterData) {
                inst.feesFilter = new Ext.FormPanel(content.filterData);
            }

            inst.parent.createEmptyDiv(prnt);
            var pluginsParams = {};
            if (content.pluginsParam) {
                for (var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }

            inst.feesGrid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
            inst.feesGrid1 = new Advaya.App.Grid(content.tableData1,inst,pluginsParams);
            inst.feesGrid2 = new Advaya.App.Grid(content.tableData2,inst,pluginsParams);
            
            if (content.groupField)
            {
                inst.feesGrid.grid.store.group(content.groupField);
                inst.feesGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                inst.feesGrid.grid.features[0].startCollapsed = false;
            }
            if (content.paymentData) {
                inst.feesGrid = new Advaya.App.Grid(content.paymentData, inst, {});
                Ext.getCmp("paymentField").insert(0, inst.feesGrid.grid);
            }
            if (Ext.getCmp("reportField")) {
                Ext.getCmp("reportField").insert(0, inst.feesGrid.grid);
            }
            if(Ext.getCmp("feesGrid")){
                Ext.getCmp("feesGrid").insert(0, inst.feesGrid1.grid);
            }
        },
        setAllocateFeeWindow: function (response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            inst.instWindow = new Ext.window.Window(content.windowData);
            if (content.formData)
                inst.winForm = new Ext.form.Panel(content.formData);
            if (content.filterData)
                inst.winForm = new Ext.form.Panel(content.filterData);
            inst.instWindow.add(inst.winForm);
            if (content.tableData) {
                var pluginsParams = {};
                if (content.pluginsParam) {
                    for (var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.winGrid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
//            inst.winForm.add(inst.winGrid.grid);
                Ext.getCmp('studentsTable').add(inst.winGrid.grid);
            }
            inst.instWindow.show();
        },
        payment: function (obj) {
            var inst = Fees.instance;
            Advaya.App.Initiator.handler.showLoadMask();
            var records = inst.feesGrid.grid.store.getRange();
            var jsonData = inst.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            var form = document.createElement("form");
            form.appendChild(inputEle)
            obj.form = form;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = obj.params.req;
            obj.responseHandler = obj.params.responseHandler;
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        getGridDataAsJSON: function (records) {
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            for (cnt = 0; cnt < records.length; cnt++) {
                var data = records[cnt].data;
                jsonData += sep + Ext.JSON.encode(data)
                sep = ",";
            }
            jsonData += "]";
            return jsonData;
        },
        setFeesStatistics: function (content, inst) {
            Advaya.App.Parent.instance.prnt_reqParams = null;
            inst = Advaya.Gms.Fees.instance;
            inst.destroy();
            inst.destroyContent();
            inst.updateWindowTitle(content.formHeader);
            inst.updateHeader(content.title);

            inst.tab = new Ext.tab.Panel(content.tabData);
            var gridHeight = document.getElementById("dynacontent").offsetHeight - 40;

            inst.courseGrid = new Advaya.App.Grid(content.courseData, inst, {
                summary: "summary"
            });
            inst.quotaGrid = new Advaya.App.Grid(content.quotaData, inst, {
                summary: "summary"
            });

            inst.courseGrid.grid.setHeight(gridHeight);
            inst.quotaGrid.grid.setHeight(gridHeight);

            inst.courseGrid.grid.store.group(content.cgroupField);
            inst.courseGrid.grid.features[0].groupHeaderTpl = content.cgroupHeaderTpl;
            inst.courseGrid.grid.features[0].startCollapsed = true;

            inst.quotaGrid.grid.store.group(content.qgroupField);
            inst.quotaGrid.grid.features[0].groupHeaderTpl = content.qgroupHeaderTpl;
            inst.quotaGrid.grid.features[0].startCollapsed = true;

            Ext.getCmp("feesStatByCourse").add(inst.courseGrid.grid);

            var byQuota = Ext.getCmp("feesStatByQuota");
            byQuota.on("afterrender", function () {
                byQuota.add(inst.quotaGrid.grid);
            });
        },
        setFeesWindow: function (response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            inst.instWindow = new Ext.window.Window(content.windowData);
            inst.winForm = new Ext.form.Panel(content.formData);
            if (content.tableData) {
                var pluginsParams = {};
                if (content.pluginsParam) {
                    for (var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.winGrid = inst.setGrid(content, inst, pluginsParams);
                inst.winForm.add(inst.winGrid.grid);
            }
            if (content.feeTableData) {
                var cmp = Ext.getCmp("feesGridFieldSet");
                var pluginsParams = {};
                if (content.pluginsParam) {
                    for (var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.winGrid = new Advaya.App.Grid(content.feeTableData, inst, pluginsParams);
                if (cmp) {
                    cmp.removeAll();
                    cmp.add(inst.winGrid.grid);
                }
            }
            if (content.paymentData) {
                content.tableData = content.paymentData;
                inst.winGrid = inst.setGrid(content, inst);
                inst.winGrid.grid.on("selectionchange", Advaya.Gms.Fees.handler.onRowClick);
                inst.winForm.add(inst.winGrid.grid);
            }
            if (content.selectionData) {
                content.tableData = content.selectionData;
                inst.winGrid = inst.setGrid(content, inst);
                inst.winGrid.grid.on("selectionchange", Advaya.Gms.Fees.handler.onRowCLickStudentReq);
                inst.winForm.add(inst.winGrid.grid);
            }
            if (content.formData && content.formData.ApproverStaff) {
                inst.ApproverStaff = content.formData.ApproverStaff;

            }
            if (content.rightFormPanel) {
                if (inst.rightWinForm) {
                    inst.rightWinForm.destroy();
                }
                inst.rightWinForm = new Ext.form.Panel(content.rightFormPanel);
                inst.mentorWindow.add(inst.rightWinForm);
            }
            inst.instWindow.add(inst.winForm);
            inst.instWindow.show();
        },
        setDataStudentApprovel: function (response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.selectionData) {
                if (inst.stuTable) {
                    inst.stuTable.destroy();
                }
                inst.stuTable = new Advaya.App.Grid(content.selectionData, inst, {});

                if (Ext.getCmp("stuFldSet")) {
                    Ext.getCmp("stuFldSet").add(inst.stuTable.grid);
                }
            }
        },
        setChallanWindow: function(response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if(inst.challanWindow){
                inst.challanWindow.destroy();
            }
            inst.challanWindow = new Ext.window.Window(content.windowData);
            inst.challanForm = new Ext.form.Panel(content.formData);
            if (content.tableData) {
                inst.winGrid = inst.setGrid(content, inst);
                    inst.challanForm.add(inst.winGrid.grid);
                }
            if(content.feeTableData){
            var cmp = Ext.getCmp("feesGridFieldSet");
            var pluginsParams = {};
            if(content.pluginsParam) {
                for(var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            inst.winGrid = new Advaya.App.Grid(content.feeTableData, inst, pluginsParams);
            
             if(content.groupField)
            {
                inst.winGrid.grid.store.group(content.groupField);
                inst.winGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                inst.winGrid.grid.features[0].startCollapsed = false;
            }
            if(cmp){
                cmp.removeAll();    
                cmp.add(inst.winGrid.grid);
            }
        }
            inst.challanWindow.add(inst.challanForm);
            inst.challanWindow.show();
        },
        setGrid: function (content, inst) {
            var pluginsParams = {};
            if (content.pluginsParam) {
                for (var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            var grid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
            return grid;
        },
        setFeesForm: function (response, inst) {

            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            Advaya.App.Parent.instance.prnt_reqParams = null;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            inst.destroy( );
            inst.destroyContent();
            var prnt = document.getElementById("dynacontent");
            inst.updateWindowTitle(content.formHeader);
//            if(content.courses){
//                Advaya.Gms.Fees.instance.courses = content.courses.split(",");
//            }
            inst.feesForm = new Ext.form.Panel(content);
            var fldst = Ext.getCmp('feeGridField');
            if (content.tableData) {
                inst.reqTable = new Advaya.App.Grid(content.tableData, inst, {})
                fldst.add(inst.reqTable.grid);
            }
            if (content.isFieldSet === 'report') {
                var fieldsets = inst.feesForm.items.items[1].items.items[0].items.items;
                for (var i = 0; i < fieldsets.length; i++) {
                    var id = fieldsets[i];
                    var toggle = fieldsets[i].el.dom.firstChild.firstChild.firstChild;
                    Ext.get(toggle.id).addCls('togglebtn');
                    var obj = {};
                    obj.id = fieldsets[i].id;
                    toggle.params = obj;
                    toggle.onclick = function () {
                        Advaya.Gms.Fees.handler.onExpand(this);
                    }
                }
            } else {
                var fieldsets = $("[class~=feeCollapsedFldSet]");
                for (var i = 0; i < fieldsets.length; i++) {
                    var id = fieldsets[i];
                    var toggle = fieldsets[i].firstChild.firstChild.firstChild;
                    Ext.get(toggle.id).addCls('togglebtn');
                    var obj = {};
                    obj.id = fieldsets[i].id;
                    toggle.params = obj;
                    toggle.onclick = function () {
                        Advaya.Gms.Fees.handler.onExpand(this);
                    }
                }
                var fieldsets = $(".feeCollapsedInnerFldSet");
                for (var i = 0; i < fieldsets.length; i++) {
                    var id = fieldsets[i];
                    var toggle = fieldsets[i].firstChild.firstChild.firstChild;
                    Ext.get(toggle.id).addCls('togglebtn');
                    var obj = {};
                    obj.id = fieldsets[i].id;
                    toggle.params = obj;
                    toggle.onclick = function () {
                        Advaya.Gms.Fees.handler.onExpandInner(this);
                    }
                }
            }
            Ext.override(Ext.selection.RowModel, {
                onRowMouseDown: function (view, record, item, index, e) {
                    this.selectWithEvent(record, e);
                }
            });
        },
         recivedFees: function (response, inst) {

            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            Advaya.App.Parent.instance.prnt_reqParams = null;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            inst.destroy( );
            inst.destroyContent();
            var prnt = document.getElementById("dynacontent");
            inst.updateWindowTitle(content.formHeader);
            if(content.courses){
                Advaya.Gms.Fees.instance.courses = content.courses.split(",");
            }
            if (content.toolbarData) {
                inst.feesForm = new Advaya.App.Menubar(content.toolbarData, "dynacontent", inst);
            }
            
            inst.feesForm = new Ext.form.Panel(content);
            var fldst = Ext.getCmp('feeGridField');
            if (content.tableData) {
                inst.reqTable = new Advaya.App.Grid(content.tableData, inst, {})
                fldst.add(inst.reqTable.grid);
            }
        },
        yesNoAlert: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            var id = Advaya.App.Parent.instance.prnt_reqParams["id"];
            var row = Advaya.App.Parent.instance.row;
            if (id == null) {
                inst.showErrorMessage();
                return;
            }
            Ext.MessageBox.show({
                title: "Info",
                msg: obj.message,
                icon: obj.icon,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            row.data.currentState = "Deleted";
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                    }
                }
            });
        },
        yesNoAlert1: function (obj) {
            var inst = Advaya.Gms.Fees.instance;
            Ext.MessageBox.show({
                title: "Info",
                msg: obj.message,
                icon: obj.icon,
                buttons: Ext.MessageBox.YESNO,
                fn: function (buttonId) {
                    switch (buttonId) {
                        case 'yes':
                            if (obj.form) {
                                if (!inst.winForm.getForm().isValid()) {
                                    Advaya.Gms.Message.handler.show({
                                        message: "Mandatory fields are left empty"
                                    });
                                    return;
                                }
                                obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.winForm.getForm());
                            }
                            var requestedFor = Ext.getCmp('requestFor').getValue();
                            var challanNo = Ext.getCmp('challanNo').getValue();
                            if (requestedFor == "Refund" && requestedFor == "Excess-Refund" && requestedFor == "Refund-Cancel" && !challanNo) {
                                Ext.MessageBox.show({
                                    title: 'Alert!',
                                    msg: "Enter Challan Number",
                                    buttons: Ext.MessageBox.OK
                                });
                                return;
                            }
                            Advaya.App.Parent.instance.getConfiguration(obj, {});
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                    }
                }
            });
        },
        updatePayment: function (content) {
            var inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
            inst.setFeesData(content, inst);
        },
        updateStuRequest: function (content) {
            var inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
        },
        setBatchFees: function (response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            Advaya.App.Parent.instance.prnt_reqParams = null;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (inst.feesForm) {
                inst.feesForm.destroy();
            }
            if (content.type && content.type == "saveFee") {
                Advaya.Gms.Message.handler.show(content);
                return;
            }
            inst.feesForm = new Ext.form.Panel(content);
        },
        setFeeRule: function (content, inst, obj) {
            var activeTab = obj.type;
            inst = Advaya.Gms.Fees.instance;
            inst.destroy();
            inst.destroyWindow();
            inst.destroyContent();
            Advaya.App.Parent.instance.prnt_reqParams = null;

            inst.updateWindowTitle(content.formHeader);
            inst.updateHeader(content.title);
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            inst.tab = new Ext.tab.Panel(content.tabData);

            var feeRuleData = content.feeRuleData;
            var feeRule = Ext.getCmp("feeRule");

            if (feeRuleData.toolbarData) {
                var frToolbar = {
                    xtype: "toolbar",
                    items: feeRuleData.toolbarData
                };
                feeRule.add(frToolbar);

            }
            var frGrid = new Advaya.App.Grid(feeRuleData.tableData, inst, {});
            feeRule.add(frGrid.grid);

            var sRuleData = content.subsidyRuleData;
            var subsidyRule = Ext.getCmp("subsidyRule");

            subsidyRule.on("afterrender", function () {
                var srToolbar = {
                    xtype: "toolbar",
                    items: sRuleData.toolbarData
                };
                subsidyRule.add(srToolbar);

                var srGrid = new Advaya.App.Grid(sRuleData.tableData, inst, {});
                subsidyRule.add(srGrid.grid);
            });
            inst.tab.setActiveTab(activeTab);
        },
        setapproverList: function (content, inst, obj) {
            var activeTab = obj.type;
            inst = Advaya.Gms.Fees.instance;
            inst.destroy();
            inst.destroyWindow();
            inst.destroyContent();
            if (inst.feeWindow) {
                inst.feeWindow.destroy();
            }
            Advaya.App.Parent.instance.prnt_reqParams = null;

            inst.updateWindowTitle(content.formHeader);
            inst.updateHeader(content.title);
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            inst.tab = new Ext.tab.Panel(content.tabData);

            var toApprovedData = content.toBeApprovedData;
            var toBeApproved = Ext.getCmp("toBeApproved");
            var pluginsParams = {};
            if (content.toBeApprovedData.pluginsParam) {
                for (var key in content.toBeApprovedData.pluginsParam) {
                    pluginsParams[key] = content.toBeApprovedData.pluginsParam[key];
                }
            }

            if (toApprovedData.toolbarData) {
                var frToolbar = {
                    xtype: "toolbar",
                    items: toApprovedData.toolbarData
                };
                toBeApproved.add(frToolbar);

            }
            var frGrid = new Advaya.App.Grid(toApprovedData.tableData, inst, pluginsParams);
            toBeApproved.add(frGrid.grid);
            inst.feeGrid = frGrid;

            var approvedRuleData = content.approvedData;
            var approved = Ext.getCmp("approved");

            approved.on("afterrender", function () {
                var srGrid = new Advaya.App.Grid(approvedRuleData.tableData, inst, {});
                approved.add(srGrid.grid);
            });

            var pendingRuleData = content.pendingData;
            var pending = Ext.getCmp("pending");

            pending.on("afterrender", function () {
                inst.pendingForm = new Ext.form.Panel(content.pendingData.formData, inst, {});
                pending.add(inst.pendingForm);
            });
            var rejectedRuleData = content.rejectedData;
            var rejectedRule = Ext.getCmp("rejected");
            rejectedRule.on("afterrender", function () {
                var srGrid = new Advaya.App.Grid(rejectedRuleData.tableData, inst, {});
                rejectedRule.add(srGrid.grid);
            });
            inst.tab.setActiveTab(activeTab);
        },
        
        renderPendingTable: function (content, inst, obj) {
              if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            
            var pending = Ext.getCmp("pending");
            Advaya.App.Initiator.handler.showLoadMask();

            if (inst.pendingTable) {
                inst.pendingTable.destroy();
            }
            inst.pendingTable = new Advaya.App.Grid(content.tableData, inst, {});
            pending.add(inst.pendingTable.grid);
            Advaya.App.Initiator.handler.hideLoadMask();

        },
        setReqWindow: function (content, inst, obj) {
            var activeTab = obj.type;
            inst = Advaya.Gms.Fees.instance;
            inst.destroy();
            inst.destroyWindow();
            inst.destroyContent();
            Advaya.App.Parent.instance.prnt_reqParams = null;

            inst.updateWindowTitle(content.formHeader);
            inst.updateHeader(content.title);
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            inst.tab = new Ext.tab.Panel(content.tabData);

            var toApprovedData = content.toBeApprovedData;
            var toBeApproved = Ext.getCmp("toBeApproved");
            var pluginsParams = {};
            if (content.toBeApprovedData.pluginsParam) {
                for (var key in content.toBeApprovedData.pluginsParam) {
                    pluginsParams[key] = content.toBeApprovedData.pluginsParam[key];
                }
            }

            if (toApprovedData.toolbarData) {
                var frToolbar = {
                    xtype: "toolbar",
                    items: toApprovedData.toolbarData
                };
                toBeApproved.add(frToolbar);

            }
            if (inst.reqWindow) {
                inst.reqWindow.destroy();
            }
            if (inst.reqPanel) {
                inst.reqPanel.destroy();
            }
            var frGrid = new Advaya.App.Grid(toApprovedData.tableData, inst, pluginsParams);
            toBeApproved.add(frGrid.grid);
            inst.feeGrid = frGrid;

            var approvedRuleData = content.approvedData;
            var approved = Ext.getCmp("approved");

            approved.on("afterrender", function () {
                var srGrid = new Advaya.App.Grid(approvedRuleData.tableData, inst, {});
                approved.add(srGrid.grid);
            });

            var rejectedRuleData = content.rejectedData;
            var rejectedRule = Ext.getCmp("rejected");

            rejectedRule.on("afterrender", function () {
                var srGrid = new Advaya.App.Grid(rejectedRuleData.tableData, inst, {});
                rejectedRule.add(srGrid.grid);
            });
            inst.tab.setActiveTab(activeTab);
        },
        setFeesReport: function (content, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            var isHidden = $('#FeeDetailsBody').is(":hidden");
            if (!isHidden) {
                Advaya.Gms.Fees.handler.togglePopUpWindow();
            }
            var feesFilterPanel = Ext.getCmp('feesFilterPanel');
            if (feesFilterPanel && feesFilterPanel.hidden) {
                feesFilterPanel.show();
                Ext.get("feesFilterPanel").slideIn('t', {
                    easing: 'easeOut',
                    duration: 500
                });
            }
            if (content.actionType == "getFilter") {
                var field = Ext.getCmp('feesFilter');
                field.removeAll();
                field.add(content.items);
            } else if (content.actionType == "filter") {
                inst.destroyWindow();
                var field = Ext.getCmp('feesFilter');
                if (field != null || field != undefined) {
                    field.removeAll();
                }
                if (inst.filterGrid) {
                    inst.filterGrid.destroy();
                    inst.filterGrid = null;
                }
                inst.filterGrid = inst.setGrid(content, inst);
                if (field != undefined) {
                    field.add(inst.filterGrid.grid);
                }
                if (content.removedynaContent) {
                    var feesTable = Ext.getCmp('feeGridField');
                    feesTable.removeAll();
                    feesTable.add(inst.filterGrid.grid);
                }
                if (content.groupField)
                {
                    inst.filterGrid.grid.store.group(content.groupField);
                    inst.filterGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                    inst.filterGrid.grid.features[0].startCollapsed = false;
                }
            } else if (content.actionType == 'getReport') {
                inst.destroyWindow();
                inst.instWindow = new Ext.window.Window(content.windowData);
                inst.winForm = new Ext.form.Panel(content.formData);
                if (content.tableData) {
                    inst.winGrid = inst.setGrid(content, inst);
                    if (content.groupField) {
                        inst.winGrid.grid.store.group(content.groupField);
                        inst.winGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                        inst.winGrid.grid.features[0].startCollapsed = false;
                    }
                    if (Ext.getCmp("reportField")) {
                        Ext.getCmp("reportField").insert(0, inst.winGrid.grid);
                    }
                }
                inst.instWindow.add(inst.winForm);
                inst.instWindow.show();
            } else if (content.actionType == 'getDetailedReport') {
                var field = Ext.getCmp("reportField");
                field.removeAll();
                if (content.tableData) {
                    inst.winGrid = inst.setGrid(content, inst);
                    if (content.groupField) {
                        inst.winGrid.grid.store.group(content.groupField);
                        inst.winGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                        inst.winGrid.grid.features[0].startCollapsed = false;
                    }
                    if (Ext.getCmp("reportField")) {
                        Ext.getCmp("reportField").insert(0, inst.winGrid.grid);
                    }
                }
            } else if (content.actionType == 'getSubsidyDetails') {
                var field = Ext.getCmp("feesFilter");
                field.removeAll();
                Ext.getCmp('feesFilterPanel').show();
                Ext.get("feesFilterPanel").slideIn('t', {
                    easing: 'easeOut',
                    duration: 500
                });
                if (content.tableData) {
                    grid = inst.setGrid(content, inst);
                    if (content.groupField) {
                        grid.grid.store.group(content.groupField);
                        grid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                        grid.grid.features[0].startCollapsed = false;
                    }
                    if (Ext.getCmp("feesFilter")) {
                        Ext.getCmp("feesFilter").add(grid.grid);
                    }
                }
            } else {
                alert("success");
            }
        },
        setSelectedRequestData: function (response, inst) {
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            if (content.windowPanel) {
                if (inst.reqWindow) {
                    inst.reqWindow.destroy();
                }
                inst.reqWindow = new Ext.window.Window(content.windowPanel);
            }
            if (content.formPanel) {
                if (inst.reqPanel) {
                    inst.reqPanel.destroy();
                }
                inst.reqPanel = new Ext.form.Panel(content.formPanel);
                inst.reqWindow.add(inst.reqPanel);
                inst.reqWindow.show();
            }
            var pluginsParams = {};
            if (content.pluginsParam) {
                for (var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            if (content.tableData) {
                inst.reqTable = new Advaya.App.Grid(content.tableData, inst, pluginsParams)
            }
            var gridFieldset = Ext.getCmp("gridFieldSet");
            if (gridFieldset) {
                gridFieldset.removeAll();
                gridFieldset.add(inst.reqTable.grid);
            }
        },
        
        setSelectedRequestData1: function (response, inst) {
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            if (content.windowPanel) {
                if (inst.reqWindow) {
                    inst.reqWindow.destroy();
                }
                inst.reqWindow = new Ext.window.Window(content.windowPanel);
            }
            if (content.formPanel) {
                if (inst.reqPanel) {
                    inst.reqPanel.destroy();
                }
                inst.reqPanel = new Ext.form.Panel(content.formPanel);
                inst.reqWindow.add(inst.reqPanel);
                inst.reqWindow.show();
            }
            var pluginsParams = {};
            if (content.pluginsParam) {
                for (var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            if (content.formData) {
                inst.feesForm = new Ext.FormPanel(content.formData);
            }
            if (content.tableData) {
                inst.reqTable = new Advaya.App.Grid(content.tableData, inst, pluginsParams)
            }
            if(content.tableData1){
                inst.reqTable1 = new Advaya.App.Grid(content.tableData1, inst, pluginsParams)
            }
            var gridFieldset = Ext.getCmp("gridFieldSet");
            if (gridFieldset) {
//                gridFieldset.removeAll();
                gridFieldset.add(inst.reqTable.grid);
            }
            var gridFieldSet1 = Ext.getCmp("gridFieldSet1");
             if(gridFieldSet1){
                gridFieldSet1.removeAll();
                gridFieldSet1.add(inst.reqTable1.grid);
             }
        },
        
        setPopUp: function (responseText) {
            var inst = Advaya.Gms.Fees.instance;
            var data = (typeof responseText == "object") ? responseText : eval("(" + responseText.replace(/[\n\r\t]/g, "") + ")");
            var oldDiv = document.getElementById("FeeDetails");
            if (oldDiv != null) {
                oldDiv.parentNode.removeChild(oldDiv)
                oldDiv = null;
            }
            if (oldDiv == null) {
                var overlayDiv = document.createElement("div");
                var parentDiv = null;
                parentDiv = inst.feesForm.el;
                parentDiv.setStyle("overflow", "visible");
                overlayDiv.setAttribute("id", "FeeDetails");
                parentDiv.appendChild(overlayDiv);
                $('#FeeDetails').html(data.bodyTitle);
                var formDiv = document.createElement("div");
                formDiv.setAttribute("id", "FeeDetailsBody");
                overlayDiv.appendChild(formDiv);

                if (data.formData) {
                    if (inst.form) {
                        inst.form.destroy();
                    }
                    inst.form = new Ext.form.Panel(data.formData)
                }
                inst.form.body.dom.style.width = '100%';
                inst.form.body.dom.style.height = '100%';
                var dd = new Ext.dd.DD(overlayDiv, 'carsDDGroup', {
                    isTarget: false
                });
                overlayDiv.onclick = Advaya.Gms.Fees.handler.divEventHandler;
                $('#FeeDetails').prepend('<img id="theImg" class="FeeDetailsImg" onclick="Advaya.Gms.Fees.handler.togglePopUpWindow()" src="./img/black_up.png" />');
                $('#FeeDetails').prepend('<img class="FeeDetailsImg" onclick="Advaya.Gms.Fees.handler.hidePopUpWindow()" src="./img/in-complete.png" />');
//                $("#theImg").on('click',function() {
//                    Advaya.Gms.Fees.handler.togglePopUpWindow();
//                });
                //                searchDiv.style.top = topValue+"px";
                //                searchDiv.style.left = leftValue+"px";
            }
        },
        destroyFeeRule: function (content, inst) {
            inst = Advaya.Gms.Fees.instance;
            inst.destroy();
            inst.destroyWindow();
            inst.destroyContent();
            inst.setFeesData(content, inst);
        },
        destroy: function ( ) {
            var inst = Advaya.Gms.Fees.instance;
            if (inst.feesGrid) {
                inst.feesGrid.destroy();
                inst.feesGrid = null;
            }
            if (inst.feesForm) {
                inst.feesForm.destroy();
            }
            if (inst.feesToolbar) {
                inst.feesToolbar.destroy();
            }
            if (inst.feesFilter) {
                inst.feesFilter.destroy();
            }
        },
        destroyChallanWindow: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            if (obj.params.check) {
                obj.inst = inst;
                obj.req = obj.params.req;
                obj.responseHandler = obj.params.responseHandler;
                obj.action = obj.params.action;
                Advaya.App.Parent.instance.getConfiguration(obj, {});
            }
            if (inst.challanWindow) {
                inst.challanWindow.destroy();
                inst.challanWindow = null;
            }
            if (inst.windowData) {
                inst.windowData.destroy();
                inst.windowData = null;
            }
        },
       setMessageWindow:function(response, inst){
           Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
       },
       
       setRequestWindow:function(response, inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            Advaya.Gms.Fees.handler.destroyReqWindow();
            inst.selected={}
            inst.reqWindow = new Ext.window.Window(content.windowData);
            if(content.formData){
                inst.reqForm = new Ext.form.Panel(content.formData);
                inst.reqWindow.add(inst.reqForm);
            }
            if(content.formData1){
                inst.reqForm1 = new Ext.form.Panel(content.formData1);
                inst.reqWindow.add(inst.reqForm1);
            }
            if(content.tableData){
                inst.reqGrid = inst.setGridByTableData(content.tableData, inst);
                inst.reqWindow.add(inst.reqGrid.grid);
            }
            if(content.tableData1){
                inst.reqGrid1 = inst.setGridByTableData(content.tableData1, inst);
                inst.reqWindow.add(inst.reqGrid1.grid);
            }
            if(content.selectedRecords){
                inst.selected=content.selectedRecords;
            }
            
            inst.reqWindow.show();
        },
        
        setData:function(response,inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            Advaya.App.Parent.instance.prnt_reqParams = null;
            inst = Advaya.Gms.Fees.instance;
//            inst.destroyContent();
            Advaya.App.Parent.instance.destroyContent();
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if( content.toolbarData ) {
                if(inst.feesToolBar){
                    inst.feesToolBar.destroy();
                }
                 inst.feesToolBar = new Advaya.App.Menubar(content.toolbarData,"dynacontent", inst);
            }   
            if( content.formPanel) {
                inst.feesForm = new Ext.FormPanel( content.formPanel );
                var formFields =inst.feesForm.form.getFields().items;
                inst.setStar(formFields);
            }
            if(content.tableData){
                inst.feesGrid= inst.setGrid(content, inst);  
            }
            if(content.tabPanel){
                 inst.feesTabPanel= inst.createTabPanel(content.tabPanel);
            }
        },
        
        setTabData:function(response,inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            var tabPanel=Ext.getCmp(content.tabpanelId);
            if(tabPanel){
                Advaya.Gms.Fees.handler.destroyReqWindow();
               tabPanel.activeTab.removeAll();
             if( content.formPanel) {
                    inst.feesForm = new Ext.FormPanel( content.formPanel );
                    var formFields =inst.feesForm.form.getFields().items;
                    inst.setStar(formFields);
                    tabPanel.activeTab.add(inst.feesForm);
                }
                if(content.tableData){
                    inst.feesGrid= inst.setGrid(content, inst);  
                    tabPanel.activeTab.add(inst.feesGrid.grid);
                }
                if(content.tableData1){
                    inst.feesGrid1= inst.setGrid1(content.tableData1, inst);  
                    tabPanel.activeTab.add(inst.feesGrid1.grid);
                }
            }
        },
        
        setStar : function(formFields){
            for( var i=0; i<formFields.length; i++){
                if (formFields[i].allowBlank == false && formFields[i].labelEl) {
                    formFields[i].labelEl.dom.innerHTML += '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
                } 
            }
        },
        
        createTabPanel:function(content){
            var grid=Ext.create("Ext.tab.Panel",content);
            return grid
        },
        setMessage:function(response, inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            Advaya.Gms.Fees.handler.destroyReqWindow(); 
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if(content.alertMessage){
                var obj = {};
                obj.title = "Info";
                obj.message = content.message;
                Advaya.Gms.Message.handler.show(obj);
            }
        },
        
        setGridByTableData:function(content, inst){
            var pluginsParams = {};
            if (content.pluginsParam) {
                for (var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            var grid = new Advaya.App.Grid(content, inst, pluginsParams);
            if(content.groupField)
            {
                grid.grid.store.group(content.groupField);
                grid.grid.features[0].groupHeaderTpl=content.groupHeaderTpl;
                grid.grid.features[0].startCollapsed = content.startCollapsed;
            }
            return grid;
        },
        
        payment1: function (obj) {
            var inst = Fees.instance;
            Advaya.App.Initiator.handler.showLoadMask();
            //            var records = inst.feesGrid.grid.store.getRange();
            var records = inst.feesGrid.grid.getSelectionModel().getSelection();
            var jsonData = inst.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            var form = document.createElement("form");
            form.appendChild(inputEle)
            obj.form = form;
            obj.inst = Advaya.Gms.Fees.instance;
            obj.req = obj.params.req;
            obj.responseHandler = obj.params.responseHandler;
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        
        addPartialData:function(response){
            Advaya.App.Initiator.handler.hideLoadMask();
            var inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if(content.replaceInWindow){
                if(content.replaceId){
                    var item=  Ext.getCmp(content.replaceId)
                    item.removeAll();
                    if(content.formPanel){
                        var panel= new Ext.form.Panel(content.formPanel);
                        item.add(panel);
                    }
                }
            }
            var formField = Ext.getCmp("stdentDetails");
            if (content.formData1) {
                inst.feesForm = new Ext.form.Panel(content.formData1);
            }
            if(formField){
               formField.removeAll();
               formField.add(inst.feesForm);
            }
            if (content.tableData1) {
                inst.reqTable = new Advaya.App.Grid(content.tableData1, inst, null)
            }
            var gridFieldset = Ext.getCmp("gridFieldSet1");
            if (gridFieldset) {
                gridFieldset.removeAll();
                gridFieldset.add(inst.reqTable.grid);
            }
        },
       
        destroyWindow: function () {
            var inst = Advaya.Gms.Fees.instance;
            if (inst.instWindow) {
                inst.instWindow.destroy();
                inst.instWindow = null;
            }
            if (inst.winForm) {
                inst.winForm.destroy();
                inst.winForm = null;
            }
            if (inst.winGrid) {
                inst.winGrid.destroy();
                inst.winGrid = null;
            }
            if(inst.reqWindow) {
                inst.reqWindow.destroy();
                inst.reqWindow = null;
            }
            if (inst.feesGrid) {
                Advaya.App.Parent.instance.prnt_reqParams = null;
                if (inst.feesGrid.grid) {
                    inst.feesGrid.grid.getSelectionModel().deselect(inst.feesGrid.grid.getSelectionModel().getSelection());
                }
            }
            if (inst.quotaGrid) {
                if (inst.quotaGrid) {
                    inst.quotaGrid.destroy();
                }
            }
            if (inst.courseGrid) {
                if (inst.courseGrid) {
                    inst.courseGrid.destroy();
                }
            }
            if(inst.challanWindow){
                inst.challanWindow.destroy();
                inst.challanWindow = null;
            }
        },
        
        setFeesWindowV1: function (response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if(content.windowData){
                inst.destroyWindow();
                if (content.message) {
                    Ext.MessageBox.show({
                        title: 'Info',
                        msg: content.message,
                        buttons: Ext.MessageBox.OK,
                        fn: function (buttonId) {
                            switch (buttonId) {
                                case 'ok':
                                    break;
                            }
                        }
                    });
                }
                inst.instWindow = new Ext.window.Window(content.windowData);
                inst.winForm = new Ext.form.Panel(content.formData);
                if (content.tableData) {
                    var pluginsParams = {};
                    if (content.pluginsParam) {
                        for (var key in content.pluginsParam) {
                            pluginsParams[key] = content.pluginsParam[key];
                        }
                    }
                    inst.winGrid = inst.setGrid(content, inst, pluginsParams);
                    inst.winForm.add(inst.winGrid.grid);
                }
                inst.instWindow.add(inst.winForm);
                inst.instWindow.show();
            }else{
                inst.hideMessage();
                inst.destroyWindow();
                inst.destroyContent();
                Ext.override(Ext.selection.RowModel, {
                    onRowMouseDown: function (view, record, item, index, e) {
                        this.selectWithEvent(record, e);
                    }
                });
                inst.updateWindowTitle(content.formHeader);
                inst.updateHeader(content.title);
                if (content.message) {
                    Ext.MessageBox.show({
                        title: 'Info',
                        msg: content.message,
                        buttons: Ext.MessageBox.OK,
                        fn: function (buttonId) {
                            switch (buttonId) {
                                case 'ok':
                                    break;
                            }
                        }
                    });
                }
                if (content.formData) {
                    inst.feesForm = new Ext.FormPanel(content.formData);
                }

                inst.feesGrid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
                if (Ext.getCmp("reportField")) {
                    Ext.getCmp("reportField").insert(0, inst.feesGrid.grid);
                }
            }
        },
        setDueChallanWindow: function (response, inst) {
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Fees.instance;
            inst.destroyWindow();
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: content.message,
                    buttons: Ext.MessageBox.OK,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'ok':
                                break;
                        }
                    }
                });
            }
            if (content.windowData) {
                inst.instWindow = new Ext.window.Window(content.windowData);
            }
            inst.winForm = new Ext.form.Panel(content.formData);
            if (content.tableData) {
                var pluginsParams = {};
                if (content.pluginsParam) {
                    for (var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.winGrid = inst.setGrid(content, inst, pluginsParams);
                inst.winForm.add(inst.winGrid.grid);
            }
            if (content.feeTableData) {
                var cmp = Ext.getCmp("feesGridFieldSet");
                var pluginsParams = {};
                if (content.pluginsParam) {
                    for (var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.winGrid = new Advaya.App.Grid(content.feeTableData, inst, pluginsParams);
                if (cmp) {
                    cmp.removeAll();
                    cmp.add(inst.winGrid.grid);
                }
            }
            if (content.paymentData) {
                content.tableData = content.paymentData;
                inst.winGrid = inst.setGrid(content, inst);
                inst.winGrid.grid.on("selectionchange", Advaya.Gms.Fees.handler.onRowClick);
                inst.winForm.add(inst.winGrid.grid);
            }
            if (content.selectionData) {
                content.tableData = content.selectionData;
                inst.winGrid = inst.setGrid(content, inst);
                inst.winGrid.grid.on("selectionchange", Advaya.Gms.Fees.handler.onRowCLickStudentReq);
                inst.winForm.add(inst.winGrid.grid);
            }
            if (content.formData && content.formData.ApproverStaff) {
                inst.ApproverStaff = content.formData.ApproverStaff;

            }
            if (content.rightFormPanel) {
                if (inst.rightWinForm) {
                    inst.rightWinForm.destroy();
                }
                inst.rightWinForm = new Ext.form.Panel(content.rightFormPanel);
                inst.mentorWindow.add(inst.rightWinForm);
            }
            if (content.windowData) {
                inst.instWindow.add(inst.winForm);
                inst.instWindow.show();
            }
        },
        
    });

}());
