$.validator.setDefaults({
	errorElement : "em",
	errorPlacement : function (error, element) {
		error.addClass("text-danger");
		error.insertAfter(element);
	},
	highlight : function ( element, errorClass, validClass) {
		$(element).parents(".form-group").addClass("has-error").removeClass("has-success");			
	},
	unhighlight : function ( element, errorClass, validClass) {
		$(element).parents(".form-group").addClass("has-success").removeClass("has-error");
	},
	alphanumeric : function(value, element){
		return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
	},
	'allExtension' : function(value, element, params){
		var formControls = $('input[name='+$(element).attr('name')+']');
		var result = true;

		if(formControls && formControls.length > 0) {
			for(var i=0; i<formControls.length; i++ ){
				if(! (params="string"==typeof params?params.replace(/,/g,"|"):"png|jpe?g|gif",this.optional(formControls[i])||formControls[i].value.match(new RegExp("\\.("+params+")$","i"))))
					return false;
			}
		}
		
		return true;
	},
	'allrequired' : function(value, element){ // 전체 input required
		var formControls = $('input[name='+$(element).attr('name')+']');
		
		if(formControls && formControls.length > 0) {
			for(var i=0; i<formControls.length; i++ ){
				if(!formControls[i].value)
					return false;
			}
		}
		
		return true;
	}
});