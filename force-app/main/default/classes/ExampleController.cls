public with sharing class ExampleController {
 @AuraEnabled(cacheable=true)
 public static List<String> fetchData() {
 return new List<String>{'Item 1', 'Item 2', 'Item 3'};
 }
}