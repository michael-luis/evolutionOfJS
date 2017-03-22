$(document).ready(function() {
    var showMessage = function(message) {
        $("<div/>", { 'class': 'alert alert-warning', 'id': 'message', text: message }).hide().prependTo("body").slideDown('fast').delay(3000).slideUp(function() { $(this).remove(); });
    };

    // update album dropdown
    var updateAlbumList = function(id) {
        $.getJSON("data/albums.json", function(albums){
            var options = '<option value="">--</option>';
            for (var i = 0; i < albums.length; i++) {
                options += '<option value="' + albums[i].name + '">' + albums[i].name + '</option>';
            }
            $("select#" + id).html(options);
        })
    };

    // validate upload form
    var validate = function() {
        if ($("#image-file").val() === "") {
            showMessage("Please select an image to upload!");
            return false;
        } else {
            var files = $("#image-file")[0].files;
            if (typeof (files) != "undefined") {
                var size = parseFloat(files[0].size / 1024).toFixed(2);
                if (size > 200) {
                    showMessage("Image is too large, please upload an image less than 200KB.");
                    return false;
                }
            }
        }

        if ($("#name").val() === "") {
            showMessage("Please enter name of the image!");
            return false;
        }

        if ($("#album").val() === "") {
            showMessage("Please select an album, if no album, create one first!");
            return false;
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#email").val())) {
            return true
        } else {
            showMessage("Invalid E-mail Address! Please re-enter.");
            return false;
        }
    };

    // upload image
    var upload = function() {
        $.ajax({
            url: 'handler.php',
            type: 'POST',
            data: new FormData( $("#uploadForm")[0] ),
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                $("#uploadForm")[0].reset();
                render();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage("Failed to upload image!");
            }
        });
    };

    // simple template engine
    var templateEngine = function(template, data){
        for(var key in data)
            template = template.replace(new RegExp('{' + key + '}', 'g'), data[key]);
        return template;
    };

    // show uploaded images
    var render = function() {
        var album = $("#album_list").val();
        $.getJSON("data/upload.json", function(response) {
            var pictures = response;
            if (album !== '' && album !== null) {
                pictures = pictures.filter(function(picture) { // excluding default group, map to format {id: xxx, name: xxx} as source
                    return picture.album === album;
                });
            }
            var template = Handlebars.compile($("#image-entry-template").html());
            var picturesHtml = template({ images: pictures });
            $("#image_container").html(picturesHtml);
        });
    };

    // create album
    $("#albumBtn").click(function() {
        if ($("#album_name").val() === "") {
            showMessage("Please enter album name!");
            return false;
        } else {
            $.post("handler.php", {action: "create_album", album_name: $("#album_name").val()}, function() {
                $("#album_name").val("");
                updateAlbumList("album");
                updateAlbumList("album_list");
            });
        }
    });

    // upload picture
    $("#uploadBtn").click(function() {
        if (validate()) upload();
    });

    // refresh images
    $("#album_list").change(function() {
        render();
    });

    // run to init
    updateAlbumList("album");
    updateAlbumList("album_list");
    render();
});