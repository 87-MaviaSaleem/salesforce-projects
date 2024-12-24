trigger UpdateAccountProds on Opportunity (After insert) {
      if(trigger.isInsert && trigger.isAfter){
    UpdateAccountProd.updateAccountProducts(trigger.new);
    }
}