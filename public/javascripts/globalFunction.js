function reloadTicket(id){
    NProgress.start();

        $.ajax({
            url:"/tickets/store/" + id,
            success: function(result){
            //console.log(result);
             $('#innerTicketDiv').html(result);
            }
        }).always(function(){
            NProgress.done();

        });
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function removePhoneMask(data){
    return data.replace('-','').replace('(','').replace(')','').replace(' ','')
}

function maskPhoneNumber(data){
    return '(' + data.substring(0, 3) + ') ' + data.substring(3, 6) + '-' +  data.substring(6, data.length)
}

function deleteLead(id){
    bootbox.confirm({
            message: "Are you sure? you want to delete this lead.",
            buttons:{
                    confirm:{
                        label:'YES'
                    },
                    cancel:{
                        label:'NO'
                    }
                },
        callback:function(result){
            
            if(result){
                
                $.ajax({
                    url: '/api/leads/' + id,
                    type: 'DELETE',
                    success: function(result){
                        if(result.code == 200){
                            window.location.replace('/leads')
                            showNotify('Lead Deleted',  'Failed to delelte the lead.','success');
                        }else{
                             
                            showNotify('Delete Lead',  'Failed to delelte the lead.','error');
                            
                        }

                    }
                });
                }else{
                    showNotify('Delete Lead',  'Failed to delelte the lead.','error');
                }
            }

    });
}

function giveUpdate(orgID){
        bootbox.confirm({
                title:"Update",
                message: "Are you sure? you want give update to #{store.data.businessName} and all other locations.",
                size: "medium",
                buttons:{
                        confirm:{
                            label: 'Give update'
                        },
                        cancel:{
                            label:'Cancel'
                        }
                    },
            callback:function(result){
                //console.log(orgID)
                if(result){
                    var data = {
                        organizationID: orgID
                    };

                    $.ajax({
                        url: '/api/stores/giveupdate',
                        type: 'POST',
                        data: data,
                        dataType: 'json',
                        success: function(result){
                            if(result.code == 200){
                                // reloadActivity(#{store.data.storeID},1);
                                showNotify('Update', 'Update Done!','system');
                                location.reload()
                            }else{
                                showNotify('Update','Failed to give update','error');
                            }

                        }
                    });
                    }else{
                        showNotify('Update','User press cancel','error');
                    }
                }
            });
}


function createReadyInvoice(id){
    NProgress.start();
        $.ajax({
            url: '/api/invoice/renew/' + id,
            type: 'POST',
            success: function(invoiceStatus){
                console.log('invoiceStatus ', invoiceStatus)
                     if(invoiceStatus.status){
                        showNotify('Create', "Invoice was created.",'system');
                        $.showLoading({name: 'line-scale'});
                        location.reload();

                     }else{
                         showNotify('Failed', "Unable to create a invoice",'error');
                     }

                },
                error: function(err){
                    console.log("error on renew invoice ", err)
                }

                }).always(function(){
                    NProgress.done();
            });
}

function createLead(){

    $.magnificPopup.open({
     removalDelay: 500,
     items: {
       src: '#lead-form'
     },
     callbacks:{
        beforeOpen: function(e){
            this.st.mainClass = 'mfp-slideDown';
        },
        open: function(){

        },
        close: function(){
            //emptyTicket();
        }

     },
     midClick: true,
     closeOnBgClick: false
     });
      $('#lead-form').draggable();
}

function createTask(){

    $.magnificPopup.open({
     removalDelay: 500,
     items: {
       src: '#task-form'
     },
     callbacks:{
        beforeOpen: function(e){
            this.st.mainClass = 'mfp-slideDown';
        },
        open: function(){

        },
        close: function(){
            //emptyTicket();
        }

     },
     midClick: true,
     closeOnBgClick: false
     });
      $('#task-form').draggable();
}
