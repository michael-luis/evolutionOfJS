var albumApp = albumApp || {};

showMessage = function(message) {
    $("<div/>", { 'class': 'alert alert-warning', 'id': 'message', text: message }).hide().prependTo("body").slideDown('fast').delay(3000).slideUp(function() { $(this).remove(); });
};

$(document).ready(function() {
    albumApp.albums = new albumApp.AlbumList;
    albumApp.albums.fetch();

    albumApp.images = new albumApp.ImageList;
    albumApp.images.fetch();

    var imagesView = new albumApp.ImagesView();

    $("#linkAlbum").click(function(e) {
        e.preventDefault();
        var albumModalView = new albumApp.AlbumModalView({model: new albumApp.Album()});
        albumModalView.show();
    });

    $("#linkImage").click(function(e) {
        e.preventDefault();
        var uploadModalView = new albumApp.UploadModalView({model: new albumApp.Image()});
        uploadModalView.show();
    });
});