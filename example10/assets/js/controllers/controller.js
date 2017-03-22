'use strict';

var albumControllers = angular.module('albumControllers', []);

albumControllers.controller('imageListController', ['$scope', 'DataService',
    function($scope, dataService) {
        // load all images
        dataService.getImages.then(function(data) {
            $scope.images = data;
        });

        // load all albums
        dataService.getAlbums.then(function (data) {
            $scope.albums = data;
        });

        // when new album is created, update albums array
        $scope.$on('createAlbumEvent', function(event, album) {
            $scope.albums.push({name: album.name});
        });

        // when new image is uploaded, update images array
        $scope.$on('uploadImageEvent', function(event, image) {
            var src = image.image.name;
            var newImage = angular.copy(image);
            newImage.image = src;
            $scope.images.push(newImage);
        });
    }
]);

albumControllers.controller('albumController', ['$scope', '$rootScope', 'DataService',
    function($scope, $rootScope, dataService) {
        // create album
        $scope.createAlbum = function() {
            if ($scope.albumForm.$valid) {
                dataService.createAlbum($scope.album).then(function () {
                    $rootScope.$broadcast('createAlbumEvent', $scope.album);

                    // reset
                    $scope.reset();
                    $scope.album = {};
                });
            }
        };

        // reset form
        $scope.reset = function() {
            $scope.albumForm.$setPristine();
            $scope.albumForm.$setUntouched();
        };
    }
]);

albumControllers.controller('uploadController', ['$scope', '$rootScope', 'DataService',
    function($scope, $rootScope, dataService) {
        $scope.image = {};

        // load albums
        dataService.getAlbums.then(function (data) {
            $scope.albums = data;
            $scope.image.album = $scope.albums[0].name;
        });

        // upload image
        $scope.uploadImage = function(image) {
            if ($scope.uploadForm.$valid) {
                dataService.uploadImage(image).then(function () {
                    $rootScope.$broadcast('uploadImageEvent', image);

                    // reset
                    $scope.reset();
                    $scope.image = {
                        album: $scope.albums[0].name,
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
        $scope.reset = function() {
            $scope.uploadForm.$setPristine();
            $scope.uploadForm.$setUntouched();
        };
    }
]);