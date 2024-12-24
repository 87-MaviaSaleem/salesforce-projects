public with sharing class PatientController {
    @AuraEnabled(cacheable=true)
    public static List<PatientWrapper> fetchPatients(String lastPatientId, Integer limit1, String userRole, String department) {
        // Validate input
        system.debug('inclass');
        if (limit1 == null || limit1 <= 0) {
               system.debug('inclass1');
            throw new AuraHandledException('Invalid limit1 parameter.');
        }

        // Base query with dynamic filters
        String query = 'SELECT Id, Name, Age__c, Last_Visit_Date__c, Department__c FROM Patient__c WHERE Is_Active__c = TRUE';
   system.debug('inclass2....'+query);
        // Add filters based on user role and department
        if (userRole != null && userRole == 'Doctor') {
            query += ' AND Department__c = :department';
        } else if (userRole != null && userRole == 'Admin') {
            // Admin sees all patients; no additional filter
        } else {
            throw new AuraHandledException('Access denied: Invalid role.');
        }

        // Add keyset pagination for large datasets
        if (lastPatientId != null && lastPatientId != '') {
            query += ' AND Id > :lastPatientId';
        }
		
        query += ' ORDER BY Last_Visit_Date__c DESC LIMIT :limit1';
        system.debug('limit1...'+limit1);
        system.debug('department.....'+department);
		system.debug('inclass3...'+query);
        // Execute query
        List<Patient__c> patientRecords = Database.query(query);
		system.debug('inclass4...'+patientRecords);
        // Wrap the response for UI rendering
        List<PatientWrapper> response = new List<PatientWrapper>();
        for (Patient__c patient : patientRecords) {
            response.add(new PatientWrapper(patient));
            system.debug('inclass5...'+patient);
        }
        return response;
    }

    public class PatientWrapper {
        @AuraEnabled public Patient__c patient { get; set; }
        @AuraEnabled public List<Appointment__c> appointments { get; set; }

        public PatientWrapper(Patient__c patient) {
            this.patient = patient;
            this.appointments = [
                SELECT Id, Appointment_Date__c, Appointment_Type__c 
                FROM Appointment__c 
                WHERE Patient__c = :patient.Id 
                ORDER BY Appointment_Date__c DESC 
                LIMIT 5
            ];
        }
    }
}