var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            groups = groups.filter(function(item) {
               return typeof item === 'object';
            });
            
            results.innerHTML = View.render('groups', {list: groups});
        });
    },
    photosRoute: function() {
        var photos = [],
            comments = [];

        return Model.getPhotos().then(function(response) {
            return new Promise(function(resolve, reject) {
                photos = response.filter(function(item) {
                    return typeof item === 'object';
                });

                resolve();
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
                Model.getPhotosComments().then(function(response) {
                    comments = response.filter(function(item) {
                        return typeof item === 'object';
                    });

                    resolve();
                });
            });
        }).then(function() {
            photos.forEach(function(item, index, arr) {
                var id = item.id,
                    itemComments = comments.filter(function(item) {
                        return item.pid === id;
                    });

                item.commentsCount = itemComments.length;
            });

            results.innerHTML = View.render('photos', {list: photos});
        });
    }
};
