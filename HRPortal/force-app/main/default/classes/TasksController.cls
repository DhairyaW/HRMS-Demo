public with sharing class TasksController {
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks(String searchString) {
        String searchKey = '%' + searchString + '%';
        
        List<Task> tasks = new List<Task>();
        tasks = Database.query('SELECT Id, Subject, Status, Description, Priority FROM Task WHERE Subject LIKE :searchKey');
        System.debug(tasks);
        return tasks;
    }

    @AuraEnabled
    public static Task taskRecMethod(Task taskRec){
        try {
            System.debug('taskRec...'+taskRec);
            insert taskRec;
            return taskRec;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}