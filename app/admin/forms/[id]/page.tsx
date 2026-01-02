"use client";

import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Form</h1>
        <p className="text-muted-foreground">
          Modify your form settings and fields
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Editor</CardTitle>
          <CardDescription>
            The form editing interface will be built next
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Form editor for ID: {id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
