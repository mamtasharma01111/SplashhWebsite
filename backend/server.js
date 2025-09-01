const express = require('express');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order API
app.post("/api/payment/order", async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, 
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating order");
    }
});

app.post("/api/payment/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ status: "success", paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});


// Serve static files from parent directory
app.use(express.static('public'));

const config = {
    email: {
        user: process.env.EMAIL_USER || 'splashhresorts@gmail.com',
        pass: process.env.EMAIL_PASS || ''
    },
    server: {
        port: PORT
    }
};

// Create Nodemailer transporter only if credentials are available
let transporter = null;
if (config.email.pass && config.email.pass !== '') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });

    // Verify transporter connection
    transporter.verify(function(error, success) {
        if (error) {
            console.log('SMTP Server Error:', error);
        } else {
            console.log('SMTP Server is ready to send emails');
        }
    });
} else {
    console.log('⚠️  Email credentials not configured. Forms will be processed but emails will not be sent.');
}

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message, newsletter } = req.body;

        // Email content for contact form
        const mailOptions = {
            from: config.email.user,
            to: 'splashhresorts@gmail.com',
            replyTo: email,
            subject: `New Contact Form Submission - ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Form Submission</h2>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Name:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Email:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Phone:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Subject:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Message:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Newsletter:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${newsletter ? 'Yes' : 'No'}</td>
                        </tr>
                    </table>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This message was sent from the Splashh Royal Resort & Banquet contact form.
                    </p>
                </div>
            `
        };

        // Send email if transporter is available
        if (transporter) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('📧 Contact form submission received (emails not sent - no transporter):', { firstName, lastName, email, subject });
        }

        res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Banquet Form Endpoint
app.post('/api/banquet', async (req, res) => {
    try {
        const { selectedHall, eventDate, eventTime, eventType, guestCount, clientName, clientEmail, clientPhone, specialRequests } = req.body;

        const mailOptions = {
            from: config.email.user,
            to: 'splashhresorts@gmail.com',
            replyTo: clientEmail,
            subject: `New Banquet Hall Inquiry - ${eventType}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Banquet Hall Inquiry</h2>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Selected Hall:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${selectedHall}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Event Date:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${eventDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Event Time:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${eventTime}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Event Type:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${eventType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Expected Guests:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${guestCount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Client Name:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${clientName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Client Email:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${clientEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Client Phone:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${clientPhone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Special Requests:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${specialRequests || 'None'}</td>
                        </tr>
                    </table>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This inquiry was sent from the Splashh Royal Resort & Banquet website.
                    </p>
                </div>
            `
        };

        if (transporter) {
            await transporter.sendMail(mailOptions);

        } else {
            console.log('📧 Banquet inquiry received (emails not sent - no transporter):', { clientName, clientEmail, eventType, selectedHall });
        }

        res.json({ success: true, message: 'Banquet inquiry submitted successfully' });
    } catch (error) {
        console.error('Banquet form error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Room Booking Form Endpoint
app.post('/api/rooms', async (req, res) => {
    try {
        const { selectedRoom, roomPrice, checkIn, checkOut, guests, rooms, guestName, guestEmail, guestPhone } = req.body;

        const mailOptions = {
            from: config.email.user,
            to: 'splashhresorts@gmail.com',
            replyTo: guestEmail,
            subject: 'New Room Booking Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Room Booking Request</h2>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Selected Room:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${selectedRoom}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Price per Night:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">₹${roomPrice}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Check-in Date:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${checkIn}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Check-out Date:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${checkOut}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Number of Guests:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${guests}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Number of Rooms:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${rooms}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Guest Name:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${guestName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Guest Email:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${guestEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Guest Phone:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${guestPhone}</td>
                        </tr>
                    </table>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This booking request was sent from the Splashh Royal Resort & Banquet website.
                    </p>
                </div>
            `
        };

        if (transporter) {
            await transporter.sendMail(mailOptions);

        } else {
            console.log('📧 Room booking request received (emails not sent - no transporter):', { guestName, guestEmail, selectedRoom, checkIn, checkOut });
        }

        res.json({ success: true, message: 'Room booking request submitted successfully' });
    } catch (error) {
        console.error('Room booking error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Testimonial Form Endpoint
app.post('/api/testimonial', async (req, res) => {
    try {
        const { reviewerName, reviewText } = req.body;

        const mailOptions = {
            from: config.email.user,
            to: 'splashhresorts@gmail.com',
            subject: 'New Testimonial Submission',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Testimonial Submission</h2>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Reviewer Name:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${reviewerName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Review Text:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${reviewText}</td>
                        </tr>
                    </table>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This testimonial was submitted from the Splashh Royal Resort & Banquet website.
                    </p>
                </div>
            `
        };

        if (transporter) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('📧 Testimonial received (email not sent - no transporter):', { reviewerName, reviewText });
        }

        res.json({ success: true, message: 'Testimonial submitted successfully' });
    } catch (error) {
        console.error('Testimonial error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Splashh Resort Email Backend is running' });
});

// Start server
app.listen(config.server.port, () => {
    console.log(`🚀 Splashh Resort Email Backend running on port ${config.server.port}`);
    console.log(`📧 Email service: ${config.email.user}`);
});
