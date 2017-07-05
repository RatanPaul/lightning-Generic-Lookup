({
	//Search an SObject for a match
    search : function(component, event, helper) {
        helper.doSearch(component);    
        helper.hideLookup(component);
    },
    //Select an SObject from a list
    select: function(component, event, helper) {
        // Resolve the Object Id from the events Element Id (this will be the <a> tag)
        var objectId = helper.resolveId(event.currentTarget.id);
        // The Object label is the inner text)
        var objectLabel = event.currentTarget.innerText;
        helper.handleSelection(component, event, objectId, objectLabel);
        
    },
    //Clear the currently selected SObject
    clear: function(component, event, helper) {
        helper.clearSelection(component);    
    }
})