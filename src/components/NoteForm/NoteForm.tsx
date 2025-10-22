import { Formik, Form, Field, ErrorMessage as FE } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Min 3 chars")
    .max(50, "Max 50 chars")
    .required("Required"),
  content: Yup.string().max(500, "Max 500 chars"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onSuccess, onCancel }: Props) {
  return (
    <div>
      <h2 className={css.heading}>Create note</h2>
      <Formik
        initialValues={{ title: "", content: "", tag: "Todo" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
          try {
            await createNote(values);
            resetForm();
            onSuccess();
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Failed create";
            setErrors({ title: message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <FE name="title" component="div" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={6}
                className={css.textarea}
              />
              <FE name="content" component="div" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <FE name="tag" component="div" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create note"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
