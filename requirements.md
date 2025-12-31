Form Monkey
A simple web app for users to build contact or other web forms. Form Monkey allows more customization than Google Forms and is easy to use.

This initial build will be a simple pilot. There will not be an admin, the forms and their configuration will be manually created.

Use the same layout as https://www.prn-directv.com

Stack
React, Next.js, Shadcn, Tailwindcss

Requirements

- Use the Tailwinds Blue as the primary color
- Use the domain to determine which form to display
- Form configuration will come from forms.json
- All forms will be emailed using Postmark - emails will be text only initially and the sender email address will be the same for all forms
- Each form will consist of two pages, the form page and the confirmation page
- Each from can have a custom header with logo
- The fields for each form will be customizable - including type, label, hint text and required
- The confirmation message will be customizable
- All forms will use Google reCaptcha - this will be added and configured after the initial build
- In the footer: Powered By Form Monkey | Built By Tiny Dev Co.

Form Configuration Fields
name: string
domain: string
email_to: string
email_subject: string
fields: [
{
type: string (text, email, textarea, select, checkbox, radio)
label: string
hint: string
required: boolean
options: [string] (only for select, checkbox, radio)
}
header: {
text: String,
image: String
}
]
