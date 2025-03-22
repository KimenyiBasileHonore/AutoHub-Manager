import bcrypt from 'bcryptjs';
import User from '../models/client.js';
import Vendor from '../models/vendor.js';
import generateToken from '../helpers/tokenGenerator.js';

export const ClientSignup = async (req, res) => {
  try {
    const { names, address, phone, email, password, role } = req.body;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const client = new User({
      names,
      address,
      phone,
      email,
      password: hashedPassword, 
      role,
    });

    await client.save();
    const token = await generateToken(email);
    console.log(client);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const ClientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in the database
    const user = await User.findOne({ email });
    console.log('User found:', user); // Debugging statement

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch); // Debugging statement

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token using correct userId
    const token = generateToken(user);  
    console.log('Generated token:', token); // Debugging statement

    res.status(200).json({ message: 'User logged in successfully', token, userId: user._id });
  } catch (error) {
    console.error('Error during login process:', error);  // Detailed error logging
    res.status(500).json({ error: 'Error logging in user' });
  }
};


export const VendorSignup = async (req, res) => {
  try {
    const { businessname, address, regno, businessemail, password, role } = req.body;

    const existingCompany = await Vendor.findOne({ businessname });

    if (existingCompany) {
      return res.status(400).json({ error: 'Company name already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = new Vendor({
      businessname,
      address,
      regno,
      businessemail,
      password: hashedPassword, // Store the hashed password
      role,
    });

    await company.save();
    const token = await generateToken(businessemail);

    res.status(201).json({ message: 'Vendor registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Error registering company' });
  }
};

export const VendorLogin = async (req, res) => {
  try {
    const { businessemail, password } = req.body;
    const company = await Vendor.findOne({ businessemail });
    
    if (!company) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await generateToken(businessemail);
    res.status(200).json({ 
      message: 'Vendor logged in successfully', 
      token,
      role: company.role // Include the role in the response
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in company' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getClientProfile = async (req, res) => {
  try {
    const client = req.user; // Assuming `req.user` is set by authentication middleware
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const UserCount = async (req, res) => {
  try {
    const clientCount = await User.countDocuments();
    res.status(200).json({ totalClients: clientCount });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find(); // Fetch all vendors
    res.status(200).json({ vendors });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const createAdminUser  = async () => {
  try {
    const adminEmail = 'admin@akagera.com'; // Admin email
    const adminPassword = 'admin123'; // Admin password
    const existingAdmin = await Vendor.findOne({ businessemail: adminEmail });

    if (!existingAdmin) {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new Vendor({
        businessname: 'AutoHub Admin',
        address: '123 Admin St',
        regno: 1, // You can set this to a unique number
        businessemail: adminEmail,
        password: hashedPassword,
        role: 'ADMIN', // Set the role to ADMIN
        isAdmin: true, // Set isAdmin to true if you have this field
      });

      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
