var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');



//serialize cookie info] -- convertng data from one format to another
passport.serializeUser(function(user, done){
	done(null, user._id);
});



passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});


passport.use('local-login', new LocalStrategy({

	//username and password
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true

}, function(req, email, password, done){
	User.findOne({email: email}, function(err, user){

		if(err) return done(err);

		if(!user){
			return done(null,false, req.flash('loginMessage', 'No user has been found on the database'));
		}
		if(!user.comparePassword(password)){
			return done(null, false, req.flash('loginMessage', 'Sorry, You supplied an incorrect password'));
		}

		return done(null, user);
	});

}));



exports.isAuthenticated = function(req,res, done){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}