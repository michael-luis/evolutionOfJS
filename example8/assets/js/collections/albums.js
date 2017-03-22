var albumApp = albumApp || {};

// Album Collection
albumApp.AlbumList = Backbone.Collection.extend({
    model: albumApp.Album,
    url: 'data/albums.json'
});