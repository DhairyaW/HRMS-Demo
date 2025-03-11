public with sharing class AccountHierarchyController {
    @AuraEnabled(cacheable=true)
    public static UserHierarchyNode getHierarchyData() {
        // Fetch fields from the field set
        Map<String, Schema.FieldSetMember> tooltipFields = getFieldSetFields('User', 'User_Tooltip_Fields');
        System.debug('tooltipFields...'+tooltipFields);
        List<String> fieldSetApiNames = new List<String>(tooltipFields.keySet());
        System.debug('fieldSetApiNames...'+fieldSetApiNames);

        // Build dynamic SOQL query
        String baseQuery = 'SELECT Id, Name, ManagerId, UserRole.Name, Profile_image__c, MobilePhone';
        for (String field : fieldSetApiNames) {
            if (!baseQuery.contains(field)) {
                baseQuery += ', ' + field;
            }
        }
        baseQuery += ' FROM User WHERE IsActive = TRUE AND Name NOT IN (\'Platform Integration\', \'Platform Integration User\', \'Automated Process\', \'Data.com Clean\')';

        // Execute dynamic SOQL query
        List<User> users = Database.query(baseQuery);

        System.debug('users...'+users);
        // Map to store user nodes
        Map<Id, UserHierarchyNode> userMap = new Map<Id, UserHierarchyNode>();
        System.debug('userMap...'+userMap);
        UserHierarchyNode ceoNode = null;

        // Process each user and create UserHierarchyNode
        for (User user : users) {
            Map<String, String> tooltipData = new Map<String, String>();
            for (String fieldName : fieldSetApiNames) {
                // Populate tooltip data dynamically
                tooltipData.put(fieldName, (String) user.get(fieldName));
            }

            userMap.put(user.Id, new UserHierarchyNode(
                user.Id, 
                user.Name, 
                user.ManagerId, 
                user.UserRole != null ? user.UserRole.Name : 'No Role', 
                user.Profile_image__c, 
                user.MobilePhone, 
                tooltipData // Pass tooltip data here
            ));
        }

        // Identify the CEO (root node)
        for (UserHierarchyNode node : userMap.values()) {
            if (node.managerId == null) {
                ceoNode = node;
                break;
            }
        }

        // Build the hierarchy tree
        for (UserHierarchyNode node : userMap.values()) {
            if (node.managerId != null && userMap.containsKey(node.managerId)) {
                userMap.get(node.managerId).children.add(node);
            }
        }

        return ceoNode;
    }

    public static Map<String, Schema.FieldSetMember> getFieldSetFields(String sObjectType, String fieldSetName) {
        System.debug('sObjectType...'+sObjectType);
        System.debug('fieldSetName...'+fieldSetName);
        Map<String, Schema.FieldSetMember> fields = new Map<String, Schema.FieldSetMember>();

        System.debug('fields...'+fields);
        // Use the correct syntax to retrieve the field set
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(sObjectType).getDescribe();
        System.debug('describeResult...'+describeResult);
        Schema.FieldSet fieldSet = describeResult.fieldSets.getMap().get(fieldSetName);
        System.debug('fieldSet...'+fieldSet);
        for (Schema.FieldSetMember field : fieldSet.getFields()) {
            fields.put(field.getFieldPath(), field);
        }
        return fields;
    }

    // UserHierarchyNode class
    public class UserHierarchyNode {
        @AuraEnabled public String id;
        @AuraEnabled public String name;
        @AuraEnabled public String managerId;
        @AuraEnabled public String role;
        @AuraEnabled public String profileImage;
        @AuraEnabled public String phone;
        @AuraEnabled public Map<String, String> tooltipData; // Tooltip fields and their values
        @AuraEnabled public List<UserHierarchyNode> children = new List<UserHierarchyNode>();

        public UserHierarchyNode(String id, String name, String managerId, String role, String profileImage, String phone, Map<String, String> tooltipData) {
            this.id = id;
            this.name = name;
            this.managerId = managerId;
            this.role = role;
            this.profileImage = profileImage;
            this.phone = phone;
            this.tooltipData = tooltipData; // Initialize tooltip data
        }
    }
}