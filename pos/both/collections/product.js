Images = new FS.Collection("images", {
    stores: [new FS.Store.GridFS("images", {})],
    filter: {
        maxSize: 1048576, // in bytes
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png','jpg']
        },
        onInvalid: function (message) {
            if (Meteor.isClient) {
                alert(message);
            } else {
                console.log(message);
            }
        }
    }
});
Pos.Collection.Products = new Mongo.Collection("pos_products");
Pos.Schema.Products = new SimpleSchema({
    picture: {
        type: String,
        label: 'Choose file',
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        },
        optional:true
    },
    name: {
        type: String,
        label: "Name",
        max: 200
    }
    ,
    barcode: {
        type: String,
        label: "Barcode",
        unique: true
    }
    ,
    retailPrice: {
        type: Number,
        label: "Retail Price",
        decimal: true
    }
    ,
    wholesalePrice: {
        type: Number,
        label: "Wholesale Price",
        decimal: true
    }
    ,
    purchasePrice: {
        type: Number,
        label: "Purchase Price",
        decimal: true
    }
    ,
    productType: {
        type: String,
        label: "Type",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.productType();
            }
        }
    }
    ,
    categoryId: {
        type: String,
        label: "Category",
        autoform: {
            type: "select2",
            /*options: function () {
             return Pos.List.category();
             }*/
        }
    }
    ,
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    /*subCategoryId: {
        type: String,
        label: "Sub Category",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.subCategory();
            }
        }
    }
    ,*/
    unitId: {
        type: String,
        label: "Unit",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.unit();
            }
        }
    }
    ,
    status: {
        type: String,
        label: "Status",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.status();
            }
        }
    },
    _category:{
        type:Object,
        blackbox:true,
        optional:true
    },
    _unit:{
        type:Object,
        blackbox:true,
        optional:true
    }
})
;
Pos.Collection.Products.attachSchema(Pos.Schema.Products);

Images.allow({
    insert: function (userId, doc) {
        return true;
    },
    download: function (userId) {
        return true;
    }
});


