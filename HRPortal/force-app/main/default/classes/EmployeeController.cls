public with sharing class EmployeeController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeList(){
        return [SELECT Id, Name, Employee_Name__c, Employee_Code__c, Employee_Joining_Date__c, Employee_Leaving_Date__c, Employee_Birthdate__c, Employee_Email__c, Employee_Phone__c, Gender__c, Reason_Of_Leaving__c FROM Employee__c];
    }

    @AuraEnabled(cacheable=true)
    public static Bank_Detail__c getEmployeeBankDetails(String employeeId){
        System.debug('employeeId...'+employeeId);
        Bank_Detail__c bankDetail = [SELECT Id, Bank_Account__c, ESI_Account__c, PF_Account__c, Salary__c FROM Bank_Detail__c WHERE Employee__c=:employeeId LIMIT 1];
        System.debug('bank details...'+JSON.serializePretty(bankDetail));
        return bankDetail;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getNewJoiners(){
        Date today = System.today();
        Date firstDayOfLastMonth = today.toStartOfMonth().addMonths(-1);
        Date lastDayOfLastMonth = today.toStartOfMonth().addDays(-1);
        System.debug('firstDayOfLastMonth...'+firstDayOfLastMonth);
        System.debug('lastDayOfLastMonth...'+lastDayOfLastMonth);
        Integer newJoiners = [SELECT count() FROM Employee__c WHERE Employee_Joining_Date__c >= :firstDayOfLastMonth AND Employee_Joining_Date__c <= :lastDayOfLastMonth ];
        System.debug('newJoiners...'+newJoiners);
        return newJoiners;
    }
}