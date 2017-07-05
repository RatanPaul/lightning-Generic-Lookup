public with sharing class RN_Generic_lightning_Lookup 
{
     /**
    	@MethodName     : lookup
    	@Param          : search string and object api name
    	@Description    : This method search the records
    **/
    @AuraEnabled
    public static Result[] lookup(String searchString, String sObjectAPIName) {
        String objSearchString = String.isNotBlank(searchString) ? String.escapeSingleQuotes(searchString): '';
        String objSObjectAPIName = String.escapeSingleQuotes(sObjectAPIName);
        List<Result> results = new List<Result>();
        if(String.isNotBlank(objSearchString) && objSearchString.length() > 1)
        {
            String searchQuery = 'FIND \'' + objSearchString + '*\' IN Name FIELDS RETURNING ' + objSObjectAPIName + '(Id, Name ORDER BY Name) Limit 50'; 
            
            List<List<SObject>> searchList = search.query(searchQuery);
            
    		for (SObject so : searchList[0]) {
                results.add(new Result((String)so.get('Name'), so.Id));
            }
        }
        else
        {
            String strQuery = 'SELECT Id, Name FROM '+sObjectAPIName ;
            strQuery += String.isNotBlank(searchString) ? ' WHERE Name like \'%' + searchString  + '%\' LIMIT 10' : ' LIMIT 10';
    		for (SObject so : Database.query(strQuery)) {
                results.add(new Result((String)so.get('Name'), so.Id));
            }
        }
        
        return results;
    }
    /* End */
    
    /* Start - ResultWrapper class */ 
	public class Result {
        @AuraEnabled public String SObjectLabel;
        @AuraEnabled public Id SObjectId;
        
        public Result(String sObjectLabel, Id sObjectId) 
        {
            this.SObjectLabel = sObjectLabel;
            this.SObjectId = sObjectId;
        }
    }
    /* End - ResultWrapper class */
}