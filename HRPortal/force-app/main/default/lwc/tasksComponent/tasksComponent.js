import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TasksController.getTasks';
import taskRecMethod from '@salesforce/apex/TasksController.taskRecMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Subject', fieldName: 'Subject', type: 'text' },
    { label: 'Description', fieldName: 'Description', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Priority', fieldName: 'Priority', type: 'text' }
];

export default class TasksComponent extends LightningElement {
    // @track subject = Subject_FIELD;
    // @track description = Description_FIELD;
    // @track priority = Priority_FIELD;
    @track isShowModal = false;

    recTask = {
        Subject : '',
        Description : '',
        Priority : ''
    }
    
    @track searchString = '';
    @track tasks;
    columns = columns;
    result;
    error;

    // @track showNewTaskModal = false;
    @track isNewTaskButtonDisabled = false;

    get priorityOptions(){
        return [
            { label: 'Normal', value: 'Normal' },
            { label: 'Low', value: 'Low' },
            { label: 'High', value: 'High' }            
        ];
    }

    @wire(getTasks, {searchString: '$searchString'})
    wiredTasks({error, data}) {
        if (data) {
            this.tasks = data;
            console.log('tasks...'+JSON.stringify(this.tasks));
            
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('error...'+JSON.stringify(this.error));
            
            this.tasks = undefined;
        }
    }

    handleSearch(event){
        this.searchString = event.target.value;
        console.log('searchKey...'+this.searchString);
    }

    handleSubjectChange(event){
        console.log('event.target.value...'+event.target.value);
        
        this.recTask.Subject = event.target.value;
    }

    handleDescriptionChange(event){
        this.recTask.Description = event.target.value;
    }

    handlePriorityChange(event){
        this.recTask.Priority = event.target.value;
    }

    createTaskRec(){
        console.log('recTask...'+JSON.stringify(this.recTask));
        if(this.recTask.Subject == '' || this.recTask.Description == '' || this.recTask.Priority == ''){
            const toastEvent = new ShowToastEvent({
                title: 'Task not created',
                message: 'Please fill all fields.',
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
            // this.showNewTaskModal = false;
            this.isNewTaskButtonDisabled = false;
            this.searchString = '';
            console.log('recTask...'+JSON.stringify(this.recTask));
        } else{
            taskRecMethod({taskRec: this.recTask});
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Task created successfully',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
            // this.showNewTaskModal = false;
            this.isNewTaskButtonDisabled = false;
            this.searchString = '';
            this.isShowModal = false;
            console.log('recTask...'+JSON.stringify(this.recTask));
        }
    }

    newTask(){
        this.isNewTaskButtonDisabled = true;
        // this.showNewTaskModal = true;
        this.isShowModal = true;
    }

    handleCancel(){
        this.isNewTaskButtonDisabled = false;
        // this.showNewTaskModal = false;
        this.isNewTaskButtonDisabled = false;
        this.isShowModal = false;
    }

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isNewTaskButtonDisabled = false;
        this.isShowModal = false;
    }
}