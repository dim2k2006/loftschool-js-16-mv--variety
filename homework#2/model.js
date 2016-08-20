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
    getUser: function() {
        return this.callApi('users.get', {});
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
