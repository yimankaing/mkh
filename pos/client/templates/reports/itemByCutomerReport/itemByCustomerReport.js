Session.set('branchIds', null);
Template.pos_itemByCustomerReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});
Template.pos_itemByCustomerReport.helpers({
    categoryList: function () {
        var categories;
        var list = [];
        categories = ReactiveMethod.call('categoryList', 'All', null);
        categories.forEach(function (category) {
            list.push({
                label: Spacebars.SafeString(category.label),
                value: category.value
            });
        });
        return list;
    }
});
Template.pos_itemByCustomerReport.events({
    'change [name="customerLocationId"]': function (e) {
        Session.set('customerLocationId', $(e.currentTarget).val());
    },
    'change select[name="branch"]': function (e) {
        var branchId = $(e.currentTarget).val();
        if (branchId == "") {
            var userId = Meteor.userId();
            var branchIds = Meteor.users.findOne(userId).rolesBranch;
            Session.set('branchIds', branchIds);
        } else {
            var branchIds = [];
            branchIds.push(branchId);
            Session.set('branchIds', branchIds);
        }
    }
});

Template.pos_itemByCustomerReportGen.helpers({
    hasList: function (items) {
        return items.length > 0;
    },
    options: function () {
        // font size = null (default), bg
        // paper = a4, a5, mini
        // orientation = portrait, landscape
        return {
            //fontSize: 'bg',
            paper: 'a4',
            orientation: 'portrait'
        };
    },
    data: function () {
        // Get query params
        //FlowRouter.watchPathChange();
        var q = FlowRouter.current().queryParams;

        var callId = JSON.stringify(q);
        var call = Meteor.callAsync(callId, 'posItemByCustomerReport', q);

        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
    /*
     reportHelper: function () {
     var params = {};
     var date = this.date.split(" To ");
     /!* var fromDate = new Date(date[0] + " 00:00:00");
     var toDate = new Date(date[1] + " 23:59:59");
     *!/
     var fromDate = moment(date[0] + " 00:00:00").toDate();
     var toDate = moment(date[1] + " 23:59:59").toDate();
     var customerId = this.customerId;
     var staffId = this.staffId;
     var branchId = this.branch;
     var branchIds = [];
     if (branchId == "" || branchId == null) {
     var userId = Meteor.userId();
     branchIds = Meteor.users.findOne(userId).rolesBranch;
     } else {
     branchIds.push(branchId);
     }
     if (fromDate != null && toDate != null) params.saleDate = {$gte: fromDate, $lte: toDate};
     if (customerId != null && customerId != "") params.customerId = customerId;
     if (staffId != null && staffId != "") params.staffId = staffId;
     params.branchId = {$in: branchIds};
     params.status = "Paid";


     var reportHelper = {};
     reportHelper.companyName = Cpanel.Collection.Company.findOne().enName;
     var branchNames = "";
     branchIds.forEach(function (id) {
     branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
     });
     reportHelper.branch = branchNames.substr(0, branchNames.length - 2);
     reportHelper.reportName = 'Sale Items Report';
     reportHelper.date = this.date;

     var staff = "All", customer = "All";
     if (customerId != null && customerId != "")
     customer = Pos.Collection.Customers.findOne(customerId).name;
     if (staffId != null && staffId != "")
     staff = Pos.Collection.Staffs.findOne(staffId).name;
     reportHelper.header = [
     {col1: 'Staff: ' + staff, col2: 'Customer: ' + customer, col3: ''}
     ];

     reportHelper.saleProducts = getSaleProducts(params);
     reportHelper.footer = 'footer';
     return reportHelper;
     }*/
});
/*


 function getSaleProducts(params) {
 var saleIds = Pos.Collection.Sales.find(params, {fields: {_id: 1}}).map(function (sale) {
 return sale._id;
 });
 var result = [];
 var saleDetails = Pos.Collection.SaleDetails.find(
 {saleId: {$in: saleIds}},
 {fields: {productId: 1, quantity: 1, price: 1, amount: 1}});
 (saleDetails.fetch()).reduce(function (res, value) {
 if (!res[value.productId]) {
 res[value.productId] = {
 amount: value.amount,
 quantity: 0,
 productId: value.productId
 };
 result.push(res[value.productId])
 } else {
 res[value.productId].amount += value.amount;
 }
 res[value.productId].quantity += value.quantity;
 return res;
 }, {});
 var i = 1;
 var arr = [];
 var grandTotal = 0;
 result.forEach(function (r) {
 var product = Pos.Collection.Products.findOne(r.productId);
 grandTotal += r.amount;
 var unit = Pos.Collection.Units.findOne(product.unitId).name;
 arr.push({
 order: i,
 productId: r.productId,
 productName: product.name + "(" + unit + ")",
 // price: numeral(r.price).format('0,0.00'),
 quantity: r.quantity,
 total: numeral(r.amount).format('0,0.00')
 });
 i++;
 });
 arr.grandTotal = numeral(grandTotal).format('0,0.00');

 return arr;
 }



 */
