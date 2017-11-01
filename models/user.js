
//require the mongoose model moongose is a object modelling tool
var mongoose = require('mongoose');
//hash password
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
//extract the schema out of mongoose
var Schema = mongoose.Schema;


//creating userschema based on the schema from mongoose
var userSchema = new Schema({
	email: {type:String, unique: true, lowercase: true},
	password: String,

	profile: {
		name:{type: String , default: ''},
		picture:{type: String,default: ''}
	},
	address:String,
	history:[{
		date : Date,
		paid: {type: Number, default: 0}
	}]
});
//befor saving to database hash/encrypt
userSchema.pre('save', function(next){
	var user = this;
	//if user is not modified passs
	if(!user.isModified('password')) return next();
	//if user is modifies generate a 10 chars salt password
	bcrypt.genSalt(10,function(err,salt){
		if(err) return next(err);

		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) return next(err);

			user.password = hash;
			next();
		});
	});
});
//for login purpose
userSchema.methods.comparePassword = function(password){
	//compare password passed by the function with the object password 
	return bcrypt.compareSync(password, this.password);
}


userSchema.methods.gravatar =function(size){
	if(!this.size)
		size = 200;
	if(!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';

	var md5 = crypto.createHash('md5').update(this.email).digest('hex');

	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size +'&d=retro';
	
}

//export the model as a User schema to mongoose model
module.exports = mongoose.model('User', userSchema);