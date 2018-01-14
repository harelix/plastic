const PlasticUISchemaProvider = require('./plastic.ui.schema.provider').PlasticUISchemaProvider;

const plastic = new PlasticUISchemaProvider();
 const PlasticSchemaAdapter = {
    mappingAdapter : (config = {}) => {
        return (req, res, next) => {
            
            let { index, type } = req.requestParams;
            let data = req.elasticData; //should implement error handling here in case index and type return null.
            let mapping = (data[index] || data[type]).properties;

            let schema = {
                title : 'Editor for: Index (' + index + ') Type (' + type + ')',
                type : 'object',
                required : [], //get list from configuration (future feature)
                properties : {}
            }; 
            
            
            let uiSchema = {};
            uiSchema._id = {'ui:readonly' : true}
            let schemaBuilder = new SchemaBuilder();
            
            schemaBuilder.recursiveIterator(schema, uiSchema, mapping);
            req.schema = schema;
            req.uiSchema = uiSchema;
            next();
        };
    },
};


const SchemaBuilder = function(){

    this.recursiveIterator = (schema, uiSchema, mapping) => {

        Object.keys(mapping).map((fieldKey) => {

            var field = mapping[fieldKey];
            field.name = fieldKey;
            
            if(field.properties){
                //nested schema object - defaults to array at the moment extract first key name
                let tempNodeName = Object.keys(field.properties)[0];
                let formElementID = fieldKey;
                let prefixedTempNodeName = fieldKey + ' ' + tempNodeName;

                schema.properties[formElementID] = {
                    type : 'array',
                    title : field.name + ' Collection',
                    ['items'] : {
                        type : 'object',
                        required : [],
                        properties : {}
                    }
                };

                schema.properties._id = {
                    type : 'string',
                    title : 'elastic _id'
                }

                var baseSchemaNode = schema.properties[formElementID]['items'];
                uiSchema[formElementID] = {};

                this.recursiveIterator(baseSchemaNode, 
                    uiSchema[formElementID].items = {}, 
                    field.properties);

                    
                if(Object.keys(uiSchema[formElementID].items).length <= 0){
                    delete uiSchema[formElementID]; 
                }
            }else{
                //regular field schema object
                schema.properties[field.name] = this.selector(field)(field);
                //ui widget 
                let uiSchemaWidget = plastic.deriveUIElementFromNameOrType(field);
                
                if(uiSchemaWidget){
                    uiSchema[field.name] = uiSchemaWidget;
                }
            }
        });
    }


    this.selector = (field) => {
        var a = this.semanticDetection(field.name);
        let func = this.types[field.type];
        if(field.type==='text' || field.type==='string' || field.type==='keyboard'){
            func = this.semanticDetection(field.name) || this.types[field.type];
        };
        return func || this.undefinedHandler;
    };

    this.stringSchemaElement = (field) => {
        return {
            type : 'string',
            title : field.name
        };
    };

    this.keywordSchemaElement = (field) => {
        return {
            type : 'string',
            title : field.name
        };
    };

    this.undefinedHandler = (field) => {
        return {
            type : 'string',
            title : 'string'
        }
    }

    this.dateSchemaElement = (field) => {
        return {
            type : 'string',
            format: "date",
            title : field.name
        }
    }

    this.integerSchemaElement = (field) => {
        return {
            type : 'integer',
            title : field.name
        }
    }

    this.booleanSchemaElement = (field) => {
        return {
            type : 'boolean',
            title : field.name
        }
    }

    this.emailSchemaElement = (field) => {
        return {
            type : 'string',
            format : 'email'
        }
    }

    this.passwordSchemaElement = (field) => {
        return {
            type : 'string',
            format : 'password'
        }
    }

    this.uriSchemaElement= (field) => {
        return {
            type : 'string',
            format : 'uri'
        }
    }

    this.types = {
        'text' : this.stringSchemaElement,
        'keyword' : this.keywordSchemaElement,
        'integer' : this.integerSchemaElement,
        'date' : this.dateSchemaElement,
        'boolean' : this.booleanSchemaElement,
        'email' : this.emailSchemaElement,
        undefined : this.undefinedHandler
    };

    this.semanticDetection = (field, callback) => {
        let pointer = false;
        Object.keys(this.semanticTypes).some((key) => {
            if(field.includes(key)){
                pointer = key;
            };
        });
        return this.semanticTypes[pointer];
    };
    this.allTypes = {};
    this.semanticTypes = {
        email :  this.emailSchemaElement,
        password : this.passwordSchemaElement,
        uri : this.uriSchemaElement,
        date : this.dateSchemaElement
        //phone : {} ,
        //address : {},
    }; // add more values
};


exports.PlasticSchemaAdapter = PlasticSchemaAdapter;