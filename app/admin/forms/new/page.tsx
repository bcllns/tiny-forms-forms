"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewFormPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Form</h1>
        <p className="text-muted-foreground">
          Build a custom form for your website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Builder</CardTitle>
          <CardDescription>
            The form creation interface will be built next
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Form builder coming soon... This will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Form name and domain configuration</li>
            <li>Email settings (recipient and subject)</li>
            <li>Custom header with logo upload</li>
            <li>Drag-and-drop field builder</li>
            <li>Field types: text, email, textarea, select, checkbox, radio</li>
            <li>Field configuration (label, hint, required, options)</li>
            <li>Confirmation message customization</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
