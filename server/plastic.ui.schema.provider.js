

const PlasticUISchemaProvider = function (configProvider){

    this.semanticKnownTypes = {
        email :  { 'ui:widget': 'email' },
        password : { 'ui:widget': 'password' },
        description : { 'ui:widget' : 'textarea' } ,
        uri :  { 'ui:widget': 'url' },
        date :  { 'ui:widget': 'alt-datetime' }
    }; // add more values

    this.deriveUIElementFromNameOrType = (field) => {
        
        //name based approch 
        // add contains ('personal_phone', 'phone')       
        Object.keys(this.semanticKnownTypes).map((key) => {
            if(field.name.includes(key)){
                return this.semanticKnownTypes[key];
            }
        })


        //type based
        switch(field.type){
            case 'date' : 
                return { 'ui:widget': 'alt-datetime' }

            case 'integer':
                return { 'ui:widget': 'updown' }

            case 'boolean':
                return { 'ui:widget': 'radio' }


        }
    },

    this.getUIElementFromConfiguration = () => {
        //configProvider.get();
    }
};


exports.PlasticUISchemaProvider = PlasticUISchemaProvider;