// beginning an Immediately-Invoked-Function-Expression
(function()
{
    var ImageUploader = (function()
                        {
                            var DEFAULTS = {
                                                template: '<div class="{class}"><img src="{src}" alt="{name}"/></div>',
                                                containerClass: 'thumbnail'
                                            };
                            // a private method which is declared locally inside this scope
                            var ImageUploader = function(element, options)
                                                        {
                                                            SELF = this; // Normally the main reason for using this approach is to make the current this available to subfunctions or closures
                                                            this.options = DEFAULTS;
                                                            extend(this.options, options);//add options passed from the options argument to the this.options property
                                                            this.$element = element; //once the form element is passed into this function, it gets assigned to $element
                                                            this.$email = this.$element.elements[this.options.email]; //using the options object to get the value from the element and store in a var
                                                            this.$name = this.$element.elements[this.options.name];
                                                            this.$file = this.$element.elements[this.options.file];

                                                            // binding events
                                                            if (this.$element.addEventListener)
                                                            {
                                                                this.$element.addEventListener("submit", function(e)
                                                                                                        {
                                                                                                            e.preventDefault();
                                                                                                            if (validate()) upload();
                                                                                                        }
                                                                                                );
                                                            }
                                                            else if (this.$element.attachEvent)  ///is there a reason for this usage? https://msdn.microsoft.com/en-us/library/ms536343%28v=vs.85%29.aspx
                                                            {
                                                                this.$element.attachEvent("submit", function(e)
                                                                                                    {
                                                                                                        if (validate()) upload();
                                                                                                    }
                                                                                         );
                                                            }
                                                            render(); //
                                                        };
                            var extend = function(obj, props)
                                         {
                                            for (var prop in props)
                                            {
                                                if (props.hasOwnProperty(prop))
                                                {
                                                    obj[prop] = props[prop];
                                                }
                                            }
                                        };

                            var get = function(url)
                                        {
                                            // Return a new promise.
                                            // Part of the ECMAScript 2015 standard. the Promise object is used for deferred and asynchronous computations.
                                            // It represents an operation that hasn't completed yet, but is expected in the future
                                            return new Promise(function(resolve, reject)
                                            {
                                                // Do the usual XHR stuff
                                                var req = new XMLHttpRequest();
                                                req.open('GET', url);
                                                req.onload = function()
                                                                {
                                                                    // This is called even on 404 etc
                                                                    // so check the status
                                                                    if (req.status == 200)
                                                                    {
                                                                    // Resolve the promise with the response text
                                                                    resolve(req.response);
                                                                    }
                                                                    else
                                                                    {
                                                                        // Otherwise reject with the status text
                                                                        // which will hopefully be a meaningful error
                                                                        reject(Error(req.statusText));
                                                                    }
                                                                };

                                                // Handle network errors
                                                req.onerror = function()
                                                {
                                                    reject(Error("Network Error"));
                                                };

                                                // Make the request
                                                req.send();
                                            });
                                        };

                            var getJSON = function(url)
                            {
                                return get(url).then(JSON.parse).catch(function(err)
                                {
                                    //error is thrown and caught if get URL and JSON parse fails
                                    console.log("request failed for", url, err);
                                    throw err;
                                });
                            };

                            var templateEngine = function(template, data)
                            {
                                for(var key in data)
                                    template = template.replace(new RegExp('{' + key + '}', 'g'), data[key]);
                                return template;
                            };


                            var validate = function()
                            {
                                if (SELF.$file.value === "")
                                {
                                    alert("Please select an image to upload!");
                                    return false;
                                } else
                                {
                                    if (typeof (SELF.$file.files) != "undefined")
                                    {
                                        var size = parseFloat(SELF.$file.files[0].size / 1024).toFixed(2);
                                        if (size > 200)
                                        {
                                            alert("Image is too large, please upload an image less than 200KB.");
                                            return false;
                                        }
                                    }
                                }

                            if (SELF.$name.value === "")
                            {
                                alert("Please enter name of the image!");
                                return false;
                            }

                            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(SELF.$email.value))
                            {
                                return true
                            } else
                            {
                                alert("Invalid E-mail Address! Please re-enter.");
                                return false;
                            }};

                            var upload = function()
                            {
                                // Create a new FormData object
                                var formData = new FormData();

                                // Add the file to request
                                formData.append('image-file', SELF.$file.files[0], SELF.$file.files[0].name);

                                // Add email to request
                                formData.append('email', SELF.$email.value);

                                // Add name to request
                                formData.append('name', SELF.$name.value);

                                // Set up the request.
                                var xhr = new XMLHttpRequest();

                                // Open the connection.
                                xhr.open('POST', SELF.options.handler, true);

                                // Set up a handler for when the request finishes.
                                xhr.onload = function ()
                                {
                                    if (xhr.status === 200)
                                    {
                                        // File(s) uploaded.
                                        alert("Upload successfully!");
                                        SELF.$element.reset();

                                        // refresh pictures
                                        render();
                                    }
                                    else
                                    {
                                        alert('An error occurred!');
                                    }
                                };

                                // Send the Data.
                                xhr.send(formData);
                            };

                            var render = function()
                            {
                                getJSON('data/upload.json').then(function(response)
                                {
                                    var pictures = response;
                                    var picturesHtml = "";
                                    pictures.forEach(function(element, index, array)
                                    {
                                        picturesHtml += templateEngine(SELF.options.template, {"class": SELF.options.containerClass, "src": "uploads/" + element.image, "name": element.name});
                                    });
                                    document.getElementById(SELF.options.container).innerHTML = picturesHtml;
                                    console.log("Success!", response);
                                }).catch(function(error) {
                                    console.log("Failed!", error);
                                    });
                            }

                            return ImageUploader;
                        })();

                        if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
                        {
                            module.exports = ImageUploader;
                        }
                        else
                        {
                            if (typeof define === 'function' && define.amd)
                            {
                                define([], function()
                                {
                                    return ImageUploader;
                                });
                            }
                            else
                            {
                                window.ImageUploader = ImageUploader;
                            }
                        }
})();