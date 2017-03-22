var albumApp = albumApp || {};

// Image Collection
albumApp.ImageList = Backbone.Collection.extend({
    model: albumApp.Image,
    url: 'data/upload.json'
});