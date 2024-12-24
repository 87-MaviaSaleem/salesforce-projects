public with sharing class ApexDataController {
    @AuraEnabled(cacheable=true)
    public static List<String> getData() {
        return new List<String>{'Apple', 'Banana', 'Cherry'};
    }
    @AuraEnabled
public static List<String> getData1() {
    // Apex logic here
    return new List<String>{'Item1', 'Item2', 'Item3'};
}

}