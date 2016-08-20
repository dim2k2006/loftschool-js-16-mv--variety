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
        var code = `var offset = 0;
                    var photos = API.photos.getAll({"extended": 1, "count": 200, "offset": offset, "v": 5.53}).items;
                    
                    offset = offset + 200;
                    
                    while (offset < 5000) {
                        photos = photos + API.photos.getAll({"extended": 1, "count": 200, "offset": offset, "v": 5.53}).items;
                        offset = offset + 200;
                    }
                    
                    return photos;
                `;

        return this.callApi('execute', {code: code});
    },
    getPhotosComments: function() {
        

        return this.callApi('photos.getAllComments', {extended: 1, 'v': 5.53});
    }
};
