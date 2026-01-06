# 🔧 Fix EmailJS Configuration

## The Problem
EmailJS is showing "check your configuration" error. This means something is wrong in your EmailJS dashboard settings.

## ✅ Step-by-Step Fix

### Step 1: Login to EmailJS
1. Go to https://dashboard.emailjs.com/
2. Login with your account

### Step 2: Check Your Service
1. Click on "Email Services" in the left menu
2. You should see a service with ID: `service_tfuco4i`
3. **Check if it's connected** (should show green checkmark)
4. If not connected:
   - Click on the service
   - Click "Connect Account"
   - Follow the steps to connect Gmail/Outlook

### Step 3: Check Your Template
1. Click on "Email Templates" in the left menu
2. Find template with ID: `template_i2qowpi`
3. Click on it to edit
4. **Make sure it has these exact variables:**

```
Subject: New message from {{name}}

From: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}
```

5. Click "Save"

### Step 4: Verify Public Key
1. Click on "Account" in the left menu
2. Find "API Keys" section
3. Your Public Key should be: `XcNXM231Xt2G_qSLy`
4. If different, copy the correct one and update in contact.html

### Step 5: Check Email Address
1. In "Email Services", click on your service
2. Make sure it's connected to: `manediksha264@gmail.com`
3. Verify the email is confirmed

## 🔍 Common Issues

### Issue 1: Service Not Connected
**Solution**: 
- Go to Email Services
- Click your service
- Click "Connect Account"
- Authorize Gmail/Outlook

### Issue 2: Template Variables Wrong
**Solution**:
Your template MUST have these exact names:
- `{{name}}` - for the name field
- `{{email}}` - for the email field
- `{{subject}}` - for the subject field
- `{{message}}` - for the message field

### Issue 3: Wrong Public Key
**Solution**:
- Copy the correct public key from Account > API Keys
- Update line in contact.html:
```javascript
emailjs.init("YOUR_CORRECT_PUBLIC_KEY");
```

### Issue 4: Service ID Wrong
**Solution**:
- Check your service ID in Email Services
- Update in contact.html if different:
```javascript
emailjs.sendForm("YOUR_SERVICE_ID", "template_i2qowpi", contactForm)
```

### Issue 5: Template ID Wrong
**Solution**:
- Check your template ID in Email Templates
- Update in contact.html if different:
```javascript
emailjs.sendForm("service_tfuco4i", "YOUR_TEMPLATE_ID", contactForm)
```

## 📝 Quick Test

After fixing, test in EmailJS dashboard:
1. Go to your template
2. Click "Test it"
3. Fill the form
4. Click "Send Test Email"
5. Check if you receive the email

If test works in dashboard but not on website, the IDs are wrong in your code.

## 🆘 Still Not Working?

### Option A: Create New Template
1. Go to Email Templates
2. Click "Create New Template"
3. Use this content:

**Template Name**: Contact Form

**Subject**: New Contact from {{name}}

**Content**:
```
Hello,

You have received a new message from your website contact form.

Name: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from JobSensei contact form.
```

4. Save and copy the new Template ID
5. Update in contact.html

### Option B: Check Browser Console
1. Open contact page
2. Press F12 to open developer tools
3. Go to "Console" tab
4. Try submitting the form
5. Look for the exact error message
6. Share the error with me

## 🎯 Most Likely Issue

The template variables don't match. Make sure your EmailJS template has:
- `{{name}}` not `{{from_name}}`
- `{{email}}` not `{{from_email}}`
- `{{subject}}` not `{{email_subject}}`
- `{{message}}` not `{{email_message}}`

The variable names MUST match exactly!

---

**After fixing, the form should work perfectly!** 🚀
