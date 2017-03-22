var albumApp = albumApp || {};

// Album Modal View
albumApp.AlbumModalView = Backbone.View.extend({
    id: 'albumModal',
    className: 'modal fade',
    template: _.template($('#album-modal-template').html()),

    events: {
        'hidden.bs.modal' : 'teardown',
        'click #albumBtn' : 'createAlbum'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template({}));
    },

    show: function() {
        this.$el.modal('show');
    },

    createAlbum: function() {
        var newAlbum = {};
        newAlbum['name'] = $('#album_name').val();
        this.model.set(newAlbum);
        albumApp.albums.create(this.model, {
            wait: true,
            success: function(model, resp, options) {
                this.model = new albumApp.Album();
            }
        });
    },

    teardown: function() {
        this.remove();
    }
});