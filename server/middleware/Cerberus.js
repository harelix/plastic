
 const Cerberus = {
    middlewareBootstrap : (registers = Array<Cerberus.register>[], config) => {
        return (req, res, next) => {

            Cerberus.validateRegisters(req, registers, (response, err) => {
                if(err){ 
                    res.status(200).type('json').send({ error : err || 'endpoing url is invalid.'});
                    return;
                }
                req.requestParams = response;
                next();
            });
        };
    },
    validateRegisters: (req, validators, callback) => {
        let errs = new Array();
        let values = {};
        for(let key in validators){
            let value = req.params[key] || null;
            let validator = validators[key];
            validator().setValue(value).validate().finalize((value, err) => {
                if(err){
                    errs.push(err);
                }else{
                    values[key] = value;
                }
            });
        }
        if(errs.length<=0){
            callback(values, null);
            return;
        }
        callback(null, errs);
    },
    CerberusError : function(message){
        this.msg = message;
    },
    DefaultErrorMessage : 'Error is Error is Err',
    
    initValidator : (errorMessage = '', throwExecption = false) => {
        return new Cerberus.validatorSchemaBuilder(errorMessage, throwExecption);
    },
    validatorSchemaBuilder : function(errorMessage = '', throwExecption = false){
        this.value;
        this.defaultValue = null;
        this.isErroneous = null;
        this.validators = [];
        this.errorMessage = errorMessage;
        this.throwExecption = throwExecption;

        this.finalize = (callback) => {
            
            if(this.isErroneous && this.defaultValue){
                this.value = this.defaultValue;
                this.isErroneous = null;
            }

            if(this.isErroneous && this.throwExecption){
                if(this.throwExecption){
                    throw throwExecption(new Cerberus.CerberusError(this.errorMessage));
                }
            }
            callback(this.value, this.isErroneous);
            return this;
        };

        this.setErrorMessage = (message =  Cerberus.DefaultErrorMessage, throwExecption = false) => {
            this.errorMessage = message;
            this.throwExecption = throwExecption;
            return this;
        };
        this.setValue = (value) => {
            this.value = value;
            return this;
        };
        this.validate = () => {
            for(let validatorKey in this.validators)
            {
                let vd = this.validators[validatorKey];
                vd.func.call(this, vd.params);
            }
            return this;
        };
        this.default = (value) => {
            this.validators.push({
                validation : "default" , 
                func : this.__setDefaultValue,
                params : {
                    value : value
                }
            });
            return this;
        };
        this.number = () => {
            this.validators.push({
                validation : "isNumber" , 
                func : this.__isNumber
            });
            return this;
        };
        this.isBlank = () => {
            this.validators.push({
                validation : "isBlank" , 
                func : this.__isBlank
            });
            return this;
        };
        this.knownType = (knownTypesList) => { 
            this.validators.push({
                validation : "isKnowType" , 
                params : {
                    knownTypesList : knownTypesList
                },
                func : this.__isKnowType 
            });
            return this;
        };
        this.date = () => {
            this.validators.push({
                validation : "isValidDate" , 
                value : '', 
                func : this.__isValidDate
            });
            return this;
        };
        this.__isNumber = () => {
            if(isNaN(this.value)){
                this.isErroneous=true;
            }
            return this;
        };
        this.__isBlank = () => {
            if(!this.value || /^\s*$/.test(this.value)){
                this.isErroneous=true;
            }
        };
        this.__isKnowType = (params) => { 
            if(!params.knownTypesList[this.value]){
                this.value = null;
                this.isErroneous=true;
                this.value = params.knownTypesList[this.defaultValue];
            }else{
                this.value = params.knownTypesList[this.value]; 
            }
            return this;
        };
        this.__isValidDate = () => {
            /*
            if(!moment(this.value, 'DD/MM/YYYY',true).isValid()){
                this.isErroneous=true;
            }
            */
            return this;
        };
        this.__setDefaultValue = (params) => {
            this.defaultValue = params.value;
        };
    },
    KnownTypes : {
        ElasticKnownTypes : {  
            //none at the moment
        }
    }
};


exports.Cerberus = Cerberus;