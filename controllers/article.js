const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (req, res) =>{
        res.render('article/create');
    },
    createPost: (req, res) => {
        let articleParts = req.body;

        let errorMsg = '';
        if (!req.isAuthenticated()) {
            errorMsg = 'You must be logged to post articles!';
        } else if (!articleParts.title) {
            errorMsg = 'Invalid title!';
        } else if (!articleParts.content) {
            errorMsg = 'Invalid content!';
        }

        if (errorMsg) {
            res.render('article/create', {
                error: errorMsg
            });
            return;
        }

        let userId = req.user.id;
        articleParts.author = userId;

        Article.create(articleParts).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.render('article/create', {
                        error: err.message
                    });
                } else {
                    res.redirect('/')
                }
            });
        });
    },
    detailsGet: (req, res) =>{
        let id = req.params.id;

        Article.findById(id).populate('author').then(article =>{
            res.render('article/details', article);
        });

    }

};
