var vimeo = require('../../vimeoLibrary/vimeo').Vimeo;
var request = require('request');
var schema = new Schema({
    clientId: String,
    clientSecret: String,
    accessToken: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Vimeo', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {


    setVimeo: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Vimeo.findOne().lean().exec(function (err, client) {
                        if (err || _.isEmpty(client)) {
                            callback(null, {
                                error: "No Data"
                            });
                        } else {
                            callback(null, client);
                        }
                    });
                },
                function (client, callback) {
                    console.log("client", client);
                    if (client.error) {
                        callback(null, client);
                    } else {
                        CLIENT_ID = client.clientId;
                        CLIENT_SECRET = client.clientSecret;
                        console.log('1');
                        var lib = new vimeo(CLIENT_ID, CLIENT_SECRET);
                        console.log('2');
                        if (client.accessToken) {
                            lib.access_token = client.accessToken;
                            async.concatLimit(data, 4, function (file, callback) {
                                async.waterfall([
                                        function (callback) {
                                            var index = file.fileName.lastIndexOf(".");
                                            // index--;
                                            var matchId = file.fileName.substring(0, index);
                                            console.log("******matchId****", matchId);
                                            Match.findOne({
                                                matchId: matchId
                                            }).exec(function (err, complete) {
                                                console.log(complete);
                                                if (err || _.isEmpty(complete)) {
                                                    callback(null, {
                                                        error: "error found",
                                                        success: file
                                                    });
                                                } else {
                                                    if (_.isEmpty(complete.video)) {
                                                        callback(null, file);
                                                    } else {
                                                        console.log("inside found video", complete);
                                                        callback(null, {
                                                            error: "error found",
                                                            success: file
                                                        });
                                                    }
                                                }
                                            });
                                        },
                                        function (file, callback) {
                                            if (file.error) {
                                                callback(null, file);
                                            } else {
                                                console.log("file", file);
                                                var urlData = {};
                                                // urlData.description = "match description saved";
                                                urlData.link = "https://storage.googleapis.com/match-videos/" + file.fileName;
                                                console.log("link", urlData.link);
                                                lib.streamingUpload(urlData,
                                                    function (err, body, status, headers) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                        var result = {};
                                                        result.body = body;
                                                        result.status = status;
                                                        result.headers = headers;
                                                        callback(null, result);
                                                    }
                                                );
                                            }
                                        },
                                        function (result, callback) {
                                            if (result.error) {
                                                callback(null, result);
                                            } else {
                                                console.log("uri", result.body.uri);
                                                var str = result.body.uri.toString();
                                                var i = str.lastIndexOf("/");
                                                console.log("index", i);
                                                var uri = str.slice(++i, str.length).toString();
                                                result.videoId = uri;
                                                console.log("uri", uri);
                                                var obj = {
                                                    $set: {
                                                        video: uri,
                                                        videoType: "vimeo"
                                                    }
                                                };
                                                Match.update({
                                                    matchId: result.body.name
                                                }, obj).exec(function (err, complete) {
                                                    console.log(complete);
                                                    if (err || _.isEmpty(complete)) {
                                                        callback(null, {
                                                            error: err,
                                                            success: result
                                                        });
                                                    } else {
                                                        callback(null, result);
                                                    }
                                                });
                                            }
                                        },
                                        function (result, callback) {
                                            if (result.error) {
                                                callback(null, result);
                                            } else {
                                                var urlData = {};
                                                urlData.description = "match video";
                                                urlData.videoId = result.videoId;
                                                lib.descriptionUpload(urlData,
                                                    function (err, body, status, headers) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                        var result = {};
                                                        result.body = body;
                                                        result.status = status;
                                                        result.headers = headers;
                                                        callback(null, result);
                                                    }
                                                );
                                            }
                                        }
                                    ],
                                    function (err, data2) {

                                        if (err) {
                                            callback(null, []);
                                        } else if (data2) {
                                            if (_.isEmpty(data2)) {
                                                callback(null, data2);
                                            } else {
                                                callback(null, data2);
                                            }
                                        }
                                    });
                            }, function (err, vidoe) {
                                callback(null, vidoe);
                            });
                        } else {
                            callback(null, "Access Token Not Found");
                        }
                    }
                },
            ],
            function (err, data2) {

                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });

    },

    setVideoDescription: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Vimeo.findOne().lean().exec(function (err, client) {
                        if (err || _.isEmpty(client)) {
                            callback(null, {
                                error: "No Data"
                            });
                        } else {
                            callback(null, client);
                        }
                    });
                },
                function (client, callback) {
                    console.log("client", client);
                    if (client.error) {
                        callback(null, client);
                    } else {
                        CLIENT_ID = client.clientId;
                        CLIENT_SECRET = client.clientSecret;
                        console.log('1');
                        var lib = new vimeo(CLIENT_ID, CLIENT_SECRET);
                        console.log('2');
                        if (client.accessToken) {
                            lib.access_token = client.accessToken;
                            var urlData = {};
                            urlData.videoId = "247794981";
                            urlData.description = "Match saved with description";
                            console.log("link", urlData.link);
                            lib.streamingUpload1(urlData,
                                function (err, body, status, headers) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    var result = {};
                                    result.body = body;
                                    result.status = status;
                                    result.headers = headers;
                                    callback(null, result);
                                }
                            );
                        } else {
                            callback(null, "Access Token Not Found");
                        }
                    }
                },
            ],
            function (err, data2) {

                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });

    },

    generateToken: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Vimeo.findOne().lean().exec(function (err, client) {
                        if (err || _.isEmpty(client)) {
                            callback(null, {
                                error: "No Data"
                            });
                        } else {
                            callback(null, client);
                        }
                    });
                },
                function (client, callback) {
                    if (client.error) {
                        callback(null, client);
                    } else {
                        CLIENT_ID = client.clientId;
                        CLIENT_SECRET = client.clientSecret;
                        var lib = new vimeo(CLIENT_ID, CLIENT_SECRET, client.accessToken);
                        var formData = {
                            method: 'get',
                            // body: data, // Javascript object
                            // json: true, // Use,If you are sending JSON data
                            url: "https://api.vimeo.com/me",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'bearer[' + client.accessToken + ']');
                                xhr.setRequestHeader('consumer_key', '[' + CLIENT_ID + ']');
                                xhr.setRequestHeader('consumer_secret', '[' + CLIENT_SECRET + ']');
                                xhr.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.0');
                                xhr.setRequestHeader('client_id', '[69338819]');
                            },
                            // header: {
                            //     // "Authorization": "Basic" + base64.encode(CLIENT_ID + ":" + CLIENT_SECRET),
                            //     "WWW-Authenticate": "Basic" + base64.encode(CLIENT_ID + ":" + CLIENT_SECRET)
                            // }
                        }
                        request(formData, function (err, res) {
                            if (err) {
                                console.log('Error :', err)
                                return
                            }
                            // console.log(' Body :', body)
                            callback(null, res);
                        });
                    }
                }
            ],
            function (err, data2) {

                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);

                    }
                }
            });
    },

    authenticateCloud: function (data, callback) {
        var final = [];
        console.log("inside");
        const Storage = require('@google-cloud/storage');
        const projectId = 'future-oasis-145313';
        const storage = new Storage({
            projectId: projectId,
            keyFilename: '/home/wohlig/Documents/htdocs/lavasaBackend/config/googleKey/SFA New-f0fd1402dc91.json'
        });
        const bucketName = 'match-videos';
        storage
            .bucket(bucketName)
            .getFiles()
            .then(results => {
                var files = results[0];
                console.log('Files:');
                files.forEach(file => {
                    var temp = {};
                    temp.fileName = file.name;
                    final.push(temp);
                });
                callback(null, final);
            })
            .catch(err => {
                console.error('ERROR:', err);
                callback(err, null);
            });
    },

    getAllFolderNameCloud: function (data, callback) {
        var final = [];
        console.log("inside");
        const Storage = require('@google-cloud/storage');
        const projectId = 'future-oasis-145313';
        const storage = new Storage({
            projectId: projectId,
            keyFilename: '/home/wohlig/Documents/htdocs/lavasaBackend/config/googleKey/SFA New-f0fd1402dc91.json'
        });

        async.waterfall([
            function (callback) {
                ConfigProperty.findOne().lean().exec(function (err, foundConfig) {
                    if (err) {
                        callback(err, null)
                    } else if (!_.isEmpty(foundConfig)) {
                        if (foundConfig.bucketName && foundConfig.year) {
                            var prefix = foundConfig.year + "/" + data.type;
                            var bucketName = foundConfig.bucketName;
                            callback(null, bucketName, prefix);
                        } else {
                            callback("Details Not Found In Config", null);
                        }
                    } else {
                        callback("Config Is Empty", []);
                    }
                });
            },
            function (bucketName, prefix, callback) {
                // const bucketName = 'mumbai-gallery';
                // const prefix = '2017/Sport';
                const options = {
                    prefix: prefix,
                };
                // Lists files in the bucket, filtered by a prefix
                storage
                    .bucket(bucketName)
                    .getFiles(options)
                    .then(results => {
                        var files = results[0];
                        console.log('Files:', files);
                        files.forEach(file => {
                            var temp = {};
                            var foldername = file.name.split("/");
                            console.log("foldername", foldername);
                            if (foldername.length == 4) {
                                temp.fileName = foldername[2];
                                final.push(temp);
                            }
                            final = _.uniqBy(final, "fileName");
                        });
                        callback(null, final);
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
            }
        ], function (err, finalResult) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, finalResult);
            }
        });


    },

    getFilesPerFolder: function (data, callback) {
        var final = [];
        console.log("inside");
        const Storage = require('@google-cloud/storage');
        const projectId = 'future-oasis-145313';
        const storage = new Storage({
            projectId: projectId,
            keyFilename: '/home/wohlig/Documents/htdocs/lavasaBackend/config/googleKey/SFA New-f0fd1402dc91.json'
        });

        // Lists files in the bucket, filtered by a prefix


        async.waterfall([
            function (callback) {
                ConfigProperty.findOne().lean().exec(function (err, foundConfig) {
                    if (err) {
                        callback(err, null)
                    } else if (!_.isEmpty(foundConfig)) {
                        if (foundConfig.bucketName && foundConfig.year) {
                            var prefix = foundConfig.year + "/" + data.type + "/" + data.folderName;
                            var bucketName = foundConfig.bucketName;
                            var eventName = "SFA " + foundConfig.sfaCity + " " + foundConfig.eventYear
                            callback(null, bucketName, prefix, eventName);
                        } else {
                            callback("Details Not Found In Config", null);
                        }
                    } else {
                        callback("Config Is Empty", []);
                    }
                });
            },
            function (bucketName, prefix, eventName, callback) {
                // const bucketName = 'mumbai-gallery';
                // const prefix = '2017/Sport/Archery';
                // const options = {
                //     prefix: prefix,
                // };
                const options = {
                    prefix: prefix,
                };
                // Lists files in the bucket, filtered by a prefix
                console.log("bucketName",bucketName);
                console.log("prefix",prefix);
                
                storage
                    .bucket(bucketName)
                    .getFiles(options)
                    .then(results => {
                        var files = results[0];
                        async.concatSeries(files,function(singleData,callback){
                            var filePropArr = _.split(singleData.name,'/');
                            if(filePropArr[3]){
                                var saveObj={
                                    "folderType":filePropArr[1],
                                    "year":filePropArr[0],
                                    "mediaLink":bucketName + "/" + singleData.name,
                                    "mediaType":"photo",
                                    "folderName":filePropArr[2],
                                    "title":_.split(filePropArr[3],".")[0],
                                    "shareUrl":"",
                                    "eventName":eventName
                                }

                                Gallery.saveData(saveObj,function(err,data){
                                    if(err){
                                        callback(null,err);
                                    }else{
                                        callback(null,data);
                                    }
                                });
                            }else{
                                callback();
                            }   
                           
                        },function(err,finalResult){
                            if(err){
                                callback(err,null);
                            }else{
                                callback(null,finalResult);
                            }
                        })
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
            }
        ], function (err, finalResult) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, finalResult);
            }
        });



    },

    videoUpload: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Vimeo.authenticateCloud(data, function (err, googleData) {
                        if (err || _.isEmpty(googleData)) {
                            err = "Sport,Event,AgeGroup,Gender may have wrong values";
                            callback(null, {
                                error: err,
                                success: googleData
                            });
                        } else {
                            callback(null, googleData);
                        }
                    });
                },
                function (googleData, callback) {
                    console.log("googleData", googleData);
                    if (googleData.error) {
                        callback(null, googleData);
                    } else {
                        Vimeo.setVimeo(googleData, function (err, vimeoData) {
                            if (err || _.isEmpty(vimeoData)) {
                                err = "Sport,Event,AgeGroup,Gender may have wrong values";
                                callback(null, {
                                    error: err,
                                    success: vimeoData
                                });
                            } else {
                                callback(null, vimeoData);
                            }
                        });
                    }
                }
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });

    }

};
module.exports = _.assign(module.exports, exports, model);