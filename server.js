/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var favicon = require('serve-favicon');
var MongoClient = require('mongodb').MongoClient

var db;
var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname,'app','images','favicon.ico')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/games', function(req, res) {
    db.collection("games").find({}).toArray(function(err, docs) {
        if (err) throw err;
        res.json(docs);
    });
});

app.post('/api/games', function(req, res) {
    var newGame = {
        id: Math.random().toString(36).substr(2, 5),
        //Players? Dunno what else games will have.
        //TODO : Define our data model
    };
    db.collection("games").insertOne(newGame, function(err, result) {
        if (err) throw err;
        db.collection("games").find({}).toArray(function(err, docs) {
            if (err) throw err;
            res.json(docs);
        });
    });
});

app.get('/api/games/:id', function(req, res) {
    db.collection("games").find({"id": Number(req.params.id)}).toArray(function(err, docs) {
        if (err) throw err;
        res.json(docs);
    });
});

app.delete('/api/games/:id', function(req, res) {
    db.collection("games").deleteOne(
        {'id': Number(req.params.id)},
        function(err, result) {
            if (err) throw err;
            db.collection("games").find({}).toArray(function(err, docs) {
                if (err) throw err;
                res.json(docs);
            });
        });
});

// Send all routes/methods not specified above to the app root.
app.use('*', express.static(APP_PATH));

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

// This assumes that the MongoDB password has been set as an environment variable.
var mongoURL = 'mongodb://cs336:bjarne@ds159737.mlab.com:59737/336-final-proj';
MongoClient.connect(mongoURL, function(err, dbConnection) {
    if (err) throw err;
    db = dbConnection;
});
