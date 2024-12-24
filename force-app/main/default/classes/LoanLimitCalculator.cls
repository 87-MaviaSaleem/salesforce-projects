public class LoanLimitCalculator {
   public Decimal calculateTotalActiveLoans(Id committeeId) {
        Decimal totalAmount = 0;

        AggregateResult[] results = [
            SELECT SUM(Active_Loan_Amount__c) totalAmount
            FROM Loan__c
            WHERE Status__c = 'Active'
            AND Account_Credit_Board_Committee__c = :committeeId
        ];
        
        if (!results.isEmpty()) {
            totalAmount = (Decimal) results[0].get('totalAmount');
        }
        
        return totalAmount;
    }
}