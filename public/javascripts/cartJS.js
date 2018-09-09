function deleteRow(){
    console.log('before itemInCart ', itemInCart);

    var deleteId = $('#cartNumber').attr('data-id');
    for (var i = 0; i < itemInCart.length; i++) {
        //console.log(itemInCart[i]);
        if(itemInCart[i].id === deleteId){
            itemInCart.splice(i,1);
        }
    }

    console.log('after itemInCart ', itemInCart);


    $( '#' + deleteId ).remove();
    $.magnificPopup.close();
    updateTotal()
}

function saveCartChange(){

    var updateData = {
        id: $('#cartNumber').attr('data-id'),
        rate: parseFloat($('#price').val()),
        productName: $('#itemName').val(),
        taxAmount: parseFloat($('#cartTaxAmount').val()),
        isTax: $('#taxApply').is(":checked"),
        total: parseFloat($('#price').val()),
    };

    updateArray(updateData)
    $.magnificPopup.close();
    updateTotal()

    // rowValues = {
    //     id: rowID,
    //     productID: product.data.productID,
    //     productName: product.data.productDetail,
    //     productAmount: product.data.amount,
    //     productTaxAmount: product.data.amount * stateTaxValue / 100
    // }
    //
    // addItemRow(rowValues);
    //
    // itemInCart.push(rowValues);

    var htmlTableRow = `<tr class='animated fadeInDown' id=` + updateData.id + ` onclick='editCart(this)'>
    <td class="text-left">1x</td>
    <td class="text-left itemName" is-tax=`+ updateData.isTax +` tax-amount=`+ updateData.taxAmount +`><div>` + updateData.productName + `</div><div class="text-muted"><span>Tax: </span><span class="currency">` + updateData.taxAmount + `</span></div></td>
    <td class="text-right currency price">` + updateData.rate + `</td>
    </tr>`

    $('#' + updateData.id).replaceWith(htmlTableRow);
    $('.currency').formatCurrency();

}

function applyTax(){

    if ($('#taxApply').is(":checked")){
        if(stateTaxValue > 0){
            var price = parseFloat($('#price').val())
            var taxAmount = price * stateTaxValue / 100
            taxAmount = taxAmount.toFixed(2);
            $('#cartTaxAmount').val(taxAmount)
        }

    }else{
        $('#cartTaxAmount').val(0)
    }

}

function updateArray(data){

    // data = {
    //     id: r9392399329,
    //     itemName: Name,
    //     price: 239
    // }

    var inArray = false;
    for (var i = 0; i < itemInCart.length; i++) {

        if(itemInCart[i].id === data.id){
            itemInCart[i] = data;
            inArray = true
        }
    }
        if(inArray === false){
          itemInCart.push(data);
        }
}
