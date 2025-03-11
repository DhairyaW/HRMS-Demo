import { LightningElement, wire, track } from 'lwc';
import getExpenseClaims from '@salesforce/apex/ExpenseClaimsController.getExpenseClaims';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ClaimType_FIELD from '@salesforce/schema/Expense_Claim__c.Claim_Type__c';
import ClaimDate_FIELD from '@salesforce/schema/Expense_Claim__c.Claim_Date__c';
import ClaimAmount_FIELD from '@salesforce/schema/Expense_Claim__c.Claim_Amount__c';

const columns = [
    { label: 'Claim Id', fieldName: 'Name', type: 'text' },
    { label: 'Claim Type', fieldName: 'Claim_Type__c', type: 'text' },
    { label: 'Claim Date', fieldName: 'Claim_Date__c', type: 'date' },
    { label: 'Claim Amount', fieldName: 'Claim_Amount__c', type: 'number' },
    { label: 'Claim Approved', fieldName: 'Approved__c', type: 'text' },
    { label: 'Claim Cleared', fieldName: 'Cleared__c', type: 'text' }
];

export default class ExpenseClaimsComponent extends LightningElement {
    // @track claimType = ClaimType_FIELD;
    // @track claimDate = ClaimDate_FIELD;
    // @track claimAmount = ClaimAmount_FIELD;
    // @track claimApproved = ClaimApproved_FIELD;
    // @track claimCleared = ClaimCleared_FIELD;

    // recExpenseClaim = {
    //     Claim_Type__c : this.claimType,
    //     Claim_Date__c : this.claimDate,
    //     Claim_Amount__c : this.claimAmount,
    //     Approved__c : this.claimApproved,
    //     Cleared__c : this.claimCleared
    // }

    expenseClaimFields = [ClaimType_FIELD, ClaimDate_FIELD, ClaimAmount_FIELD];
    
    @track searchString = '';
    @track ExpenseClaims;
    @track isShowModal = false;
    columns = columns;
    result;
    error;

    // @track showNewExpenseClaimModal = false;
    @track isNewExpenseClaimButtonDisabled = false;

    @wire(getExpenseClaims, {searchString: '$searchString'})
    wiredExpenseClaims({error, data}) {
        if (data) {
            this.ExpenseClaims = data;
            console.log('ExpenseClaims...'+JSON.stringify(this.ExpenseClaims));
            
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('error...'+JSON.stringify(this.error));
            
            this.ExpenseClaims = undefined;
        }
    }

    handleSearch(event){
        this.searchString = event.target.value;
        console.log('searchKey...'+this.searchString);
    }

    // handleTypeChange(event){
    //     console.log('event.target.value...'+event.target.value);
        
    //     this.recExpenseClaim.Claim_Type__c = event.target.value;
    // }

    // handleDateChange(event){
    //     this.recExpenseClaim.Claim_Date__c = event.target.value;
    // }

    // handleAmountChange(event){
    //     this.recExpenseClaim.Claim_Amount__c = event.target.value;
    // }

    // createExpenseClaimRec(){
    //     console.log('recExpenseClaim...'+JSON.stringify(this.recExpenseClaim));
        
    //     ExpenseClaimRecMethod({ExpenseClaimRec: this.recExpenseClaim});
    //     const toastEvent = new ShowToastEvent({
    //         title: 'Success',
    //         message: 'Expense Claim created successfully',
    //         variant: 'success'
    //     });
    //     this.dispatchEvent(toastEvent);
    //     this.showNewExpenseClaimModal = false;
    //     this.isNewExpenseClaimButtonDisabled = false;
    //     this.searchString = '';
    //     console.log('recExpenseClaim...'+JSON.stringify(this.recExpenseClaim));
    // }

    // newExpenseClaim(){
    //     this.isNewExpenseClaimButtonDisabled = true;
    //     this.showNewExpenseClaimModal = true;
    // }

    handleCancel(){
        // this.showNewExpenseClaimModal = false;
        this.isNewExpenseClaimButtonDisabled = false;
    }

    showModalBox() {  
        this.isShowModal = true;
        this.isNewExpenseClaimButtonDisabled = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
        this.isNewExpenseClaimButtonDisabled = false;
    }

    handleAddEmployeeSuccess(event){
        const evt = new ShowToastEvent({
            title: 'Expense Claim Record Created!',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}