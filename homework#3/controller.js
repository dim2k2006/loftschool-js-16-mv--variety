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
            comments = [],
            users = [];

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
            return new Promise(function(resolve, reject) {
                photos.forEach(function(item, index, arr) {
                    var id = item.id,
                        itemComments = comments.filter(function(item) {
                            return item.pid === id;
                        });

                    if (itemComments.length === 0) {
                        item.commentsCount = 0;
                        item.commentsError = 'К этому фото нет комментариев.';
                    } else {
                        item.commentsCount = itemComments.length;
                        item.commentsError = '';
                    }
                    
                    item.commentsInfo = itemComments.reverse();

                    resolve();
                });
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
                var id = [];

                photos.forEach(function(item, index, arr) {
                    item.commentsInfo.forEach(function(commentItem, commentIndex, commentArr) {
                        if (id.indexOf(commentItem.from_id) === -1) {
                            id.push(commentItem.from_id);
                        }
                    });
                });

                Model.getUsersAll(id, 'photo_100').then(function(response) {
                    users = response;
                    resolve();
                });
            });
        }).then(function() {
            photos.forEach(function(item) {
                 item.commentsInfo.forEach(function(commentItem) {
                     var id = commentItem.from_id;

                     users.forEach(function(userItem) {
                         var userId = userItem.id;

                         if (id === userId) {

                             commentItem.authorPhoto = userItem.photo_100;
                             commentItem.authorName = `${userItem.first_name} ${userItem.last_name}`;

                         }
                     });
                 });
            });

            results.innerHTML = View.render('photos', {list: photos});
        });
    }
};
