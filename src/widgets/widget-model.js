var Model = cdb.core.Model

/**
 * Default widget model
 */
module.exports = Model.extend({
  defaults: {
    url: '',
    data: [],
    columns: [],
    sync: true,
    bbox: true,
    collapsed: false
  },

  url: function () {
    return this.get('url') + '?bbox=' + this.get('boundingBox')
  },

  initialize: function (attrs, opts) {
    opts = opts || {}

    this.layer = opts.layer
    this.filter = opts.filter // optional/might be undefined

    this._initBinds()
  },

  _initBinds: function () {
    this.once('change:url', function () {
      var self = this
      this._fetch(function () {
        self._onChangeBinds()
      })
    }, this)

    // Retrigger an event when the filter changes
    if (this.filter) {
      this.filter.bind('change', this._onFilterChanged, this)
    }
  },

  _onChangeBinds: function () {
    this.bind('change:url', function () {
      if (this.get('sync') && !this.isCollapsed()) {
        this._fetch()
      }
    }, this)
    this.bind('change:boundingBox', function () {
      if (this.get('bbox') && !this.isCollapsed()) {
        this._fetch()
      }
    }, this)

    this.bind('change:collapsed', function (mdl, isCollapsed) {
      if (!isCollapsed) {
        if (mdl.changedAttributes(this._previousAttrs)) {
          this._fetch()
        }
      } else {
        this._previousAttrs = {
          url: this.get('url'),
          boundingBox: this.get('boundingBox')
        }
      }
    }, this)
  },

  _fetch: function (callback) {
    var self = this
    this.fetch({
      success: callback,
      error: function () {
        self.trigger('error')
      }
    })
  },

  refresh: function () {
    this._fetch()
  },

  isCollapsed: function () {
    return this.get('collapsed')
  },

  toggleCollapsed: function () {
    this.set('collapsed', !this.get('collapsed'))
  },

  _onFilterChanged: function (filter) {
    this.trigger('change:filter', this, filter)
  },

  getData: function () {
    return this.get('data')
  },

  getPreviousData: function () {
    return this.previous('data')
  },

  fetch: function (opts) {
    this.trigger('loading', this)
    return Model.prototype.fetch.call(this, opts)
  },

  toJSON: function () {
    throw new Error('toJSON should be defined for each widget')
  }
})