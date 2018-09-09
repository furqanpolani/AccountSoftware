var currentUserID = 0;

var leadForm = `
<div id='collectInvoice'>
    <div class='panel-body pn'>
        <div class='panel-heading'>
            <span class='panel-title hidden-xs'>
                <ul class='nav panel-tabs-border panel-tabs'>
                    <li class='active'>
                        <a href='#stripeCollect' data-toggle='tab'>Stripe</a>
                    </li>
                    <li>
                        <a href='#manualCollect' data-toggle='tab'>Manual</a>
                    </li>
                </ul>
            </span>
        </div>
        <div class='panel-body'>
            <div class='tab-content pn br-n'>
                <div id='stripeCollect' class='tab-pane active'>
                    <form id='stripe-collection' class='admin-form'>
                        <div class='col-md-6 form-group'>
                            <label class='field-label' for='stripe-payment'>Select Card
                                <em>*</em>
                            </label>
                            <select class='form-control' id='stripe-payment'></select>
                            <i class='arrow'></i>
                        </div>
                        <div class='col-md-6'>
                            <label class='field-label' for='stripe-paymentAmount'>Amount
                                <em>*</em>
                            </label>
                            <input class='form-control pull-right text-right paymentAmount' id='stripe-paymentAmount' type='text' name='invoiceAmount' readonly />
                        </div>
                    </form>
                </div>
                <div id='manualCollect' class='tab-pane'>
                    <form id='manual-collection' class='admin-form'>
                        <div class='col-md-6'>
                            <label class='field-label' for='paidDate'>Payment Date
                                <em>*</em>
                            </label>
                            <input class='form-control pull-right' id='paidDate' type='text' name='paidDate' />
                        </div>
                        <div class='col-md-6'>
                            <label class='field-label' for='paymentID'>Transaction ID
                                <em>*</em>
                            </label>
                            <input class='form-control' type='text' name='paymentID' />
                        </div>
                        <div class='col-md-6'>
                            <label class='field-label' for='mpaymentAmount'>Amount
                                <em>*</em>
                            </label>
                            <input class='form-control text-right paymentAmount' type='text' name='mpaymentAmount' readonly />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>`;

var leadDialog = null;

function getDialog(invoiceID){
    return bootbox.dialog({
        message: leadForm,
        title: "Collect Invoice # " + invoiceID ,
        onEscape: function() {
            dialog = null;
        },
        show: false,
        backdrop: true,
        closeButton: true,
        animate: true,
        className: "modal70",
        buttons: {
            success: {
                label: "Save Payment",
                className: "btn-primary",
                callback: function(result) {

                    var saveDone = saveLead();

                    if(!saveDone){
                        return false;
                    }

                }
            }
        }
    });
}





function collectInvoice1(invoiceID){

    if(leadDialog == null){
        leadDialog = getDialog(invoiceID);
    }

    function loadComboBoxes(){
        $.ajax({
            url: '/api/comboBoxByType',
            type: 'GET',
            success: function(result){

                result.forEach(list =>{
                    if(list.comboBoxTypeId == 3){
                        list.ComboBoxDetails.forEach(row =>{
                            $("#leadSoftware").append($("<option />").val(row.id).text(row.selector));
                        });
                    }

                    if(list.comboBoxTypeId == 7){
                        list.ComboBoxDetails.forEach(row =>{
                            $("#leadStatus").append($("<option />").val(row.id).text(row.selector));
                        });
                    }

                    if(list.comboBoxTypeId == 9){
                        list.ComboBoxDetails.forEach(row =>{
                            $("#leadSource").append($("<option />").val(row.id).text(row.selector));
                        });
                    }

                    if(list.comboBoxTypeId == 13){
                        list.ComboBoxDetails.forEach(row =>{
                            $("#leadFoundUs").append($("<option />").val(row.id).text(row.selector));
                        });
                    }
                });


            }
        });
    }

    function loadUser(){
        // $.ajax({
        //     url: '/api/user',
        //     type: 'GET',
        //     success: function(result){
        //         console.log(result)
        //         result.user.forEach(list =>{
        //             $("#leadAssignedTo").append($("<option />").val(list.userID).text(list.userName));
        //         });

        //         document.getElementById("leadAssignedTo").value = result.userData.userID;
        //         //$('#leadAssignedTo option[value=result.userData.userID]');
        //     }
        // });
    }

    leadDialog.init(function() {

            $('#mydatepicker').datetimepicker({
                defaultDate: new Date
            });

            loadComboBoxes();
            loadUser();

        leadDialog.modal('show');
    });
}
