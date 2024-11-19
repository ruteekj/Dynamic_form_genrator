import React, { useState } from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import "../index.css"; // Adjust the path if needed
import jsonValidationSchema from "./jsonValidationSchema";
import { Field } from "@headlessui/react";

const JsonValidator: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(""); // To hold the raw JSON input
  const [formSchema, setFormSchema] = useState<any | null>(null); // Parsed and validated JSON schema
  const [errors, setErrors] = useState<string>(""); // Validation errors
  const [formData, setFormData] = useState<Record<string, any>>({}); // Form data

  const ajv = new Ajv();
  addFormats(ajv);
  //json validator schema hear
  const validateJson = ajv.compile(jsonValidationSchema);

  // Handle JSON input change and validation
  const handleJsonInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setJsonInput(input);
    if (input.trim() === "") {
      setErrors(""); // Reset errors when input is empty
      setFormSchema(null); // Optionally clear form schema
      return;
    }
    try {
      const parsedJson = JSON.parse(input);

      if (validateJson(parsedJson)) {
        setErrors("");
        setFormSchema(parsedJson); // Save the valid schema for form generation
      } else {
        setErrors(
          "Invalid JSON structure: " +
            validateJson.errors?.map((err) => err.message).join(", ")
        );
        setFormSchema(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors("Invalid JSON format: " + error.message);
      } else {
        setErrors("An unknown error occurred.");
      }
      setFormSchema(null);
    }
  };

  // Handle form field changes
  const handleFieldChange = (id: string, value: any) => {
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-extrabold text-center mb-6 text-blue-600">
        Dynamic Form Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* JSON Input Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Paste JSON Schema
          </h2>
          <textarea
            value={jsonInput}
            onChange={handleJsonInput}
            rows={10}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Paste your JSON schema here..."
          />
          {errors && (
            <p className="text-red-500 text-sm mt-2 font-medium">{errors}</p>
          )}
        </div>

        {/* Form Preview Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Generated Form
          </h2>
          {formSchema ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {formSchema.formTitle}
                </h3>
                <p className="text-gray-600">{formSchema.formDescription}</p>
              </div>

              {formSchema.fields.map((field: any) => (
                <div key={field.id}>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor={field.id}
                  >
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-red-500 font-bold">*</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      required
                      id={field.id}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 focus:outline-none"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          required
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "radio" ? (
                    field.options?.map((option: any) => (
                      <label
                        key={option.value}
                        className="block text-gray-700 font-medium"
                      >
                        <input
                          type="radio"
                          required
                          name={field.id}
                          value={option.value}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      placeholder={field.placeholder || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                  ) : (
                    <input
                      required
                      type={field.type}
                      id={field.id}
                      placeholder={field.placeholder || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </form>
          ) : (
            <p className="text-gray-500 italic">
              No valid JSON schema provided. Paste your JSON to generate the
              form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonValidator;
