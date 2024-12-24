trigger DuplicateEmailsInLeadTrigger on Lead (before insert) {
	map<String,Contact>  mapOfContact = new map<String, Contact>();
    list<Contact> con = [select id,email from contact];
     for (contact c:con)
     {
        mapofcontact.put(c.email,c);
   	 }
        for(lead l : trigger.new)
        {
                    if((l.email != null) && (trigger.isInsert || (l.email != trigger.oldmap.get(l.id).email))){
                        if(mapofContact.containsKey(l.email)){
                            l.Email.addError('Email already exists');
                  }                  
           }               
     }
}