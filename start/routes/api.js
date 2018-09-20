var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
//Used for routes that must be authenticated.
function isAuthenticated(req, res, next)
{
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if (req.method === "GET")
    {
        return next();
    }
    else
    {
        return next();
    }
    //if (req.isAuthenticated()){
    //	return next();
    //}



    // if the user is not authenticated then redirect him to the login page
    // return res.redirect('/#login');
};


router.route('/accounts')
    //gets account
    .get(function(req, res)
    {
        console.log('debug1');
        User.find(function(err, users)
        {
            console.log('debug2');
            if (err)
            {
                return res.send(500, err);
            }
            return res.send(200, users);
        });
    })

router.route('/accounts/:id')
    //gets account by ID
    .get(function(req, res)
    {
        User.findById(req.params.id, function(err, user)
        {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/posts')
    //creates a new post
    .post(function(req, res)
    {

        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;
        post.save(function(err, post)
        {
            if (err)
            {
                return res.send(500, err);
            }
            return res.json(post);
        });
    })
    //gets all posts
    .get(function(req, res)
    {
        console.log('debug1');
        Post.find(function(err, posts)
        {
            console.log('debug2');
            if (err)
            {
                return res.send(500, err);
            }
            return res.send(200, posts);
        });
    });

//post-specific commands. likely won't be used
router.route('/posts/:id')
    //gets specified post
    .get(function(req, res)
    {
        Post.findById(req.params.id, function(err, post)
        {
            if (err)
                res.send(err);
            res.json(post);
        });
    })
    //updates specified post
    .put(function(req, res)
    {
        Post.findById(req.params.id, function(err, post)
        {
            if (err)
                res.send(err);

            post.created_by = req.body.created_by;
            post.text = req.body.text;

            post.save(function(err, post)
            {
                if (err)
                    res.send(err);

                res.json(post);
            });
        });
    })
    //deletes the post
    .delete(function(req, res)
    {
        Post.remove(
        {
            _id: req.params.id
        }, function(err)
        {
            if (err)
            {
                res.send(err);
            }

            res.json("deleted :(");
        });
    });

// UPDATE USER EMAIL (will later move onto update details)
router.route('/updateinfo/:id')
    //Semi finished put request
    .put(function(req, res)
    {
        User.findById(req.params.id, function(err, users)
        {
            if (err)
                res.send(err);
            if (req.body.email != null)
            {
                users.email = req.body.email;
            }
            if (req.body.desired_location != null)
            {
                users.desired_location = req.body.desired_location;
            }
            if (req.body.date_of_birth != null)
            {
                users.date_of_birth = req.body.date_of_birth;
            }
            if (req.body.role != null)
            {
                users.role = req.body.role;
            }
            if (req.body.filename != null)
            {
                users.filename = req.body.filename;
            }
            if (req.body.stage != null)
            {
                users.stage = req.body.stage;
            }
            if (req.body.file_ID != null)
            {
                users.file_ID = req.body.file_ID;
            }

            users.save(function(err, users)
            {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });
    })

module.exports = router;