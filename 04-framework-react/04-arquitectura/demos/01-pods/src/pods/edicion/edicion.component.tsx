import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { memberSchema } from "../../core/members/member.schema";
import type { MemberInput } from "../../core/members/model";
interface Props { initialValues?: MemberInput; onSave: (values: MemberInput) => Promise<void> }
const emptyValues: MemberInput = { name: "", role: "", email: "" };
const fields = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "role", label: "Puesto", type: "text" },
  { name: "email", label: "Correo", type: "email" },
] as const;
export function EdicionComponent({ initialValues = emptyValues, onSave }: Props) {
  const [saveError, setSaveError] = useState("");
  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: memberSchema, onSubmit: memberSchema },
    onSubmit: async ({ value }) => {
      setSaveError("");
      try { await onSave(value); }
      catch { setSaveError("No se ha podido guardar. Los datos siguen en el formulario."); }
    },
  });
  return <form className="space-y-4" noValidate onSubmit={event => {
    event.preventDefault();
    event.stopPropagation();
    void form.handleSubmit();
  }}>
    {fields.map(config => <form.Field key={config.name} name={config.name}>
      {field => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
        return <div className="grid gap-1">
          <label htmlFor={field.name}>{config.label}</label>
          <input id={field.name} name={field.name} type={config.type}
            value={field.state.value} onBlur={field.handleBlur}
            onChange={event => field.handleChange(event.target.value)}
            aria-invalid={invalid} aria-describedby={invalid ? `${field.name}-error` : undefined} />
          {invalid && <p id={`${field.name}-error`} role="alert">
            {field.state.meta.errors.map(error => error?.message).join(" ")}
          </p>}
        </div>;
      }}
    </form.Field>)}
    {saveError && <p role="alert">{saveError}</p>}
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : "Guardar persona"}
      </button>}
    </form.Subscribe>
  </form>;
}
