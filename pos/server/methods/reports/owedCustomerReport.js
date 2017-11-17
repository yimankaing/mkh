Meteor.methods({
    posOwedCustomerReport: function (arg) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        var params = {};
        var date = moment(arg.date + " 23:59:59").toDate();
        var customerId = arg.customerId;
        var locationId = arg.locationId;
        //var staffId = arg.staffId;
        var branchId = arg.branch;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        var customer = "All", location = "All", customerLocation = "All";
        if (customerId != null && customerId != "") {
            params.customerId = customerId;
            customer = Pos.Collection.Customers.findOne(customerId).name;
        }
        if (locationId != null && locationId != "") {
            params.locationId = locationId;
            location = Pos.Collection.Locations.findOne(locationId).name;
        }
        if (arg.customerLocationId != null && arg.customerLocationId != "") {
            params.customerLocationId = arg.customerLocationId;
            customerLocation = Pos.Collection.CustomerLocations.findOne(arg.customerLocationId).name;
        }
        params.branchId = {$in: branchIds};
        params.status = "Owed";
        params.saleDate = {$lte: date};
        data.title = Cpanel.Collection.Company.findOne();
        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.customerLocation = customerLocation;
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.location = location;
        header.customer = customer;
        data.header = header;

        var content = [];
        var sales = Pos.Collection.Sales.find(params);
        var i = 1;
        var totalOwed = 0;
        var total = 0;
        sales.forEach(function (s) {
            s.saleDate = moment(s.saleDate).format("DD-MM-YYYY HH:mm:ss");
            s.order = i;
            total += s.total;
            totalOwed += s.owedAmount;
            s.paidAmount = numeral(s.total - s.owedAmount).format('0,0.00');
            s.owedAmount = numeral(s.owedAmount).format('0,0.00');
            s.total = numeral(s.total).format('0,0.00');
            i++;
            content.push(s);
        });
        data.totalPaid = numeral(total - totalOwed).format('0,0.00');
        data.totalOwed = numeral(totalOwed).format('0,0.00');
        data.total = numeral(total).format('0,0.00');
        /*var payments = [];
         var sale = Pos.Collection.Sales.find(params);
         if (sale != null) {
         var i = 1;
         sale.forEach(function (obj) {
         debugger;
         var payment = Pos.Collection.Payments.findOne({
         saleId: obj._id,
         paymentDate: {$lte: date}
         },
         {
         sort: {_id: -1}
         }
         );
         if (payment != null && payment.balanceAmount > 0) {
         var customerName = Pos.Collection.Customers.findOne(obj.customerId).name;
         payments.push({
         order: i,
         paymentDate: moment(payment.paymentDate).format("DD-MM-YYYY"),
         balanceAmount: payment.balanceAmount,
         customerName: customerName,
         saleId: obj._id
         });
         i++;
         }

         });
         }*/
        /****** Header *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});
