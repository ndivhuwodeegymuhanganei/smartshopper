var mongoose = require('mongoose');
// library allows you to synchronize mongo db to elastic search
var mongoosastic = require ('mongoosastic');



var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	//linking 1 to many relationship.. one category has many products
	category: { type: Schema.Types.ObjectId, ref: 'Category'},
	name: String,
	price: Number,
	image: String
});

ProductSchema.plugin(mongoosastic,{
	hosts: [
'localhost:9200'
	]
});

module.exports = mongoose.model('Product', ProductSchema);