showMessage = function(message) {
    $("<div/>", { 'class': 'alert alert-warning', 'id': 'message', text: message }).hide().prependTo("body").slideDown('fast').delay(3000).slideUp(function() { $(this).remove(); });
};

function Album(data) {
    this.name = ko.observable(data.name);
    this.displayText = ko.pureComputed(function() {
        if (this.name() === '') return 'All';
        else return this.name();
    }, this);
}

function Image(data) {
    this.name = ko.observable(data.name);
    this.image = ko.observable(data.image);
    this.email = ko.observable(data.email);
    this.album = ko.observable(data.album);
    this.src = ko.pureComputed(function() {
        return 'uploads/' + this.image();
    }, this);
}

function ImagesViewModel() {
    // Data
    var self = this;
    self.filterAlbum = ko.observable();
    self.allImages = ko.observableArray([]);
    self.images = ko.observableArray([]);
    self.albums = ko.observableArray([]);

    // show images based on selected album
    self.showImages = function() {
        $.get('data/upload.json', function(response) {
            if (self.filterAlbum() !== "") {
                var filteredImages = _.filter(response, function (image) {
                    return image.album === self.filterAlbum();
                });
                var mappedImages = $.map(filteredImages, function(image) {
                    return new Image(image);
                });
                self.images(mappedImages);
            } else {
                var mappedImages = $.map(response, function(image) {
                    return new Image(image);
                });
                self.images(mappedImages);
            }
        })
    };

    // initialize albums array
    self.loadAlbums = function() {
        $.get('data/albums.json', function(response) {
            var mappedAlbums = $.map(response, function(album) {
                return new Album(album);
            });
            mappedAlbums.unshift(new Album({name: ''}));
            self.albums(mappedAlbums);
        });
    };

    // create album
    self.createAlbum = function(formElement) {
        var album_name = $(formElement).find('#album_name').val();
        if (album_name === "") {
            showMessage("Please enter album name!");
            return false;
        } else {
            $.post('handler.php', {action: 'create_album', album_name: album_name}, function() {
                self.albums.push(new Album({name: album_name}));
                $(formElement).find('#album_name').val('');
            });
        }
    };

    // validate upload form
    var validate = function(formElement) {
        if ($(formElement).find("#album").val() === "") {
            showMessage("Please select an album, if no album, create one first!");
            return false;
        }

        if ($(formElement).find("#name").val() === "") {
            showMessage("Please enter name of the image!");
            return false;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($(formElement).find("#email").val())) {
            showMessage("Please enter a valid email!");
            return false;
        }

        if ($(formElement).find("#image").val() === "") {
            showMessage("Please select an image to upload!");
            return false;
        } else {
            var files = $(formElement).find("#image")[0].files;
            if (typeof (files) != "undefined") {
                var size = parseFloat(files[0].size / 1024).toFixed(2);
                if (size > 200) {
                    showMessage("Image is too large, please upload an image less than 200KB.");
                    return false;
                }
            }
        }
        return true;
    };

    // upload image
    var upload = function(formElement) {
        $.ajax({
            url: 'handler.php',
            type: 'POST',
            data: new FormData( $(formElement)[0] ),
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                self.images.push(new Image({
                    name: $(formElement).find('#name').val(),
                    image: $(formElement).find('#image').val().split('\\').pop(),
                    email: $(formElement).find('#email').val(),
                    album: $(formElement).find('#album').val()
                }));
                $(formElement)[0].reset();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage("Failed to upload image!");
            }
        });
    };

    self.uploadImage = function(formElement) {
        if (validate(formElement)) upload(formElement);
    };

    // Load albums
    self.loadAlbums();

    // Show Index By Default
    self.filterAlbum('');
    self.showImages();
}

ko.applyBindings(new ImagesViewModel());