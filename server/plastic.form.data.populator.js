const PlasticFormDataPopulator = {
    populate : (config = {}) => {
        return (req, res, next) => {
            
            let { index, type, uuid  } = req.requestParams;
            if(!uuid){
                next();
                return;
            };
            
            next();
        };
    },
    adapt : () => {
        return (req, res, next) => {
            
            let { index, type, action, uuid  } = req.requestParams;
            if(!uuid){
                next();
                return;
            };
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
    }
};

exports.PlasticFormDataPopulator = PlasticFormDataPopulator;