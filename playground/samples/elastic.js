module.exports = {
    "schema": {
        "title": "Editor for: Index (plastic) Type (person)",
        "type": "object",
        "required": [],
        "properties": {
            "creations": {
                "type": "array",
                "title": "creations Collection",
                "items": {
                    "type": "object",
                    "required": [],
                    "properties": {
                        "media": {
                            "type": "array",
                            "title": "media Collection",
                            "items": {
                                "type": "object",
                                "required": [],
                                "properties": {
                                    "publication_date": {
                                        "type": "string",
                                        "title": "publication_date"
                                    },
                                    "title": {
                                        "type": "string",
                                        "title": "title"
                                    },
                                    "type": {
                                        "type": "string",
                                        "title": "type"
                                    },
                                    "url": {
                                        "type": "string",
                                        "title": "url"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "name": {
                "type": "string",
                "title": "name"
            },
            "sure_name": {
                "type": "string",
                "title": "sure_name"
            }
        }
    },
    "uiSchema": {},
    "formData": {}
}

