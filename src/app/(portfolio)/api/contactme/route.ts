'use server'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const googleFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;

  try {
    if (!googleFormUrl) {
      return NextResponse.json({ error: "Google Form URL not found" }, { status: 400 });
    }

    // Extract form fields from the Google Form
    const formFields = await getGoogleFormFields(googleFormUrl);


    // Prepare form data to send in the POST request
    const formData = mapFormData(await req.json(), formFields);

    // Convert viewform URL to formResponse for submission
    const submissionUrl = googleFormUrl.replace(/\/viewform.*/, '/formResponse');

    const submissionResponse = await submitToGoogleForm(submissionUrl, formData);

    return NextResponse.json({ ok: true, message: "Form processed successfully", submissionResponse }, { status: 201 });

  } catch (error: any) {
    console.error("Error processing form:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// Submit the data to the Google Form endpoint
async function submitToGoogleForm(formSubmitUrl: string, formData: { [key: string]: any }) {
  try {
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
    });

    if (!response.ok) {
      throw new Error(`Google Form submission failed: ${response.statusText}`);
    }

    return await response.body;
  } catch (error) {
    console.error('Error submitting to Google Form:', error);
    throw error;
  }
}

// utils/getGoogleFormFields.ts

interface FormField {
  title: string;
  id: string;
  type: number;
  required: boolean;
}

async function getGoogleFormFields(formUrl: string): Promise<FormField[]> {
  try {
    // Fetch the form HTML
    const response = await fetch(formUrl)
    const html = await response.text()

    // Find the form data in the HTML
    const scriptContent = html.match(/FB_PUBLIC_LOAD_DATA_ = (.*?);/)?.[1]

    if (!scriptContent) {
      throw new Error('Could not find form data')
    }

    // Clean the data before parsing
    const cleanedData = scriptContent.replace(/,(?!\s*?[{\["'\w])/g, '')

    try {
      // Parse the cleaned data
      const formData = JSON.parse(cleanedData)

      // Form fields are in formData[1][1]
      const fields = formData[1][1]

      if (!Array.isArray(fields)) {
        throw new Error('Form fields not found in expected format')
      }

      // Extract field information
      const formFields = fields.map((field: any) => {
        if (!Array.isArray(field) || !field[4] || !Array.isArray(field[4][0])) {
          return null
        }

        return {
          title: field[1] || 'Untitled', // Field label/title
          id: `entry.${field[4][0][0]}`, // Field ID
          type: field[3], // Field type
          required: field[4][0][2] === 1 // Required field check
        }
      }).filter(field => field !== null) // Remove any null fields

      return formFields

    } catch (jsonError) {
      console.error('Error parsing form data:', jsonError)
      throw new Error('Failed to parse form data')
    }

  } catch (error) {
    console.error('Error extracting form fields:', error)
    throw error
  }
}

interface FormField {
  title: string;
  id: string;
  type: number;
  required: boolean;
}

function mapFormData(requestData: Record<string, any>, formFields: FormField[]): URLSearchParams {
  const formData = new URLSearchParams();

  // Add form metadata
  formData.append('fvv', '1');  // Form version
  formData.append('draftResponse', '[]');
  formData.append('pageHistory', '0');

  // Map each form field
  for (const field of formFields) {
    const value = findMatchingValue(requestData, field);

    if (value !== undefined) {
      formData.append(field.id, value.toString());
    } else if (field.required) {
      throw new Error(`Required field "${field.title}" is missing`);
    }
  }

  return formData;
}

function findMatchingValue(requestData: Record<string, any>, field: FormField): any {
  // Convert field title to lowercase and remove special characters for matching
  const normalizedTitle = field.title.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');

  // Look for exact match first
  if (requestData[field.title] !== undefined) {
    return requestData[field.title];
  }

  // Then try normalized matches
  for (const [key, value] of Object.entries(requestData)) {
    const normalizedKey = key.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');

    if (normalizedKey === normalizedTitle) {
      return value;
    }
  }

  return undefined;
}