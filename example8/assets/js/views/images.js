var albumApp = albumApp || {};

// Images View
albumApp.ImagesView = Backbone.View.extend({
    el: '#album_wrapper',

    events: {
        "change #filter select": "changeAlbum"
    },

    // change filterAlbum, trigger filter function
    changeAlbum: function(e) {
        this.filterAlbum = e.currentTarget.value;
        this.trigger('change:filterAlbum');
    },

    // filter images by album
    filterByAlbum: function() {
        var that = this;
        albumApp.images.fetch({
            success: function() {
                if (that.filterAlbum === "" || that.filterAlbum === null) {
                    that.collection.reset(albumApp.images.models);
                } else {
                    var filterAlbum = that.filterAlbum;
                    var filteredImages = _.filter(albumApp.images.models, function(image) {
                        return image.get('album') === filterAlbum;
                    });
                    that.collection.reset(filteredImages);
                }
            }
        });
    },

    initialize: function() {
        var that = this;
        this.collection = albumApp.images;
        this.createSelect();
        this.on("change:filterAlbum", this.filterByAlbum, this);
        this.collection.on("reset", this.render, this);
        albumApp.albums.on("add", this.addAlbum, this);
        albumApp.images.on("add", this.addImage, this);

        this.collection.fetch({
            success: function () {
                that.render();
            }
        });
    },

    render: function() {
        var that = this;
        this.$el.find('#image_container').html("");

        _.each(this.collection.models, function(image) {
            that.renderImage(image);
        }, this);
    },

    renderImage: function(image) {
        var imageView = new albumApp.ImageView({model: image});
        this.$el.find('#image_container').append(imageView.render().el);
    },

    // create album dropdown
    createSelect: function() {
        var that = this;

        var select = $('<select/>', {
            id: 'album_list',
            class: 'form-control',
            html: '<option value="">All</option>'
        });

        albumApp.albums.fetch({
            success: function() {
                _.each(albumApp.albums.models, function(album) {
                    var option = $('<option/>', {
                        value: album.get('name'),
                        text: album.get('name')
                    }).appendTo(select);
                });
                that.$el.find('#filter').append(select);
            }
        });
    },

    addAlbum: function(album) {
        var select = $('#album_list');
        var option = $('<option/>', {
            value: album.get('name'),
            text: album.get('name')
        }).appendTo(select);
    },

    addImage: function(image) {
        // if added image has same album as active album, add it, if active album is all, add it too
        var activeAlbum = $('#album_list').val();
        if (typeof image !== 'undefined' && ( image.get("album") === activeAlbum || activeAlbum === '')) {
            this.renderImage(image);
        }
    }
});