'use strict';

var albumServices = angular.module('albumServices', []);

albumServices.factory('DataService', ['$http', '$q',
    function($http, $q) {
        // get resource from specified url
        var get = function(url) {
            var promise = $http.get(url).then(function(response) {
                return response.data;
            });
            return promise;
        };

        // create album
        var createAlbum = function(album) {
            var d = $q.defer();
            album.action = 'create_album';

            $http({
                method: 'POST',
                url: 'handler.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: album
            }).success(function (data) {
                d.resolve(true);
            }).error(function(data) {
                d.resolve(false);
            });

            return d.promise;
        };

        // upload image
        var uploadImage = function(image) {
            var d = $q.defer();
            var formData = new FormData();
            formData.append('action', 'upload_image');
            for (var p in image)
                formData.append(p, image[p]);
            $http.post('handler.php', formData, {
                headers: {'Content-Type': undefined},
                transformRequest: angular.identify
            }).success(function (data) {
                d.resolve(true);
            }).error(function(data) {
                d.resolve(false);
            });

            return d.promise;
        };

        // export public functions
        return {
            getAlbums: get('data/albums.json'),
            getImages: get('data/upload.json'),
            createAlbum: createAlbum,
            uploadImage: uploadImage
        }
    }
])