

const twilio = require('twilio');
const User = require('../models/models');

// Load Twilio credentials from environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP using Twilio Verify
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    const phoneRegex = /^\+91\d{10}$|^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({
        message: 'Phone must be in format +91XXXXXXXXXX or XXXXXXXXXX',
      });
    }

    // Format phone with country code
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

    // Send OTP via Twilio Verify
    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms',
      });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      sid: verification.sid,
    });

  } catch (error) {
    console.error('Twilio OTP Send Error:', error.message);
    return res.status(500).json({
      message: 'Failed to send OTP',
      error: error.message,
    });
  }
};




// Verify OTP using Twilio Verify
exports.verifyOtp = async (req, res) => {
  try {
    const { phone,otp  } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        message: 'Phone number and OTP otp are required',
      });
    }

    // Format phone number (with +91 if not present)
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

    // Verify OTP via Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhone,
        code: otp,
      });

    // Check verification status
    if (verificationCheck.status === 'approved') {
            let user = await User.findOne({ phone: formattedPhone });

      if (!user) {
        user = new User({ phone: formattedPhone }); // create with just phone
        await user.save();
        console.log("Phone saved to DB:", formattedPhone);
      } else {
        console.log("Phone already exists in DB:", formattedPhone);
      }

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or not verified',
        status: verificationCheck.status,
      });
    }
  } catch (error) {
    console.error('Twilio OTP Verify Error:', error.message);
    return res.status(500).json({
      message: 'Failed to verify OTP',
      error: error.message,
    });
  }
};


exports.saveDetails = async (req, res) => {
  const { phone, email, firstName, lastName, city } = req.body;
  console.log("Received data:", req.body);

  // ✅ Ensure phone is in +91 format
  const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

  const user = await User.findOneAndUpdate(
    { phone: formattedPhone },
    {
      $set: {
        firstName,
        lastName,
        email,
        city
      }
    },
    { new: true }
  );

  console.log("User details saved successfully:", user);
  res.json({ message: 'Details saved', user });
};



exports.getUser = async (req, res) => {
  try {
    const rawPhone = req.query.phone || req.body.phone;
    if (!rawPhone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Clean and normalize phone number
    let phone = rawPhone.replace(/\s/g, '');
    if (phone.startsWith('+91')) {
      phone = phone;
    } else if (phone.startsWith('91') && phone.length === 12) {
      phone = '+' + phone;
    } else if (phone.length === 10) {
      phone = '+91' + phone;
    } else {
      return res.status(400).json({ message: "Invalid phone format" });
    }

    console.log("Final phone used for query:", phone);

    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
    console.log("User details fetched successfully:", user);

  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Error fetching user details" });
  }
};