public class Dsoql3 {
    public String name{set;get;}
    public List<Product__c> result{set;get;}
    public String query{set;get;}
    public void getData(String name)
    {
    //name='tcs';
        query='select Id, Name, Price__c from Product__c';
        if(name!=null){
        query=query+' where name=\''+name+'\'';
            system.debug('query'+query);
    }
    result=Database.query(query);
        system.debug('Products:'+result);
    }
   }