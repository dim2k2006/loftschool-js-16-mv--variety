var Model = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, perms);
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    },
    getUser: function(id, fields) {
        return this.callApi('users.get', {user_ids: id, fields: fields});
    },
    getUsersAll: function(id, fields) {
        var self = this,
            idLength = id.length,
            idSection = Math.ceil(idLength / 1000),
            idOffset = 0,
            idArray = [],
            tmp = [],
            i = 0,
            query = '',
            offset = 0,
            stringArray = [],
            users = [];

        for (i; i < idSection; i++) {

            idArray.push(id.splice(idOffset, idOffset + 1000));

        }

        return new Promise(function(resolve, reject) {
            query = function() {
                if (idArray[offset]) {

                    var string = idArray[offset].join(',');

                    self.getUsersAllQuery(string).then(function(response) {
                        if (response.length !== 0) {

                            users = users.concat(response);
                            offset = offset + 1;

                            setTimeout(function() {
                                query();
                            }, 333);

                        } else {
                            
                            resolve(users);

                        }
                    });

                } else {

                    resolve(users);

                }
            };

            query();
        });
    },
    getUsersAllQuery: function(id) {
        var code = `var users = [],
                        query = 0;

                    query = API.users.get({"user_ids": "${id}", "fields": "photo_100", "v": "5.53"});
                        
                    users = users + query;
                            
                    return users;
                `;

        return this.callApi('execute', {code: code});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', {fields: 'photo_100'});
    },
    getNews: function() {
        return this.callApi('newsfeed.get', {filters: 'post', count: 20});
    },
    getGroups: function() {
        return this.callApi('groups.get', {extended: 1, fields: 'photo_100, name'});
    },
    getPhotos: function() {
        var self = this,
            query = '',
            offset = 0,
            photos = [];

        return new Promise(function(resolve, reject) {
            query = function() {
                self.getPhotosQuery(offset).then(function(response) {

                    if (response.length !== 0) {

                        photos = photos.concat(response);
                        offset = offset + 5000;

                        setTimeout(function() {
                            query();
                        }, 333);

                    } else {

                        resolve(photos);

                    }
                });
            };

            query();
        });
    },
    getPhotosQuery: function(offset) {
        var code = `var offset = ${offset},
                        photos = [],
                        query = 0;
                    
                    while (offset < 5000) {
                        query = API.photos.getAll({"extended": 1, "count": 200, "offset": offset, "v": 5.53}).items;
                        
                        if (query) {
                            photos = photos + query;
                            offset = offset + 200;
                        } else {
                            return photos;
                        }
                    }
                    
                    return photos;
                `;

        return this.callApi('execute', {code: code});
    },
    getPhotosComments: function() {
        var self = this,
            query = '',
            offset = 0,
            comments = [];

        return new Promise(function(resolve, reject) {
            query = function() {
                self.getPhotosCommentsQuery(offset).then(function(response) {

                    if (response.length !== 0) {

                        comments = comments.concat(response);
                        offset = offset + 2500;

                        setTimeout(function() {
                            query();
                        }, 333);

                    } else {

                        resolve(comments);

                    }
                });
            };

            query();
        });
    },
    getPhotosCommentsQuery: function(offset) {
        var code = `var offset = ${offset},
                        comments = [],
                        query = 0;
                    
                    while (offset < 2500) {
                        query = API.photos.getAllComments({"extended": 1, "count": 100, "offset": offset, "v": 5.53}).items;
                        
                        if (query) {
                            comments = comments + query;
                            offset = offset + 100;
                        } else {
                            return comments;
                        }
                    }
                    
                    return comments;
                `;

        return this.callApi('execute', {code: code});
    }
};
