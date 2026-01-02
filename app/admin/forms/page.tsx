"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Form } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Edit, Trash2, FileText } from "lucide-react";

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    try {
      const { data: formsData, error } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (formsData) {
        // Fetch fields for each form
        const formsWithFields = await Promise.all(
          formsData.map(async (form) => {
            const { data: fieldsData } = await supabase
              .from("form_fields")
              .select("*")
              .eq("form_id", form.id)
              .order("order", { ascending: true });

            return {
              ...form,
              fields: fieldsData || [],
            };
          })
        );

        setForms(formsWithFields);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteForm(formId: string) {
    if (!confirm("Are you sure you want to delete this form?")) return;

    try {
      const { error } = await supabase.from("forms").delete().eq("id", formId);

      if (error) throw error;

      setForms(forms.filter((form) => form.id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form");
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">
            Manage your contact and web forms
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading forms...</p>
        </div>
      ) : forms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No forms yet</h3>
            <p className="mt-2 text-muted-foreground">
              Get started by creating your first form
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/forms/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{form.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {form.domain}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fields:</span>
                    <Badge variant="secondary">{form.fields?.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email to:</span>
                    <span className="text-xs truncate ml-2">{form.email_to}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/admin/forms/${form.id}`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/${form.id}`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteForm(form.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
