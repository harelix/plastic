const PlasticFormDataAdapter = {
    adapter : () => {
        return (req, res, next) => {
            
            let { index, type, action  } = req.requestParams;
            let { formData } = req.body;
            
            action = action || 'create';
            req.formData = formData; 
            req.document = { 
                index,
                type,
                formData
            }
            next();
        };
    },
};

const MappingBuilder = function(){

    this.recursiveIterator = (schema, uiSchema, formDataPopulator, mapping) => {
    }

};


exports.PlasticFormDataAdapter = PlasticFormDataAdapter;