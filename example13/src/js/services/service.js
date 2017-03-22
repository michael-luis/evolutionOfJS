(function() {

    'use strict';

    var albumServices = angular.module('albumServices', ['ngResource']);

    albumServices.factory('Album', ['$resource',
        function ($resource) {
            return $resource("api/albums/:id");
        }
    ]);

    albumServices.factory('Image', ['$resource',
        function ($resource) {
            return $resource("api/images/:id", {id: "@id"}, {
                save: {
                    method: 'POST',
                    transformRequest: function (data) {
                        if (data === undefined) return data;
                        var fd = new FormData();
                        angular.forEach(data, function (value, key) {
                            if (value instanceof FileList) {
                                if (value.length == 1) {
                                    fd.append(key, value[0]);
                                } else {
                                    angular.forEach(value, function (file, index) {
                                        fd.append(key + '_' + index, file);
                                    });
                                }
                            } else if (value instanceof File) {
                                fd.append(key, value);
                            } else {
                                if (value !== null && typeof value === 'object') {
                                    fd.append(key, JSON.stringify(value));
                                } else {
                                    fd.append(key, value);
                                }
                            }
                        });
                        return fd;
                    },
                    headers: {'Content-Type': undefined}
                }
            });
        }
    ]);
}());