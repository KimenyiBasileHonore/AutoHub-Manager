import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  names: String,
  address: String, 
  phone: Number, 
  email: String, 
  role: {
    type: String,
    default: "CLIENT",
  },
  password: String, 
});

const User = mongoose.model("CLIENT", clientSchema);

export default User;
