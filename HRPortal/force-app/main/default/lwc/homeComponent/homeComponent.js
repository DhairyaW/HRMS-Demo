import { LightningElement,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Employee__c.Employee_Name__c';
import EMAIL_FIELD from '@salesforce/schema/Employee__c.Employee_Email__c';
import PHONE_FIELD from '@salesforce/schema/Employee__c.Employee_Phone__c';
import BIRTHDATE_FIELD from '@salesforce/schema/Employee__c.Employee_Birthdate__c';
import JOININGDATE_FIELD from '@salesforce/schema/Employee__c.Employee_Joining_Date__c';
import CODE_FIELD from '@salesforce/schema/Employee__c.Employee_Code__c';
import GENDER_FIELD from '@salesforce/schema/Employee__c.Gender__c';
import HNAME_FIELD from '@salesforce/schema/Holiday__c.Holiday_Name__c';
import HDATE_FIELD from '@salesforce/schema/Holiday__c.Holiday_Date__c';
import PHOLIDAY_FIELD from '@salesforce/schema/Holiday__c.Public_Holiday__c';

export default class HomeComponent extends LightningElement {
    @track isShowEmployeeModal = false;
    @track isShowHolidayModal = false;

    Employeefields = [NAME_FIELD, EMAIL_FIELD, PHONE_FIELD, GENDER_FIELD, BIRTHDATE_FIELD, JOININGDATE_FIELD, CODE_FIELD];
    holidayFields = [HNAME_FIELD, HDATE_FIELD, PHOLIDAY_FIELD];

    handleAddEmployee(){
        this.isAddEmployeeClicked = true;
        console.log('isAddEmployeeClicked = '+this.isAddEmployeeClicked);        
    }

    handleAddHoliday(){
        this.isAddHolidayClicked = true;
        console.log('isAddHolidayClicked = '+this.isAddHolidayClicked);
    }

    showEmployeeModalBox() {  
        this.isShowEmployeeModal = true;
    }

    showHolidayModalBox(){
        this.isShowHolidayModal = true;
    }

    hideEmployeeModalBox() {  
        this.isShowEmployeeModal = false;
    }

    hideHolidayModalBox(){
        this.isShowHolidayModal = false;
    }

    handleAddEmployeeSuccess(event){
        const evt = new ShowToastEvent({
            title: 'Employee created!',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }

    handleAddEmployeeSuccess(event){
        const evt = new ShowToastEvent({
            title: 'Holiday created!',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}