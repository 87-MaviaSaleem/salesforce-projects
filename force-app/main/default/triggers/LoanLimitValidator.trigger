trigger LoanLimitValidator on Loan__c (before insert, before update) {

    Map<Id, Decimal> committeeLoanAmounts = new Map<Id, Decimal>();
     Map<Id, Account> accMap;
    List<Id> accIds=new List<ID>();
 for (Loan__c loan : Trigger.New) {
            if (loan.AccountId__c != null) {
            accIds.add(loan.AccountId__c);
               
         }
    }
    
    if(accIds != null){
       accMap= new  Map<Id, Account>([Select Id,Credit_Board_Committee__c from Account where Id in : accIds ]);
    }
    
    Set<Id> committeeIds = new Set<Id>();
   for (Loan__c loan : Trigger.New) {
            if (loan.AccountId__c != null) {
            committeeIds.add(accMap.get(loan.AccountId__c).Credit_Board_Committee__c);
                              
        }
    }
    LoanLimitCalculator calculator = new LoanLimitCalculator();
    
    for (Id committeeId : committeeIds) {
        committeeLoanAmounts.put(committeeId, calculator.calculateTotalActiveLoans(committeeId));
      
    }

    Map<Id, Decimal> committeeApprovedLimits = new Map<Id, Decimal>();
    if (!committeeIds.isEmpty()) {
       
        List<Credit_Board_Committee__c> committees = [
            SELECT Id, Approved_Lending_Limit__c
            FROM Credit_Board_Committee__c
            WHERE Id IN :committeeIds
            ];
          
        for (Credit_Board_Committee__c committee : committees) {
            committeeApprovedLimits.put(committee.Id, committee.Approved_Lending_Limit__c);
        }
    }
    for (Loan__c loan : Trigger.New) {
        Id committeeId = accMap.get(loan.AccountId__c).Credit_Board_Committee__c;
        Decimal approvedLimit = committeeApprovedLimits.get(committeeId);
        Decimal totalAmount = committeeLoanAmounts.get(committeeId) + loan.Active_Loan_Amount__c;
        
        if (totalAmount > approvedLimit) {
            loan.addError('Lending limit exceeded for Credit Board Committee');
        }
    }
}