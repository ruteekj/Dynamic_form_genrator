import React from "react";
import addFormats from "ajv-formats";
import Ajv from "ajv";

// Schema to validate the structure of the pasted JSON
const jsonValidationSchema = {
  type: "object",
  properties: {
    formTitle: { type: "string" },
    formDescription: { type: "string" },
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: ["text", "email", "select", "radio", "textarea"],
          },
          label: { type: "string" },
          required: { type: "boolean" },
          placeholder: { type: "string", nullable: true },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                value: { type: "string" },
                label: { type: "string" },
              },
              required: ["value", "label"],
            },
            nullable: true,
          },
        },
        required: ["id", "type", "label", "required"],
      },
    },
  },
  required: ["formTitle", "formDescription", "fields"],
};

export default jsonValidationSchema;
