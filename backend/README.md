# Splashh Resort Email Backend

This is a Node.js backend service that handles form submissions from the Splashh Resort website and sends emails using Nodemailer.

## Features

- ✅ **Contact Form** - Handles general inquiries
- ✅ **Banquet Form** - Handles banquet hall inquiries  
- ✅ **Rooms Form** - Handles room booking requests
- ✅ **Testimonial Form** - Handles guest reviews
- ✅ **Auto-replies** - Sends confirmation emails to customers
- ✅ **Professional Email Templates** - Beautiful HTML email formatting
- ✅ **Error Handling** - Comprehensive error handling and logging

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Email Settings

Create a `config.js` file in the backend directory:

```javascript
module.exports = {
    email: {
        user: 'splashhresorts@gmail.com',
        pass: 'your-app-password-here'
    },
    server: {
        port: 3000
    }
};
```

**Important:** You need to use a Gmail App Password, not your regular password.

#### How to Get Gmail App Password:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use that password in your config.js file

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on port 3000 (or the port specified in your config).

## API Endpoints

### POST `/api/contact`
Handles contact form submissions.

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "General Inquiry",
    "message": "Hello, I have a question...",
    "newsletter": true
}
```

### POST `/api/banquet`
Handles banquet hall inquiries.

**Request Body:**
```json
{
    "selectedHall": "Royal Hall",
    "eventDate": "2025-06-15",
    "eventTime": "18:00",
    "eventType": "wedding",
    "guestCount": 200,
    "clientName": "Jane Smith",
    "clientEmail": "jane@example.com",
    "clientPhone": "+1234567890",
    "specialRequests": "Vegetarian catering required"
}
```

### POST `/api/rooms`
Handles room booking requests.

**Request Body:**
```json
{
    "selectedRoom": "Deluxe Room",
    "roomPrice": "5000",
    "checkIn": "2025-06-01",
    "checkOut": "2025-06-03",
    "guests": "2",
    "rooms": "1",
    "guestName": "Mike Johnson",
    "guestEmail": "mike@example.com",
    "guestPhone": "+1234567890"
}
```

### POST `/api/testimonial`
Handles guest reviews.

**Request Body:**
```json
{
    "reviewerName": "Sarah Wilson",
    "reviewText": "Amazing experience! The service was excellent..."
}
```

### GET `/api/health`
Health check endpoint to verify the server is running.

## Email Features

### For You (splashhresorts@gmail.com):
- Professional HTML email templates
- All form data clearly organized in tables
- Reply-to field set to customer's email
- Custom subjects for easy organization

### For Customers:
- Automatic confirmation emails
- Professional formatting
- Contact information for urgent inquiries
- 24-hour response promise

## Testing

### 1. Start the Backend
```bash
npm run dev
```

### 2. Test the API
You can test the endpoints using tools like:
- Postman
- cURL
- Browser Developer Tools

### 3. Test Form Submissions
- Open your website forms
- Submit test data
- Check your email at splashhresorts@gmail.com
- Check customer auto-replies

## Troubleshooting

### Common Issues:

1. **"Authentication failed" error**
   - Verify your Gmail App Password is correct
   - Ensure 2-Factor Authentication is enabled
   - Check that the email address is correct

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify Gmail SMTP settings
   - Try using a different port

3. **Forms not submitting**
   - Ensure the backend server is running
   - Check browser console for errors
   - Verify API endpoints are accessible

### Debug Steps:

1. Check server console for error messages
2. Verify config.js file exists and is correct
3. Test email configuration with a simple test
4. Check browser network tab for failed requests

## File Structure

```
backend/
├── server.js          # Main server file
├── config.js          # Email configuration (create this)
├── package.json       # Dependencies
├── README.md          # This file
└── node_modules/      # Installed packages
```

## Security Notes

- Never commit your `config.js` file to version control
- Use environment variables in production
- Regularly rotate your Gmail App Password
- Monitor for unusual email activity

## Production Deployment

For production deployment:

1. Use environment variables instead of config.js
2. Set up proper logging
3. Use HTTPS
4. Set up monitoring and alerts
5. Consider using a professional email service

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server console logs
3. Test with simple form submissions
4. Verify email configuration

The backend is now fully integrated with your website forms and will handle all email submissions professionally!
