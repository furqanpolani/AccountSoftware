function reloadContact(fromID,typeID){
    NProgress.start();
        $.ajax({
            url:"/contacts/" + fromID + "/" + typeID,
            success: function(result){
                console.log("getting data back ", result);
             $('#contactDiv').html(result);
            }
        }).always(function(){
            NProgress.done();
        });
}

function editContact(id,fromID,typeID){
    //if(contactDialog == null){
        contactDialog = getDialog("Edit Contact",fromID,typeID);
    //}

    contactDialog.init(function() {

        $('#callerName1').prop("readOnly", true);
        $('#contactNumber1').prop("readOnly", true);
        $('#emailAddress1').prop("readOnly", true);
        $('#contactNote').prop("readOnly", true);

        $('.saveButton').hide();
        $('.updateButton').hide();
        $('.editButton').css("float","left");

        $.ajax({
            url: '/api/contact/' + id ,
            type: 'GET',
            success: function(contactData){
                console.log(contactData)
                 if(contactData.status){
                     $('#callerName1').val(contactData.data.Contact.name);
                     $('#contactNumber1').val(contactData.data.Contact.phoneNumber);
                     $('#emailAddress1').val(contactData.data.Contact.email);
                     $('#contactNote').val(contactData.data.Contact.note);
                     $('#contactID').val(contactData.data.contactID);
                 }
                }

            });

        contactDialog.modal('show');
    });
}

var contactDialog = null;



function getDialog(title,fromID,typeID){
    console.log("fromID", fromID)
    return bootbox.dialog({
      message: contactForm,
      title: title,
      size: "small",
      onEscape: function() {
          //contactDialog = null
          },
      show: false,
      backdrop: true,
      closeButton: true,
      animate: true,
      className: "my-modal",
      buttons: {
          editButton: {
                label: "Edit",
                className:"btn-default editButton",
                callback: function(result){
                    $('#callerName1').prop("readOnly", false);
                    $('#contactNumber1').prop("readOnly", false);
                    $('#emailAddress1').prop("readOnly", false);
                    $('#contactNote').prop("readOnly", false);

                    $('.saveButton').prop("disabled", false);
                    showNotify('Edit Mode', "Contact is in edit mode now.",'primary');
                    $('.updateButton').show();
                    $('.editButton').hide();
                    return false
                }
        },
        cancel: {
          label: "Close",
          className: "btn-default cancelButton",
          callback: function(result){

          }
        },
        success: {
          label: "Save",
          className: "btn-primary saveButton",
          callback: function(result){

              saveContact(result,fromID,typeID);
          }
        },
        updateButton: {
          label: "Update",
          className: "btn-primary updateButton",
          callback: function(result){

              updateContact(result,fromID,typeID,$('#contactID').val());
          }
        }



      }
    });
}

function saveContact(result,fromID,typeID){

    var contactData = {
        name:$('#callerName1').val(),
        phoneNumber:$('#contactNumber1').val(),
        email: $('#emailAddress1').val(),
        fromID:fromID,
        typeID:typeID,
        note: $('#contactNote').val()
    }

    console.log("contact DATA ", contactData)
 if (contactData.name){
     NProgress.start();
         if(result){

                 $.ajax({
                     url: '/api/contact/',
                     type: 'POST',
                     data: contactData,
                     success: function(contactCreated){
                         console.log("contact create data ", contactCreated)
                              if(contactCreated.status){
                                  showNotify('Contact', "Contact was created.",'system');
                                  reloadContact(fromID,typeID);
                                  //reloadDeletedInvoices();
                                  //reloadActivity(#{store.data.storeID},1);

                              }else{
                                  showNotify('Failed', "Unable to create a contact",'error');
                              }

                         }

                     });
         }
         NProgress.done();
 }else{
 showNotify('Contact', 'Missing contact Name','primary');
 return false;
 }
}

function updateContact(result,fromID,typeID,id){

    var contactData = {
        name:$('#callerName1').val(),
        phoneNumber:$('#contactNumber1').val(),
        email: $('#emailAddress1').val(),
        fromID:fromID,
        typeID:typeID,
        note: $('#contactNote').val()
    }
    console.log("sending data ", contactData);

 if (contactData.name){
     NProgress.start();
         if(result){

                 $.ajax({
                     url: '/api/contact/' + id,
                     type: 'PUT',
                     data: contactData,
                     success: function(contactCreated){
                         console.log(contactCreated)
                              if(contactCreated.status){
                                  showNotify('Update', "Contact was created.",'system');
                                  //reloadContact(fromID,typeID);
                                  //reloadDeletedInvoices();
                                  //reloadActivity(#{store.data.storeID},1);

                              }else{
                                  showNotify('Failed', "Unable to create a contact",'error');
                              }

                         }

                     });
         }
         NProgress.done();
 }else{
 showNotify('Contact', 'Missing contact Name','error');
 return false;
 }
}

var contactForm = `<div class='admin-form theme-primary' id='comment1'>
        <form id='form-comment1'>
            <div class='panel-body pn'>
                <div class='section row'>
                    <div class='col-md-12'>
                        <label for='callerName1' class='field prepend-icon'>
                            <input type='text' name='callerName1' id='callerName1' class='gui-input' placeholder='Contact name'>
                            <label for='callerName1' class='field-icon'><i class='fa fa-user'></i>
                            </label>
                        </label>
                    </div>
                </div>
                <div class='section row'>
                    <div class='col-md-12'>
                        <label for='contactNumber1' class='field prepend-icon'>
                            <input type="text" min="0" name='contactNumber1' id='contactNumber1' class='gui-input' onkeypress='return event.charCode >= 48 && event.charCode <= 57' placeholder='Phone number'>
                            <label for='contactNumber1' class='field-icon'><i class='fa fa-phone'></i>
                            </label>
                        </label>
                    </div>
                </div>
                <div class='section row'>
                    <div class='col-md-12'>
                        <label for='emailAddress1' class='field prepend-icon'>
                            <input type='email' name='emailAddress' id='emailAddress1' class='gui-input' placeholder='Email address'>
                            <label for='emailAddress1' class='field-icon'><i class='fa fa-envelope'></i>
                            </label>
                        </label>
                    </div>
                </div>
                <div class='section row'>
                    <div class='col-md-12'>
                        <textarea  name='contactNote' id='contactNote' class='form-control' placeholder='Note' rows='4'></textarea>
                        <input type='hidden' name='contactID' id='contactID' class='gui-input'>
                    </div>
                </div>
            </div>
        </form>
</div>`



function addContact(title,fromID,typeID){
    //if(contactDialog == null){
        contactDialog = getDialog("Add Contact",fromID,typeID);
    //}

    contactDialog.init(function() {

        $('.saveButton').show();
        $('.editButton').hide();
        $('.updateButton').hide();
        contactDialog.modal('show');
    });
}
