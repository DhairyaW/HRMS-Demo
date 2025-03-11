public with sharing class LeaveController {
    @AuraEnabled(cacheable=true)
    public static List<Leave__c> getLeaveRecords(String searchString) {
        String searchKey = '%' + searchString + '%';
        
        List<Leave__c> leaveRecords = new List<Leave__c>();
        leaveRecords = Database.query('SELECT Id, Employee__c, Name, Leave_Start_Date__c, Leave_End_Date__c, Duration__c, Reason__c FROM Leave__c WHERE Reason__c LIKE :searchKey');
        System.debug(leaveRecords);
        return leaveRecords;
    }

    // @AuraEnabled
    // public static Leave__c leaveRecMethod(Leave__c leaveRec){
    //     try {
    //         System.debug('leaveRec...'+leaveRec);
    //         insert leaveRec;
    //         return leaveRec;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}