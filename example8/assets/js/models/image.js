var albumApp = albumApp || {};

// Image Model
albumApp.Image = Backbone.Model.extend({
    validate: function(attrs) {
        if (!attrs.album) {
            return 'Please select an album, if no album, create one first!';
        }
        if (!attrs.name) {
            return 'Please enter image name!';
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(attrs.email)) {
            return 'Please enter a valid email!';
        }
        if (!attrs['image']) {
            return 'Please select an image to upload!';
        } else {
            var files = $("#image")[0].files;
            if (typeof (files) != "undefined" && files.length > 0) {
                var size = parseFloat(files[0].size / 1024).toFixed(2);
                if (size > 200) {
                    return 'Image is too large, please upload an image less than 200KB.';
                }
            }
        }
    },

    initialize: function() {
        this.on("invalid", function(model, error) {
            showMessage(error);
        });
    },

    sync: function (method, model, options) {
        if (method === 'create' || method === 'update') {
            $.ajax({
                url: 'handler.php',
                type: 'POST',
                data: new FormData($("#uploadForm")[0]),
                processData: false,
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                    $("#uploadForm")[0].reset();
                    options.success();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showMessage("Failed to upload image!");
                    options.error();
                }
            });
        }
    }
});