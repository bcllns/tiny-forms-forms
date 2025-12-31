# Form Monkey

A simple web app for building customizable contact and web forms. Form Monkey allows more customization than Google Forms and is easy to use.

## Features

- **Dynamic Form Fields**: Support for text, email, textarea, select, checkbox, and radio field types
- **Domain-Based Forms**: Automatically display the correct form based on the domain
- **Custom Headers**: Each form can have a custom header with logo
- **Email Notifications**: Form submissions are sent via Postmark email service
- **Confirmation Pages**: Customizable confirmation messages after form submission
- **Validation**: Client-side form validation with error messages
- **Responsive Design**: Built with Tailwind CSS for a great experience on all devices

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Postmark** - Email delivery

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Postmark account for email sending

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd form-monkey
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Postmark API credentials to the `.env` file:
```
POSTMARK_API_KEY=your_postmark_api_key_here
POSTMARK_FROM_EMAIL=noreply@yourdomain.com
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Adding Forms

Forms are configured in `forms.json.ts`. Each form configuration includes:

- `name`: The form name
- `domain`: The domain that will display this form
- `email_to`: Where form submissions will be sent
- `email_subject`: Subject line for email notifications
- `header`: Custom header with text and optional logo
- `confirmation_message`: Message shown after successful submission
- `fields`: Array of form fields with the following properties:
  - `type`: text, email, textarea, select, checkbox, or radio
  - `label`: Field label
  - `hint`: Optional hint text
  - `required`: Whether the field is required
  - `options`: Array of options (for select, checkbox, radio fields)

### Example Form Configuration

```typescript
{
  name: "Contact Form",
  domain: "yourdomain.com",
  email_to: "contact@yourdomain.com",
  email_subject: "New Contact Form Submission",
  header: {
    text: "Contact Us",
    image: "/logo.png"
  },
  confirmation_message: "Thank you for contacting us!",
  fields: [
    {
      type: "text",
      label: "Full Name",
      hint: "Enter your full name",
      required: true
    },
    {
      type: "email",
      label: "Email Address",
      required: true
    },
    {
      type: "textarea",
      label: "Message",
      required: true
    }
  ]
}
```

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS**
- **Docker**

Make sure to set the environment variables in your deployment platform.

## Future Enhancements

- Google reCaptcha integration
- Admin dashboard for form management
- File upload support
- Form analytics
- Webhook integrations

## Footer

The footer displays: "Powered By Form Monkey | Built By Tiny Dev Co."

## License

MIT
