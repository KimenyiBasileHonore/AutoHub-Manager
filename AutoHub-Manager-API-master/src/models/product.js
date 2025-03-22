import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    photo: [{
        path: String,
    }],
    name: String,
    price: String,
    gearbox: String,
    tank: String,
    basicInfo: String,
    region: String,
    color: String,
    moreDetails: String,
    status: {
        type: String,
        enum: ["USED", "NEW"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    stock: {  // NEW FIELD ADDED
        type: Number,
        required: true,
        default: 0
    },
    
});

const Product = mongoose.model('Product', productSchema);
export default  Product;
