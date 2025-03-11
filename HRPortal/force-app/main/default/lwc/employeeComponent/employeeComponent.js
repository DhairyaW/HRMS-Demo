import { LightningElement, wire, track } from 'lwc';
import getEmployeeList from '@salesforce/apex/EmployeeController.getEmployeeList';
import getEmployeeBankDetails from '@salesforce/apex/EmployeeController.getEmployeeBankDetails';
import getNewJoiners from '@salesforce/apex/EmployeeController.getNewJoiners';

export default class EmployeeComponent extends LightningElement {
    allEmployees;
    error;
    numOfEmployees;
    newJoiners;
    records = [];
    @track isEmployeeSelected = false;
    @track bankInfo;

    @track selectedEmployeeId = '';

    allEmployeeColumns = [
        {label: 'Employee Code', fieldName: 'Employee_Code__c', type: 'text'},
        {label: 'Employee Name', fieldName: 'Employee_Name__c', type: 'text'},
        {label: 'Joining Date', fieldName: 'Employee_Joining_Date__c', type: 'date'},
        {label: 'Gender', fieldName: 'Gender__c', type: 'text'},
        {label: 'Email ID', fieldName: 'Employee_Email__c', type: 'email'},
        {label: 'DOB', fieldName: 'Employee_Birthdate__c', type: 'date'}
    ];

    bankInfoColumns = [
        {label: 'Bank Account Number', fieldName: 'Bank_Account__c', type: 'number'},
        {label: 'ESI Account', fieldName: 'ESI_Account__c', type: 'number'},
        {label: 'PF Account', fieldName: 'PF_Account__c', type: 'number'},
        {label: 'Salary', fieldName: 'Salary__c', type: 'number'},
    ];

    @wire (getEmployeeList) 
    employees({error, data}){
        if(data){
            this.allEmployees = data;
            this.numOfEmployees = this.allEmployees.length;
            this.records = data.map(record => ({
                label: record.Employee_Name__c,
                value: record.Id
            }));
            this.error = undefined;
        } else if(error){
            this.error = error;
            this.allEmployees = undefined;
        } 
    }

    @wire (getEmployeeBankDetails ,{employeeId: '$selectedEmployeeId'})
    employeeBankDetails({error, data}){
        if(data){
            this.bankInfo = data;
            console.log('bankInfo: '+JSON.stringify(this.bankInfo));
            error = undefined;
        } else if(error){
            this.error = error;
            this.bankInfo = undefined;
        }
    }

    @wire (getNewJoiners)
    newJoinersNumber({error, data}){
        if(data){
            this.newJoiners = data;
            console.log('newJoiners: '+JSON.stringify(this.newJoiners));
            this.error = undefined;
        } else if(error){
            this.error = error;
            this.newJoiners = undefined;
        }
    }


    get employeeNames(){
        return [
            { label: 'choose one...', value: '' }, 
            ...this.records
        ];
    }

    handleEmployeeChange(event){
        this.selectedEmployeeId = event.target.value;
        console.log('selectedEmployeeId...'+this.selectedEmployeeId);
        this.isEmployeeSelected = true;
        console.log('isEmployeeSelected: '+this.isEmployeeSelected);
        // getEmployeeBankDetails({employeeId: this.selectedEmployeeId})
        // .then(data => {
        //     this.bankInfo = data;
        //     console.log('bankInfo: '+JSON.stringify(this.bankInfo));
        // })
        // .catch(error => {
        //     console.log('error: '+JSON.stringify(error));
        // });
        
    }
}