import { LightningElement, wire } from 'lwc';
   import getPerformanceLogs from '@salesforce/apex/PerformanceLogController.getPerformanceLogs';

   const columns = [
       { label: 'Component Name', fieldName: 'Component_Name__c' },
       { label: 'Load Time (ms)', fieldName: 'Load_Time__c', type: 'number' },
       { label: 'Timestamp', fieldName: 'Timestamp__c', type: 'date' }
   ];

   export default class PerformanceLogViewer extends LightningElement {
       data = [];
       columns = columns;

       @wire(getPerformanceLogs)
       wiredLogs({ error, data }) {
           if (data) {
               this.data = data;
           } else if (error) {
               console.error('Error retrieving performance logs:', error);
           }
       }
   }