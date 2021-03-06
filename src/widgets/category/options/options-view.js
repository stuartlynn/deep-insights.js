var cdb = require('cartodb.js');
var template = require('./options-template.tpl');

/**
 * Category filter view
 *
 */
module.exports = cdb.core.View.extend({
  className: 'CDB-Widget-filter CDB-Widget-contentSpaced CDB-Widget-contentSpaced--sideMargins',

  events: {
    'click .js-all': '_onSelectAll',
    'click .js-lock': '_lockCategories',
    'click .js-unlock': '_unlockCategories'
  },

  initialize: function () {
    this.dataviewModel = this.options.dataviewModel;
    this.widgetModel = this.options.widgetModel;
    this._initBinds();
  },

  render: function () {
    this.$el.html(
      template({
        acceptedCats: this.dataviewModel.numberOfAcceptedCategories(),
        rejectedCats: this.dataviewModel.numberOfRejectedCategories(),
        areAllRejected: this.dataviewModel.filter.areAllRejected(),
        isLocked: this.widgetModel.isLocked(),
        canBeLocked: this.widgetModel.canBeLocked(),
        totalLocked: this.widgetModel.lockedCategories.size(),
        isSearchEnabled: this.widgetModel.isSearchEnabled(),
        isSearchApplied: this.dataviewModel.isSearchApplied(),
        totalCats: this.dataviewModel.getData().size()
      })
    );
    return this;
  },

  _initBinds: function () {
    this.widgetModel.bind('change:search change:locked', this.render, this);
    this.widgetModel.lockedCategories.bind('change add remove', this.render, this);
    this.add_related_model(this.widgetModel);
    this.add_related_model(this.widgetModel.lockedCategories);

    this.dataviewModel.bind('change:data', this.render, this);
    this.add_related_model(this.dataviewModel);

    var f = this.dataviewModel.filter;
    f.acceptedCategories.bind('change add remove', this.render, this);
    f.rejectedCategories.bind('change add remove', this.render, this);
    this.add_related_model(f.rejectedCategories);
    this.add_related_model(f.acceptedCategories);
  },

  _lockCategories: function () {
    this.widgetModel.lockCategories();
  },

  _unlockCategories: function () {
    this.widgetModel.unlockCategories();
  },

  _onSelectAll: function () {
    this.dataviewModel.filter.acceptAll();
  }

});
