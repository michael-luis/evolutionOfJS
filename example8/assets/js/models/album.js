var albumApp = albumApp || {};

// Album Model
albumApp.Album = Backbone.Model.extend({
    validate: function(attrs) {
        if (!attrs.name) {
            return 'Please enter album name';
        }
    },

    initialize: function() {
        this.on("invalid", function(model, error) {
            showMessage(error);
        });
    },

    sync: function (method, model, options) {
        if (method === 'create' || method === 'update') {
            $.post("handler.php", {action: "create_album", album_name: this.get("name")}, function() {
                $("#album_name").val("");
                options.success();
            });
        }
    }
});