var albumApp = albumApp || {};

// Upload Modal View
albumApp.UploadModalView = Backbone.View.extend({
    id: 'uploadModal',
    className: 'modal fade',
    template: _.template($('#upload-modal-template').html()),

    events: {
        'hidden.bs.modal' : 'teardown',
        'click #uploadBtn' : 'uploadImage'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template({albums: albumApp.albums}));
    },

    show: function() {
        this.$el.modal('show');
    },

    uploadImage: function() {
        var that = this;
        var newImage = {};
        newImage['album'] = $('#album').val();
        newImage['name'] = $('#name').val();
        newImage['email'] = $('#email').val();
        newImage['image'] = $('#image').val().split('\\').pop();

        this.model.set(newImage);
        var image = albumApp.images.create(this.model, {
            wait: true,
            success: function(model, resp, options) {
                that.model = new albumApp.Image();
            }
        });
    },

    teardown: function() {
        this.remove();
    }
});