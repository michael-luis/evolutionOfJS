(function() {

    'use strict';

    var albumControllers = angular.module('albumControllers', []);

    albumControllers.controller('imageListController', ['$scope', 'Album', 'Image',
        function ($scope, Album, Image) {
            // load all images
            Image.query(function (data) {
                $scope.images = data;
            });

            // load all albums
            Album.query(function (data) {
                $scope.albums = data;
                window.prerenderReady = true;
            });

            // when new album is created, update albums array
            $scope.$on('createAlbumEvent', function (event, album) {
                $scope.albums.push(album);
            });

            // when new image is uploaded, update images array
            $scope.$on('uploadImageEvent', function (event, image) {
                $scope.images.push(image);
            });
        }
    ]);

    albumControllers.controller('albumController', ['$scope', '$rootScope', 'Album',
        function ($scope, $rootScope, Album) {
            // create album
            $scope.createAlbum = function () {
                if ($scope.albumForm.$valid) {
                    Album.save({}, $scope.album, function (response) {
                        $rootScope.$broadcast('createAlbumEvent', response);

                        // reset
                        $scope.reset();
                        $scope.album = {};
                    });
                }
            };

            // reset form
            $scope.reset = function () {
                $scope.albumForm.$setPristine();
                $scope.albumForm.$setUntouched();
            };
        }
    ]);

    albumControllers.controller('uploadController', ['$scope', '$rootScope', 'Album', 'Image',
        function ($scope, $rootScope, Album, Image) {
            $scope.image = {};

            // load albums
            Album.query(function (data) {
                $scope.albums = data;
                $scope.image.album = $scope.albums[0];
            });

            // when new album is created, update albums array
            $scope.$on('createAlbumEvent', function (event, album) {
                $scope.albums.push(album);
            });

            // upload image
            $scope.uploadImage = function (image) {
                if ($scope.uploadForm.$valid) {
                    Image.save({}, image, function (response) {
                        $rootScope.$broadcast('uploadImageEvent', response);

                        // reset
                        $scope.reset();
                        $scope.image = {
                            album: $scope.albums[0]
                        };
                        angular.forEach(
                            angular.element("input[type='file']"),
                            function (inputElem) {
                                angular.element(inputElem).val(null);
                            });
                    });
                }
            };

            // reset form
            $scope.reset = function () {
                $scope.uploadForm.$setPristine();
                $scope.uploadForm.$setUntouched();
            };
        }
    ]);
}());