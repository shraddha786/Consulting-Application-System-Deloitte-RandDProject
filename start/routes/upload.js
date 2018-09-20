const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

var User = mongoose.model('User');
var router = express.Router();

// Middleware
router.use(bodyParser.json());
router.use(methodOverride('_method'));

// Mongo URI
const mongoURI = 'mongodb://localhost/test-chirp';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () =>
{
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage(
{
    url: mongoURI,
    file: (req, file) =>
    {
        return new Promise((resolve, reject) =>
        {
            crypto.randomBytes(16, (err, buf) =>
            {
                if (err)
                {
                    return reject(err);
                }
                const filename = file.originalname; //buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer(
{
    storage
});

// @route GET /
// @desc Loads form
router.get('/', (req, res) =>
{
    gfs.files.find().toArray((err, files) =>
    {

        // Check if files
        if (!files || files.length === 0)
        {
            res.render('upload',
            {
                files: false
            });
        }
        else
        {
            files.map(file =>
            {
                file.id = file._id;
            });

            return res.send(200, files);
        }
    });
});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/', upload.single('file'), (req, res) =>
{
    var s= String(req.rawHeaders);
    var requiredString = s.substring(
        s.indexOf("userCookie=") + 11, 
        s.lastIndexOf("; p")
    );

    /**User.findById('5ba237bcd33a3e063c73a72e', function(err, users)
        {

            users.file_ID = req.file.id;
        
            users.save(function(err, users)
            {
                if (err)
                    res.send(err);
            });
        }); 


    console.log(req.file.id);
    console.log(s); */
    res.redirect('/#/complete');
});

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) =>
{
    gfs.files.find().toArray((err, files) =>
    {
        // Check if files
        if (!files || files.length === 0)
        {
            return res.status(404).json(
            {
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) =>
{
    gfs.files.findOne(
    {
        filename: req.params.filename
    }, (err, file) =>
    {
        // Check if file
        if (!file || file.length === 0)
        {
            return res.status(404).json(
            {
                err: 'No file exists'
            });
        }
        else
        {

            // File exists
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
    });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) =>
{
    gfs.remove(
    {
        _id: req.params.id,
        root: 'uploads'
    }, (err, gridStore) =>
    {
        if (err)
        {
            return res.status(404).json(
            {
                err: err
            });
        }

        res.redirect('/#/upload');
    });
});

module.exports = router;