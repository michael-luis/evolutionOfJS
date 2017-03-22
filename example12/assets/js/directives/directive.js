'use strict';

var albumDirectives = angular.module("albumDirectives", []);

albumDirectives.directive('fileModel', ['$parse', '$q', function($parse, $q) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            // validate file size, must <= 200KB
            ngModel.$validators.size = function(modelValue, viewValue) {
                if (ngModel.$isEmpty(modelValue)) {
                    return true;
                }

                var file = element[0].files[0];
                var size = parseFloat(file.size / 1024).toFixed(2);
                return size <= 200;

            };

            // validate file format
            ngModel.$asyncValidators.format = function(modelValue, viewValue) {
                if (ngModel.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var d = $q.defer();
                var file = element[0].files[0];
                var fileReader = new FileReader();
                fileReader.onloadend = function(e) {
                    var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                    var allowTypes = ["image/jpeg", "image/png", "image/png"];
                    var type = "";
                    var header = "";
                    for(var i = 0; i < arr.length; i++) {
                        header += arr[i].toString(16);
                    }
                    //console.log(header);

                    // Check the file signature against known types
                    switch (header) {
                        case "89504e47":
                            type = "image/png";
                            break;
                        case "47494638":
                            type = "image/gif";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                            type = "image/jpeg";
                            break;
                        default:
                            type = "unknown"; // Or you can use the blob.type as fallback
                            break;
                    }

                    if (allowTypes.indexOf(type) !== -1) {
                        d.resolve();
                    } else {
                        d.reject();
                    }

                };
                fileReader.readAsArrayBuffer(file);
                return d.promise;
            };

            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(element.val());
                    ngModel.$render();
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    }
}]);