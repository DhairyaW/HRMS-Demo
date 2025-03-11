public with sharing class ExpenseClaimsController {
    @AuraEnabled(cacheable=true)
    public static List<Expense_Claim__c> getExpenseClaims(String searchString) {
        String searchKey = '%' + searchString + '%';
        
        List<Expense_Claim__c> ExpenseClaims = new List<Expense_Claim__c>();
        ExpenseClaims = Database.query('SELECT Id, Name, Claim_Type__c, Claim_Date__c, Claim_Amount__c, Approved__c, Cleared__c FROM Expense_Claim__c WHERE Claim_Type__c LIKE :searchKey');
        System.debug(ExpenseClaims);
        return ExpenseClaims;
    }

    // @AuraEnabled
    // public static Expense_Claim__c ExpenseClaimRecMethod(Expense_Claim__c ExpenseClaimRec){
    //     try {
    //         System.debug('ExpenseClaimRec...'+ExpenseClaimRec);
    //         insert ExpenseClaimRec;
    //         return ExpenseClaimRec;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}