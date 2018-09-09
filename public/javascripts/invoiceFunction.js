var $storeInfo = "";
var selectedValue = "";
var cartValues = [];
getCurrentDate();
var comeFrom = "";

function reloadInvoices(data,storeID){
    console.log("DATA Print ", data,storeID)
    NProgress.start();
        if(data == "markShip"){
            $.ajax({
                url:"/invoice/unshippedHardwareOnlyList",
                success: function(result){
                console.log("invoice unship ", result);
                 $('#unshipList').html(result);
                }
            }).always(function(){
                NProgress.done();
                $('.currency').formatCurrency();
            });
        }else{
            var url = "/api/invoice/store/" + storeID;
            //console.log("url ", url);
            $.ajax({
                url:url,
                success: function(result){
                //console.log(result);
                 $('#tab2_1').html(result);
                }
            }).always(function(){
                NProgress.done();
                $('.currency').formatCurrency();
            });
        }

}



function createInvoice(invoiceID,storeID,from){

    $.magnificPopup.open({
     removalDelay: 500,
     items: {
       src: '#invoice-form'
     },
     callbacks:{
        beforeOpen: function(e){
            this.st.mainClass = 'mfp-slideDown';
        },
        open: function(){
            comeFrom = from;
            if (invoiceID == 0){
                $('#invoiceTitle').html('New Invoice');
                $('#invoiceTitle').attr('data-invoice',invoiceID);

                $('#invoiceDate').datetimepicker({
                    defaultDate: new Date()
                });

                $('#chargeDate').datetimepicker({
                    defaultDate: new Date()
                });
            }else{
                editInvoiceFunction(invoiceID);
            }
            //load store information
            loadStoreInfomation(storeID);
            //console.log("from ", from)
            if(comeFrom == 'markShip'){
                //$("#itemCodeInput").prop("disabled",true);
                $('#entryLine').hide();
                $("#invoiceDate").prop("disabled",true);
                $("#chargeDate").prop("disabled",true);
            }else{
                $('#entryLine').show();
                $("#invoiceDate").prop("disabled",false);
                $("#chargeDate").prop("disabled",false);
            }


        },
        close: function(){
            emptyBar();
            emptyShipping();
            $("#productList").find("tr:gt(0)").remove();
            $('#subTotal').html('0');
            $('#totalTaxAmount').html('0');
            $('#dueAmount').html('0');
            $('#displayGivingDays').html('0');
            $('#newDueDate').html(moment($storeInfo.dueDate).utc().format('MM/DD/YYYY'));
            $('td#labelForDueDate').text('Current Due Date');
            $('#shipBy').val('');
            $('#trackingNumber').val('');
            $('.currency').formatCurrency();

            if(from == "invoiceList"){
                reloadInvoices(from,storeID);
                reloadActivity(storeID,1);
            }
        }


     },
     midClick: true,
     closeOnBgClick: false
     });

     $('#invoice-form').draggable();
}

function loadStoreInfomation(storeID){
    var $loading = $('#loading');
    $loading.gSpinner({
        scale:.5
        });

    $.ajax({
        url: '/api/stores/' + storeID,
        type: 'GET',
        success: function(store){
            $storeInfo = store;
             console.log('storedata return ', store);

             var storeInfo = `<h4 style="color:#3B3F4F;"><span id="cspid">` + store.CSPID + `&nbsp-&nbsp;<span id="businessName">` + store.businessName + `</span></span></h4><h5 id="address">`+ store.address +`</h5><h5><span id="city">` + store.city + `</span><span>,&nbsp;</span><span id="state">` + store.State.stateSymbol + `</span><span id="zipcode">10453</span></h5><h5>` + store.businessPhone + `</h5><h5>` + store.businessEmail + `</h5>`

             $loading.gSpinner("hide");

            $('#customerBody').replaceWith(storeInfo);


          }
        });
}

function emptyBar(){
    $('#itemName').val("");
    $('#qty').val("");
    $('#unitPrice').val("");
    $('#total').val("");
    $('#itemCodeInput').val("");
    $('#itemCodeInput').focus();
    $('#addButton').addClass('disabled');
}

function emptyShipping(){
    $('#shippingName').val("");
    $('#shippingBusinessName').val("");
    $('#shippingAddress').val("");
    $('#shippingCity').val("");
    $('#shippingState').val("");
    $('#shippingZipcode').val("");
}

function updateTotal(){
    cartValues = [];
    $('#productList tbody tr').each(function(){
        var values = {
            quantity: parseInt($(this).find('.qty').html()),
            unitPrice : parseFloat($(this).find('.unitPrice').text()),
            taxAmount : parseFloat($(this).find('.taxAmount').text()),
            total : parseFloat($(this).find('.total').text()),
            givenDays: (isNaN(parseInt($(this).find('.givenDays').val())) ? 0 : parseInt($(this).find('.givenDays').val())),
            itemName:$(this).find('.itemName').text(),
            isTax:$(this).find('.isTax').prop('checked'),
            productId: parseInt($(this).find('.productId').html()),
            hardwareSerial: $(this).find('.snumber').val()
        }
        cartValues.push(values);
    })
    console.log('cartValues ', cartValues);
    var tot_subtotal = 0;
    var tot_taxAmount = 0;
    var tot_dueAmount = 0;
    var tot_givenDays = 0;

    cartValues.forEach(amount => {

        tot_subtotal = tot_subtotal + parseFloat(amount.total);
        tot_givenDays = tot_givenDays + parseInt(amount.givenDays);
        tot_taxAmount = tot_taxAmount + parseFloat(amount.taxAmount);
    });
    //console.log("days ", tot_givenDays);
    tot_dueAmount = tot_subtotal + tot_taxAmount;

    $('#subTotal').html(tot_subtotal);

    $('#totalTaxAmount').html(tot_taxAmount);
    $('#dueAmount').html(tot_dueAmount);

    $('#dueAmount').removeClass('animated wobble').addClass('animated wobble').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated wobble');
    });


    $('#displayGivingDays').html(tot_givenDays);
    if(tot_givenDays == 0){
        getCurrentDate();
    }else{
        $('#newDueDate').html(moment($storeInfo.dueDate).add(tot_givenDays, 'days').utc().calendar());
        $('#labelForDueDate').html('New Due Date');
    }

    $('.currency').formatCurrency();

    if(cartValues.length > 0){
        $('#invoiceSaveButton').removeClass('disabled');
    }else{
        $('#invoiceSaveButton').addClass('disabled');
    }
}


$("#addButton").click(function(e){
    var taxAmount = 0
    var isTax = false;
    var showTaxCheckbox = false;
    //console.log("selected Value ", selectedValue);
    if($storeInfo.State){
        if($storeInfo.State.taxCollect != 0 ){
            if(selectedValue.data.applyTax){
                taxAmount = parseFloat($('#total').val() * $storeInfo.State.taxCollect / 100).toFixed(2);
                isTax = true;
                showTaxCheckbox = true;
            }
        }
    }

    var rowValues = {
        itemName:$('#itemName').val(),
        qty:$('#qty').val(),
        unitPrice:$('#unitPrice').val(),
        total:$('#total').val(),
        productType: selectedValue.data.productType,
        dayCycle:selectedValue.data.dayCycle,
        taxAmount: taxAmount,
        isTax: isTax,
        showTaxCheckbox: showTaxCheckbox,
        productId:selectedValue.data.productID,
        hardwareSerial: ""
    };

    addRow(rowValues);
});

function daysChange(insertValue,defaultDays){
    if (insertValue.value > defaultDays){
        bootbox.alert("You can't give more days than " + defaultDays + " days.");
        insertValue.value = defaultDays;
    }
    updateTotal()
}

function addRow(rowValues){

    var htmlTableRow = "<tr class='animated fadeInDown'>"
    htmlTableRow = htmlTableRow + "<td>"
    htmlTableRow = htmlTableRow + "<div class='row form-inline'>"
    htmlTableRow = htmlTableRow + "<div class='col-xs-12'>"
    htmlTableRow = htmlTableRow + "<div class='col-md-1' style='width:5%;'>"

    //console.log("found from value ", rowValues)
    if(rowValues.from == 'markShip'){
        htmlTableRow = htmlTableRow + "<button type='button' disabled class='btn btn-xs btn-danger removeBtn' ><i class='imoon imoon-remove2'></i></button></div>"
    }else{
        htmlTableRow = htmlTableRow + "<button type='button' class='btn btn-xs btn-danger removeBtn' ><i class='imoon imoon-remove2'></i></button></div>"
    }


    htmlTableRow = htmlTableRow + "<div class='col-md-11' style='padding-top:2px;'><span class='itemName'>" + rowValues.itemName + "</span>"

    if(rowValues.productType == "RENEW"){

        htmlTableRow = htmlTableRow + "<div style='float:right;'><input  class='text-center givenDays' type='text' name='givenDays' onchange='daysChange(this," + rowValues.dayCycle + ")' value=" + rowValues.dayCycle + " style='width:50px;'> Given Days </div>"

    }else if(rowValues.productType == "HARDWARE"){

        htmlTableRow = htmlTableRow + "<div style='float:right;'>Serial # <input  class='text-center snumber' type='text' style='width:200px;' onchange='updateTotal()' value=" + rowValues.hardwareSerial + "></div>"
    }

    htmlTableRow = htmlTableRow + "</div></div></td>"
    htmlTableRow = htmlTableRow + "<td class='text-center qty'>" + rowValues.qty + "</td>"

    if(rowValues.showTaxCheckbox){

            htmlTableRow = htmlTableRow + "<td class='text-right'>"
            htmlTableRow = htmlTableRow + "<div class='checkbox-custom'>"
            var taxID = "t" + moment.now()

        if(rowValues.isTax){
            if(rowValues.from == 'markShip'){
                htmlTableRow = htmlTableRow + '<input type="checkbox" disabled class="isTax" value=' + rowValues.total + ' onclick="isTaxApply(\'' + taxID + '\')" id=' + taxID + ' checked>'
            }else{
                htmlTableRow = htmlTableRow + '<input type="checkbox" class="isTax" value=' + rowValues.total + ' onclick="isTaxApply(\'' + taxID + '\')" id=' + taxID + ' checked>'
            }
        }else{
            htmlTableRow = htmlTableRow + '<input type="checkbox" class="isTax" onclick="isTaxApply(\'' + taxID + '\')" id=' + taxID + '>'
        }

            htmlTableRow = htmlTableRow + "<label  class='taxAmount " + taxID + "' for=" + taxID + ">" + rowValues.taxAmount + "</label>"

            htmlTableRow = htmlTableRow + "</div></td>"

    }else{
        htmlTableRow = htmlTableRow + "<td  class='text-right taxAmount'>" + rowValues.taxAmount + "</td>"
    }

    htmlTableRow = htmlTableRow + "<td class='text-right unitPrice'>" + rowValues.unitPrice + "</td>"
    htmlTableRow = htmlTableRow + "<td class='text-right total'>" + rowValues.total + "</td>"
    htmlTableRow = htmlTableRow + "<td class='text-right hidden productId'>" + rowValues.productId + "</td></tr>"

    //console.log(selectedValue);

    $('#invoiceRow').append(htmlTableRow);

    $('.currency').formatCurrency();
    emptyBar();
    updateTotal();
}

function isTaxApply(data){
    if(!$('#' + data).is(':checked')){
        $('.' + data).text(0)
    }else{
        var newTaxValue = parseFloat($('#'+ data).val()) * $storeInfo.State.taxCollect / 100
        $('.' + data).text(newTaxValue)
    }
    $('.currency').formatCurrency();
    updateTotal();
}


function editInvoiceFunction(id){

    $('#invoiceTitle').html('Edit Invoice # ' + id );
    $('#invoiceTitle').attr('data-invoice',id);
    $.ajax({
        url: '/api/invoice/' + id,
        type: 'GET',
        success: function(returnInvoice){

            console.log("return Inoice ", returnInvoice);
              if(returnInvoice.status){
                  $('#subTotal').html(returnInvoice.data.invoiceAmount);
                  $('#totalTaxAmount').html(returnInvoice.data.taxAmount);
                  $('#dueAmount').html(returnInvoice.data.invoiceAmount + returnInvoice.data.taxAmount);
                  $('#displayGivingDays').html(returnInvoice.data.givenDay);
                  $('#shipBy').val(returnInvoice.data.shipBy);
                  $('#trackingNumber').val(returnInvoice.data.trackingNumber);
                  $('td#labelForDueDate').text('Current Due Date');
                  $.ajax({
                      url: '/api/stores/' + returnInvoice.data.storeID,
                      type: 'GET',
                      success: function(storeInfo){
                          //console.log("got store info ", storeInfo)
                            if(storeInfo){
                                $('#newDueDate').html(moment(storeInfo.dueDate).format('MM/DD/YYYY'));
                            }
                        }
                      });
                  $('#invoiceDate').datetimepicker({
                        defaultDate: moment(returnInvoice.data.createDateTime).format('MM/DD/YYYY hh:mm A')
                  });

                  $('#chargeDate').datetimepicker({
                        defaultDate: moment(returnInvoice.data.chargeDateTime).format('MM/DD/YYYY hh:mm A')
                  });

                  $('#paidDate').datetimepicker({
                        defaultDate: moment(returnInvoice.data.paidDate).format('MM/DD/YYYY hh:mm A')
                  });

                  returnInvoice.data.InvoiceDetails.forEach(detail =>{
                      var rowValues = {
                          itemName: detail.productDetail,
                          qty: detail.qty,
                          unitPrice: detail.rate,
                          total: detail.total,
                          productType: detail.Product.productType,
                          dayCycle:detail.givenDay,
                          taxAmount: detail.taxAmount,
                          isTax: detail.isTax,
                          showTaxCheckbox: detail.isTax,
                          productId:detail.productID,
                          hardwareSerial:detail.hardwareSerial,
                          from: comeFrom
                      };
                      addRow(rowValues);
                  });

              }
            }
        });
}

$('#sameAddress').click(function(){

    if(document.getElementById('sameAddress').checked){
        $('#shippingName').val($('#businessName').text());
        $('#shippingBusinessName').val($('#businessName').text());
        $('#shippingAddress').val($('#address').text());
        $('#shippingCity').val($('#city').text());
        $('#shippingState').val($('#state').text());
        $('#shippingZipcode').val($('#zipcode').text());
    }else {
        $('#shippingName').val('');
        $('#shippingBusinessName').val('');
        $('#shippingAddress').val('');
        $('#shippingCity').val('');
        $('#shippingState').val('');
        $('#shippingZipcode').val('');
    }

});

function getCurrentDate(){
    $('#newDueDate').html(moment($storeInfo.dueDate).utc().format('MM/DD/YYYY'));
    $('td#labelForDueDate').text('Current Due Date');
}

function saveInvoice(){
    NProgress.start();
    var invoiceData = {
        createDateTime:$('#invoiceDate').val(),
        taxAmount:parseFloat($('#totalTaxAmount').text().replace("$","").replace(",","")),
        taxRate:parseFloat($storeInfo.State.taxCollect),
        invoiceAmount:parseFloat($('#subTotal').text().replace("$","").replace(",","")),
        chargeDateTime:$('#chargeDate').val(),
        paidDateTime:$('#paidDate').val(),
        storeID:parseInt($storeInfo.storeID),
        trackingNumber:$('#trackingNumber').val(),
        shipBy:$('#shipBy').val(),
        givenDay:parseInt($('#displayGivingDays').text()),
        shipName: $('#shippingName').val(),
        shipBusinessName: $('#shippingBusinessName').val(),
        shipAddress: $('#shippingAddress').val(),
        shipCity: $('#shippingCity').val(),
        shipState: $('#shippingState').val(),
        shipZipcode: $('#shippingZipcode').val(),
        invoiceDetails:[]
    }

        cartValues.forEach(value =>{

            var detailData = {
                productID: value.productId,
                productDetail: value.itemName,
                rate: value.unitPrice,
                total: value.total,
                qty: value.quantity,
                isTax: value.isTax,
                taxAmount: value.taxAmount,
                givenDay: value.givenDays,
                hardwareSerial: value.hardwareSerial
            }
            invoiceData.invoiceDetails.push(detailData)
        });
        console.log("invoice going to post ", invoiceData);
        var invoiceNumber =$ ('#invoiceTitle').attr('data-invoice');
        if(invoiceNumber == 0){

            $.ajax({
                url: '/api/invoice',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(invoiceData),
                dataType: 'json',
                success: function(result){
                    //console.log('result invoice ', result);
                    if (result){
                        $.magnificPopup.close();
                        showNotify('Invoice',  'Invoice was created','system');
                        reloadInvoices(comeFrom,result.data.data.storeID);
                        reloadActivity($storeInfo.storeID,1);
                    }else{
                        showNotify('Invoice',  'Unable to create invoice.','error');
                    }
                    //console.log("return values ", result)
                }
            }).always(function(){
                NProgress.done();
            });
    }else{
        $.ajax({
            url: '/api/invoice/' + invoiceNumber,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(invoiceData),
            dataType: 'json',
            success: function(result){

                if (result){
                    $.magnificPopup.close();
                    showNotify('Invoice',  'Invoice was created','system');
                    reloadInvoices(comeFrom);
                }else{
                    showNotify('Invoice',  'Unable to create invoice.','error');
                }
                //console.log("return values ", result)
            }
        }).always(function(){
            NProgress.done();
        });
    }
}


function updatePrice(){
    var unitPrice = parseFloat($('#unitPrice').val());
    var qty = parseFloat($('#qty').val());
    var total = qty * unitPrice;

    $('#total').val(total);

    console.log("here");

}



$("tbody").on("click",".removeBtn",function(e){
    $(this).closest("tr").remove();
    updateTotal();
});

function emailInvoice(data){
    bootbox.prompt({
        title: "This is the email address you want to send Invoice to?",
        inputType: 'email',
        value:$('#invoiceList').attr("data-invoiceEmail"),
        callback:function(result){
            NProgress.start();
                if(result){
                    var emailAddress={email:result};

                        $.ajax({
                            url: '/api/invoice/email/' + data,
                            type: 'POST',
                            data: emailAddress,
                            success: function(sendStatus){
                                console.log('sendStatus ', sendStatus);
                                     if(sendStatus.status){
                                         showNotify('Invoice Sent', "Invoice # " + data + " was sent to " + result + ".",'system');

                                     }else{
                                         showNotify('Failed to Sent Invoice', "Unable to sent Invoice # " + data + " to " + result + ".",'error');
                                     }

                                },
                            error: function (err){
                                console.log('error ', err);
                            }

                            });
                }
                NProgress.done();
            }
        });
}

function viewInvoice(id, storeId){
    //var href = "/invoice/" + id
    var href = `/noToken/${storeId}/${id}`
    window.open(href, 'newwindow', 'width=800, height=950');
}

function deleteInvoice(data,fromID){
    bootbox.prompt({
        title: "Reason why you want to delete this Invoice.",
        callback:function(result){
            NProgress.start();
                if(result){
                    var reason={reason:result};

                        $.ajax({
                            url: '/api/invoice/' + data,
                            type: 'DELETE',
                            data: reason,
                            success: function(deleteStatus){
                                     if(deleteStatus.status){
                                         showNotify('Delete Invoice', "Invoice # " + data + " was deleted.",'system');
                                         $('#' + data).remove();
                                         reloadDeletedInvoices();
                                        if(fromID){
                                             reloadActivity(fromID,1);
                                        }

                                     }else{
                                         showNotify('Failed to delete invoice', "Unable to delete invoice # " + data ,'error');
                                     }

                                }

                            });
                }
                NProgress.done();
            }
        });
}
