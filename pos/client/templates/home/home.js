Template.pos_home.helpers({
  currencies: function () {
    return Cpanel.Collection.Currency.find();
  },
  baseCurrency: function () {
    return Cpanel.Collection.Setting.findOne().baseCurrency;
  },
  exchangeRates: function () {

  }
});

Template.pos_home.events({
  'click .js-exchange': function () {
    FlowRouter.go('pos.exchangeRate');
  },
  'click .js-sale': function () {
    FlowRouter.go('pos.checkout');
  },
  'click .js-purchase': function () {
    FlowRouter.go('pos.purchase');
  },
  'click .js-product': function () {
    FlowRouter.go('pos.product');
  },

  'click .js-salePayment': function () {
    FlowRouter.go('pos.salePayment');
  },
  'click .js-purchasePayment': function () {
    FlowRouter.go('pos.purchasePayment');
  },
  'click .js-customer': function () {
    FlowRouter.go('pos.customer');
  },
  'click .js-supplier': function () {
    FlowRouter.go('pos.supplier');
  }
});