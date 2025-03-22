import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  businessname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  regno: {
    type: Number,
    required: true,
    unique: true,
  },
  businessemail: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  role: {
    type: String,
    enum: ["VENDOR", "ADMIN"], // Allow only specific roles
    default: "VENDOR",
  },
  password: {
    type: String,
    required: true,
  },
  adminPrivileges: {
    type: Boolean,
    default: true, // Default to false, can be set to true for admin users
  },
});

// Create a method to check if the vendor is an admin
vendorSchema.methods.isAdmin = function() {
  return this.role === "ADMIN" || this.adminPrivileges;
};

const Vendor = mongoose.model("VENDOR", vendorSchema);

export default Vendor;