var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var moment = require('moment');
var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'simple-mean';

var db = new MongoDB(dbName, new Server(dbHost, dbPort, { auto_reconnect: true }), { w: 1 });
db.open(function (e, d) {
    if (e) {
        console.log(e);
    } else {
        //console.log('connected to database :: ' + dbName);
    }
});

var pages = db.collection('pages');
var accounts = db.collection('accounts');

exports.getMenuForUser = function (uid, callback) {
    accounts.findOne({ _id: getObjectId(uid) },
		function (e, res) {
		    if (e) { callback(null, e) }
		    else {
		        accounts.count(function (err, count) {
		            console.log(count);
		            if (count == 1) {
		                res.IsAdministrator = true;
		            }
		            delete res.Password;
		            if (res.IsAdministrator == true) {
		                callback([{ "Title": "Home", "templateUrl": "home.html", "Controller": "" },
                                    { "Title": "About", "templateUrl": "about.html", "Controller": "" },
                                    { "Title": "Secure Page", "templateUrl": "SecuredPage.html", "Controller": "", "Secure": true },
                                    { "Title": "Administration", "templateUrl": "admin.html", "Controller": "", "Secure": true }
		                ]);
		            } else {
		                callback([{ "Title": "Home", "templateUrl": "home.html", "Controller": "" },
                                    { "Title": "About", "templateUrl": "about.html", "Controller": "" },
                                    { "Title": "Secure Page", "templateUrl": "SecuredPage.html", "Controller": "", "Secure": true }
		                ]);
		            }
		        });
		    }
		});
};

var getObjectId = function (id) {
    return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}