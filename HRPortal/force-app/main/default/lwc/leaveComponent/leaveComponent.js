import { LightningElement, wire, track } from 'lwc';
import getLeaveRecords from '@salesforce/apex/LeaveController.getLeaveRecords';
// import leaveRecMethod from '@salesforce/apex/LeaveController.leaveRecMethod';
import Employee_FIELD from '@salesforce/schema/Leave__c.Employee__c';
import LeaveStartDate_FIELD from '@salesforce/schema/Leave__c.Leave_Start_Date__c';
import LeaveEndDate_FIELD from '@salesforce/schema/Leave__c.Leave_End_Date__c';
import LeaveDuration_FIELD from '@salesforce/schema/Leave__c.Duration__c';
import LeaveReason_FIELD from '@salesforce/schema/Leave__c.Reason__c';

export default class LeaveComponent extends LightningElement {
    // @track employeeId = Employee_FIELD;
    // @track leaveStartDate = LeaveStartDate_FIELD;
    // @track leaveEndDate = LeaveEndDate_FIELD;
    // @track LeaveDuration = LeaveDuration_FIELD;
    // @track leaveReason = LeaveReason_FIELD;

    // recLeave = {
    //     Employee__c : this.employeeId,
    //     Leave_Start_Date__c : this.leaveStartDate,
    //     Leave_End_Date__c : this.leaveEndDate,
    //     Duration__c : this.leaveDuration,
    //     Reason__c : this.leaveReason
    // }

    leaveFields = [Employee_FIELD, LeaveStartDate_FIELD, LeaveEndDate_FIELD, LeaveDuration_FIELD, LeaveReason_FIELD];

    @track searchString = '';
    @track leaveRecords;
    @track isNewLeaveButtonDisabled = false;
    // @track showNewLeaveModal = false;
    @track isShowModal = false;
    error;

    columns = [
        { label: 'Employee Id', fieldName: 'Employee__c', type: 'text' },
        { label: 'Leave Id', fieldName: 'Name', type: 'text' },
        { label: 'Leave Start Date', fieldName: 'Leave_Start_Date__c', type: 'date' },
        { label: 'Leave End Date', fieldName: 'Leave_End_Date__c', type: 'date' },
        { label: 'Leave Duration', fieldName: 'Duration__c', type: 'text' },
        { label: 'Leave Reason', fieldName: 'Reason__c', type: 'text' }
    ];

    @wire(getLeaveRecords, {searchString: '$searchString'})
    wiredLeaves({error, data}) {
        if (data) {
            this.leaveRecords = data;
            console.log('leaveRecords...'+JSON.stringify(this.leaveRecords));
            
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('error...'+JSON.stringify(this.error));
            
            this.leaveRecords = undefined;
        }
    }

    handleSearch(event){
        this.searchString = event.target.value;
        console.log('searchString...'+this.searchString);
    }

    newLeave(){
        this.isNewLeaveButtonDisabled = true;
        console.log('isNewLeaveButtonDisabled...'+this.isNewLeaveButtonDisabled);
        this.showNewLeaveModal = true;
        this.isShowModal = true;
        
    }

    // handleEmployeeIdChange(event){
    //     this.recLeave.Employee__c = event.target.value;
    //     console.log('Employee__c...'+this.recLeave.Employee__c);
    // }

    // handleLeaveStartChange(event){
    //     this.recLeave.Leave_Start_Date__c = event.target.value;
    //     console.log('Leave_Start_Date__c...'+this.recLeave.Leave_Start_Date__c);
    // }

    // handleLeaveEndChange(event){
    //     this.recLeave.Leave_End_Date__c = event.target.value;
    //     console.log('Leave_End_Date__c...'+this.recLeave.Leave_End_Date__c);
    // }

    // handleDurationChange(event){
    //     this.recLeave.Duration__c = event.target.value;
    //     console.log('Duration__c...'+this.recLeave.Duration__c);
    // }

    // handleReasonChange(event){
    //     this.recLeave.Reason__c = event.target.value;
    //     console.log('Reason__c...'+this.recLeave.Reason__c);
    // }

    // createLeaveRec(){
    //     console.log('recLeave...'+JSON.stringify(this.recLeave));
        
    //     leaveRecMethod({leaveRec: this.recLeave});
    //     const toastEvent = new ShowToastEvent({
    //         title: 'Success',
    //         message: 'Leave created successfully',
    //         variant: 'success'
    //     });
    //     this.dispatchEvent(toastEvent);
    //     this.showNewLeaveModal = false;
    //     this.isNewLeaveButtonDisabled = false;
    //     this.searchString = '';
    //     console.log('recTask...'+JSON.stringify(this.recTask));
    // }

    hendleCancel(){
        // this.showNewLeaveModal = false;
        this.isNewLeaveButtonDisabled = false;
    }

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
        this.isNewLeaveButtonDisabled = false;
    }

    handleAddEmployeeSuccess(event){
        const evt = new ShowToastEvent({
            title: 'Leave Record Created!',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}