({
	//Perform the SObject search via an Apex Controller
    doSearch : function(component) {
        // Get the search string, input element and the selection container
        var searchString = component.get("v.searchString");
        var inputElement = component.find("lookup");
        var lookupList = component.find("lookuplist");
        
        // Clear any errors and destroy the old lookup items container
        inputElement.set('v.errors', null);
        
        // Show the lookuplist
        $A.util.removeClass(lookupList, 'slds-hide');
        this.showLookup(component);
        // Get the API Name
        var sObjectAPIName = component.get("v.sObjectAPIName");
        
        // Create an Apex action
        var action = component.get("c.lookup");
        
        // Mark the action as abortable, this is to prevent multiple events from the keyup executing
        action.setAbortable();
        action.setParams({ 
            "searchString" : searchString, 
            "sObjectAPIName" : sObjectAPIName
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var matches = response.getReturnValue();

                if (matches.length == 0) {
                    component.set("v.matches", null);
                    return;
                }
                component.set("v.matches", matches);
                var lookupPill = component.find("lookuplist");
                $A.util.removeClass(lookupPill, 'slds-hide');
                this.showLookup(component);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message)  {
                        this.displayToast('Error', errors[0].message);
                    }
                }
                else {
                    this.displayToast('Error', 'Unknown error.');
                }
            }
        });
        $A.enqueueAction(action);                
    },
    //Handle the Selection of an Item
    handleSelection : function(component, event, objectId, objectLabel) {
        // Hide the Lookup List
        var lookupList = component.find("lookuplist");
        $A.util.addClass(lookupList, 'slds-hide');
        this.hideLookup(component);
        // Hide the Input Element
        var inputElement = component.find('lookup');
        $A.util.addClass(inputElement, 'slds-hide');
        // Show the Lookup pill
        var lookupPill = component.find("lookup-pill");
        $A.util.removeClass(lookupPill, 'slds-hide');
        // Lookup Div has selection
        var inputElement = component.find('lookup-div');
        $A.util.addClass(inputElement, 'slds-has-selection');
        component.set("v.searchString", objectLabel);
        component.set("v.sObjectId", objectId);
    },
    //Handle the clearing of an Item
    clearSelection : function(component) {
        component.set("v.selRelEntityId", '');
        component.set("v.searchString", '');
        component.set("v.sObjectId", '');
        
        // Hide the Lookup pill
        var lookupPill = component.find("lookup-pill");
        $A.util.addClass(lookupPill, 'slds-hide');
        // Show the Input Element
        var inputElement = component.find('lookup');
        $A.util.removeClass(inputElement, 'slds-hide');
        // Lookup Div has no selection
        var inputElement = component.find('lookup-div');
        $A.util.removeClass(inputElement, 'slds-has-selection');
    },
    //Resolve the Object Id from the Element Id by splitting the id at the _
    resolveId : function(elmId) {
        var i = elmId.lastIndexOf('_');
        return elmId.substr(i+1);
    },
    //use to set the lookup input class
    showLookup: function(component){
        component.set("v.toggleLookupMan", 'display:inherit;')
    },
    //use to set the lookup input class
    hideLookup: function(component){
        component.set("v.toggleLookupMan", 'display:none;')
    },
    //Display a message
    displayToast : function (title, message) {
        var toast = $A.get("e.force:showToast");
        
        // For lightning1 show the toast
        if (toast) {
            toast.setParams({
                "title": title,
                "message": message
            });
            toast.fire();
        }
        else {
            alert(title + ': ' + message);
        }
    }
})