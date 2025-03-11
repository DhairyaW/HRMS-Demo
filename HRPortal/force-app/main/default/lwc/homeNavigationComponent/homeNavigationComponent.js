// import { LightningElement } from 'lwc';
// import MetadologieLogo from '@salesforce/resourceUrl/MetadologieLogo';
// const logo = MetadologieLogo;
// export default class HomeNavigationComponent extends LightningElement {
//     logo = logo;

//     homeFunction(){
//         console.log('homeFunction');
        
//     }
// }

// import { LightningElement, track } from 'lwc';

// export default class LightningExampleVerticalNavAdvanced extends LightningElement {
//     @track selectedItem = 'reports_recent';
//     @track currentContent = 'reports_recent';
//     @track updatedCount = 12;

//     handleSelect(event) {
//         const selected = event.detail.name;

//         if (selected === 'reports_updated') {
//             this.updatedCount = 0;
//         }

//         this.currentContent = selected;
//     }
// }

import { LightningElement, track } from 'lwc';

export default class SideNavigationLWC extends LightningElement {
    selectedNav = 'Home';
    @track isTasksSelected = false;
    @track isHomeSelected = true;
    @track isPerformanceManagementSelected = false;
    @track isAEmployeeSelected = false;
    @track isLeaveSelected = false;
    @track isPayrollSelected = false;
    @track isReportsSelected = false;
    @track isExpenseClaimSelected = false;

    togglePanel() {
        let leftPanel = this.template.querySelector("div[data-my-id=leftPanel]");
        let rightPanel = this.template.querySelector("div[data-my-id=rightPanel]");

        if (leftPanel.classList.contains('slds-is-open')) {
            leftPanel.classList.remove("slds-is-open");
            leftPanel.classList.remove("open-panel");
            leftPanel.classList.add("slds-is-closed");
            leftPanel.classList.add("close-panel");
            rightPanel.classList.add("expand-panel");
            rightPanel.classList.remove("collapse-panel");
        } else {
            leftPanel.classList.add("slds-is-open");
            leftPanel.classList.add("open-panel");
            leftPanel.classList.remove("slds-is-closed");
            leftPanel.classList.remove("close-panel");
            rightPanel.classList.remove("expand-panel");
            rightPanel.classList.add("collapse-panel");
        }
    }

    refreshUserData(evt){
        const buttonIcon = evt.target.querySelector('.slds-button__icon');
        buttonIcon.classList.add('refreshRotate');

        setTimeout(() => {
            buttonIcon.classList.remove('refreshRotate');
        }, 1000);
    }

    handleSelect(event) {
        const selected = event.detail.name;
        this.selectedNav = selected;
        console.log('selected...'+selected);
        if(selected === 'Home'){
            this.isTasksSelected = false;
            this.isHomeSelected = true;
            console.log('isHomeSelected...'+this.isHomeSelected);
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = false;
            this.isPayrollSelected = false;
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Tasks'){
            this.isTasksSelected = true;
            console.log('isTasksSelected...'+this.isTasksSelected);
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = false;
            this.isPayrollSelected = false;
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Performance Management'){
            this.isTasksSelected = false;
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = true;
            console.log('isPerformanceManagementSelected...'+this.isPerformanceManagementSelected);
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = false;
            this.isPayrollSelected = false;
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Employee'){
            this.isTasksSelected = false;
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = true;
            console.log('isAEmployeeSelected...'+this.isAEmployeeSelected);
            this.isLeaveSelected = false;
            this.isPayrollSelected = false;
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Leave'){
            this.isTasksSelected = false;
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = true;
            console.log('isLeaveSelected...'+this.isLeaveSelected);
            this.isPayrollSelected = false;
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Payroll'){
            this.isTasksSelected = false;
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = false;
            this.isPayrollSelected = true;
            console.log('isPayrollSelected...'+this.isPayrollSelected);
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Reports'){
            this.isTasksSelected = false;
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = false;
            this.isPayrollSelected = false;
            this.isReportsSelected = true;
            console.log('isReportsSelected...'+this.isReportsSelected);
            this.isExpenseClaimSelected = false;
        } else if(selected === 'Expense Claim'){
            this.isTasksSelected = false;
            this.isHomeSelected = false;
            this.isPerformanceManagementSelected = false;
            this.isAEmployeeSelected = false;
            this.isLeaveSelected = false;
            this.isPayrollSelected = false;
            this.isReportsSelected = false;
            this.isExpenseClaimSelected = true;
            console.log('isExpenseClaimSelected...'+this.isExpenseClaimSelected);
        }
        console.log('selectedNav...'+this.selectedNav);
        
    }
}