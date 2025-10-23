import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NoteListProps {
  notes: Note[];
  onDeleted?: () => void;
}

export default function NoteList({ notes, onDeleted }: NoteListProps) {
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      onDeleted?.();
    },
    onError: () => {
      alert("Failed to delete note.");
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;
    await mutateAsync(id);
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
            <button
              className={css.button}
              onClick={() => handleDelete(n.id)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
