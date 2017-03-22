var albumApp = albumApp || {};

// Image View
albumApp.ImageView = Backbone.View.extend({
    tagName: 'div',
    className: 'col-xs-6 col-md-3',
    imageTpl: _.template($('#image-entry-template').html()),
    render: function() {
        this.$el.html(this.imageTpl(this.model.toJSON()));
        return this;
    }
});