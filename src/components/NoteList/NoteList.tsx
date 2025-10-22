import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";

interface Props {
  notes: Note[];
  onDeleted?: () => void;
}

export default function NoteList({ notes, onDeleted }: Props) {
  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      onDeleted?.();
    } catch {
      alert("Failed to delete");
    }
  }

  if (!notes || notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button className={css.button} onClick={() => handleDelete(n.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
