Meteor.methods({
    posSaleReport: function (arg) {
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
        var date = arg.date.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00").toDate();
        var toDate = moment(date[1] + " 23:59:59").toDate();
        var customerId = arg.customerId;
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var locationId = arg.locationId;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();
        var staff = "All", customer = "All", location = "All", status = "All", customerLocation = "All";
        if (fromDate != null && toDate != null) params.saleDate = {$gte: fromDate, $lte: toDate};
        if (customerId != null && customerId != "") {
            params.customerId = customerId;
            customer = Pos.Collection.Customers.findOne(customerId).name;
        }
        if (staffId != null && staffId != "") {
            params.staffId = staffId;
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        }
        if (locationId != null && locationId != "") {
            params.locationId = locationId;
            location = Pos.Collection.Locations.findOne(locationId).name;
        }
        params.branchId = {$in: branchIds};
        if (arg.status != null && arg.status != "") {
            params.status = arg.status;
            status = arg.status;
        } else {
            params.status = {$ne: "Unsaved"};
        }
        if (arg.customerLocationId != null && arg.customerLocationId != "") {
            params.customerLocationId = arg.customerLocationId;
            customerLocation = Pos.Collection.CustomerLocations.findOne(arg.customerLocationId).name;
        }
        //params.status = {$ne: "Unsaved"};
        params.transactionType = arg.transactionType;
        //params.transactionType = "Sale";
        //params.status = "Owed";
        var sale = Pos.Collection.Sales.find(params);

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.customerLocation=customerLocation;
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.location = location;
        header.staff = staff;
        header.customer = customer;
        header.transactionType = arg.transactionType;
        header.status = status;

        /****** Header *****/
        data.header = header;
        var content = calculateSaleHelper(sale);
        data.grandTotalProfit = content.grandTotalProfit;
        data.grandTotalPaid = content.grandTotalPaid;
        data.grandTotalOwed = content.grandTotalOwed;
        data.grandTotal = content.grandTotal;
        data.grandTotalCost = content.grandTotalCost;
        data.grandTotalConvert = content.grandTotalConvert;
        //return reportHelper;
        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});

function calculateSaleHelper(sl) {
    var grandTotalOwed = 0;
    var grandTotal = 0;
    var grandTotalCost = 0;
    var grandTotalConvert = {};
    var saleList = [];
    var i = 1;
    sl.forEach(function (s) {
        grandTotal += s.total;
        grandTotalCost += s.totalCost;
        s.order = i;
        s.exchangeRates = [];
        if (s._exchangeRate) {
            s._exchangeRate.rates.forEach(function (ex) {
                ex.exTotal = s.total * ex.rate;
                if (grandTotalConvert[ex.toCurrencyId] == null) {
                    grandTotalConvert[ex.toCurrencyId] = 0
                }
                grandTotalConvert[ex.toCurrencyId] += ex.exTotal;
                ex.exTotal = numeral(ex.exTotal).format('0,0.00');
                s.exchangeRates.push(ex);

            });
        }
        s.saleDate = moment(s.saleDate).format("DD-MM-YY, HH:mm");
        s.owedAmount = s.owedAmount ? s.owedAmount : 0;
        s.paidAmount = s.total - s.owedAmount;
        grandTotalOwed += s.owedAmount;
        s.paidAmount = numeral(s.paidAmount).format('0,0.00');
        s.owedAmount = numeral(s.owedAmount).format('0,0.00');
        s.profit=numeral(s.total-s.totalCost).format('0,0.00');
        s.total = numeral(s.total).format('0,0.00');
        s.totalCost = numeral(s.totalCost).format('0,0.00');
        s.customer = s._customer.name;
        s.staff = s._staff.name;
        //s.customer = Pos.Collection.Customers.findOne(s.customerId).name;
        //s.staff = Pos.Collection.Staffs.findOne(s.staffId).name;
        i++;
        saleList.push(s);
    });
    saleList.grandTotalProfit=numeral(grandTotal - grandTotalCost).format('0,0.00');
    saleList.grandTotalPaid = numeral(grandTotal - grandTotalOwed).format('0,0.00');
    saleList.grandTotalOwed = numeral(grandTotalOwed).format('0,0.00');
    saleList.grandTotalCost = numeral(grandTotalCost).format('0,0.00');
    saleList.grandTotal = numeral(grandTotal).format('0,0.00');
    saleList.grandTotalConvert = [];
    for (var key in grandTotalConvert) {
        saleList.grandTotalConvert.push({
            toCurrencyId: key,
            totalConvert: numeral(grandTotalConvert[key]).format('0,0.00')
        });
    }
    /*$.each(grandTotalConvert,function(key,value){
     saleList.grandTotalConvert.push({toCurrencyId:key,totalConvert:value});
     });*/

    return saleList;
}



