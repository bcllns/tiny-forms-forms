export interface FormField {
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  hint?: string;
  required: boolean;
  options?: string[];
}

export interface FormConfig {
  name: string;
  domain: string;
  email_to: string;
  email_subject: string;
  fields: FormField[];
  header: {
    text: string;
    image?: string;
    description?: string;
  };
  confirmation_message?: string;
}

export const forms: FormConfig[] = [
  {
    name: "PRN Contact Form",
    domain: "localhost:3000",
    email_to: "ben@cetvnow.com",
    email_subject: "PRN Contact Form Submission",
    header: {
      text: "Contact Us",
      image: "/images/combined-logo.png",
      description: "Please fill out the form below to be contacted by one of our DIRECTV for Business Solution advisors."
    },
    confirmation_message: "Thank you for contacting us! We'll get back to you soon.",
    fields: [
      {
        type: "text",
        label: "Business Name",
        hint: "Enter your business name",
        required: true
      },
      {
        type: "text",
        label: "Business Address",
        hint: "Enter your business address",
        required: true
      },
      {
        type: "text",
        label: "City",
        hint: "Enter your city",
        required: true,
      },
      {
        type: "select",
        label: "State",
        hint: "Select a state",
        required: true,
        options: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]
      },
      {
        type: "text",
        label: "Zip Code",
        hint: "Enter your zip code",
        required: true
      },
      {
        type: "text",
        label: "Business Phone",
        hint: "Enter your business phone number",
        required: true
      },
      {
        type: "text",
        label: "First Name",
        hint: "Enter your first name",
        required: true
      },
      {
        type: "text",
        label: "Last Name",
        hint: "Enter your last name",
        required: true
      },
      {
        type: "text",
        label: "Contact Phone",
        hint: "Enter your contact phone number",
        required: true
      },
      {
        type: "email",
        label: "Contact Email",
        hint: "We'll never share your email",
        required: true
      },
      {
        type: "text",
        label: "DIRECTV Programming Package",
        hint: "Optional",
        required: false
      },
      {
        type: "text",
        label: "How many TVs do you have?",
        hint: "Optional",
        required: false,
      }
      
    ]
  }
];
