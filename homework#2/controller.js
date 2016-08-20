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
        Model.getPhotos().then(function(photos) {
            console.log(photos);

            Model.getPhotosComments().then(function(comments) {
                console.log(comments);
            });
        });
        // return Model.getPhotos().then(function(photos) {
        //     console.log(photos);
        //
        //     // results.innerHTML = View.render('news', {list: news.items});
        // });
    }
};
