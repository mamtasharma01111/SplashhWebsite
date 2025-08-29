# FormSubmit Activation Guide

## The Problem
You're getting a `405 (Method Not Allowed)` error because your email `splashhresorts@gmail.com` hasn't been activated with FormSubmit yet.

## Solution: Activate Your Email

### Step 1: Go to FormSubmit
1. Open your browser and go to: **https://formsubmit.co/**
2. You'll see a simple form asking for your email address

### Step 2: Enter Your Email
1. In the email field, enter: **splashhresorts@gmail.com**
2. Click the **"Activate"** button

### Step 3: Check Your Email
1. Go to your Gmail inbox: **splashhresorts@gmail.com**
2. **Check both your inbox AND spam folder**
3. Look for an email from FormSubmit with subject: "Confirm your email address"

### Step 4: Click the Activation Link
1. Open the email from FormSubmit
2. Click the **"Confirm your email address"** button/link
3. You should see a success message: "Your email has been confirmed!"

### Step 5: Test Your Forms
1. After activation, try submitting one of your forms
2. The `405 (Method Not Allowed)` error should be gone
3. You should receive emails at `splashhresorts@gmail.com`

## What I Fixed

I've updated all your forms to use the correct FormSubmit URL:
- **Before:** `https://formsubmit.co/el/confirm/splashhresorts@gmail.com` ❌
- **After:** `https://formsubmit.co/splashhresorts@gmail.com` ✅

## Why This Happened

The `el/confirm/` part in the URL is only used **after** your email is activated. Before activation, FormSubmit doesn't recognize that email address, so it rejects the request with a 405 error.

## If You Still Get Errors After Activation

1. **Wait 5-10 minutes** - FormSubmit can take time to process activation
2. **Clear your browser cache** and try again
3. **Check if you're using the updated forms** (I just fixed them)
4. **Try the test forms** I created to isolate any issues

## Test Forms to Try

1. **`test-form-simple.html`** - Basic FormSubmit test
2. **`form-diagnostic.html`** - Comprehensive testing tool
3. **`alternative-form.html`** - Backup solution if FormSubmit fails

## Success Indicators

After proper activation, you should see:
- ✅ No more 405 errors
- ✅ Forms submit successfully
- ✅ Redirect to success pages
- ✅ Emails received at `splashhresorts@gmail.com`

## Need Help?

If you still have issues after following these steps:
1. Check the browser console for new error messages
2. Try the diagnostic tool
3. Let me know what specific errors you see

## Files Updated
- `contact.html` - Fixed FormSubmit URL
- `banquet.html` - Fixed FormSubmit URL  
- `rooms.html` - Fixed FormSubmit URL
- `FORMSUBMIT_ACTIVATION_GUIDE.md` - This guide
