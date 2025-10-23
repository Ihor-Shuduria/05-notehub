import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import PaginationComp from "../Pagination/Pagination";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useDebounce } from "use-debounce";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../types/api";
import { useEffect, useState } from "react";

export default function App() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () =>
      fetchNotes({ page, perPage: 12, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) console.error(error);
  }, [isError, error]);

  const openCreateModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreated = async () => {
    await qc.invalidateQueries({ queryKey: ["notes"] });
    closeModal();
  };

  const notes = Array.isArray(data?.data) ? data!.data : [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        <div className={css.controls}>
          <button className={css.button} onClick={openCreateModal}>
            Create note +
          </button>
        </div>
      </header>

      <main className={css.content}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage message={error.message} />}

        {!isLoading && !isError && (
          <>
            {notes.length > 0 ? (
              <>
                <NoteList
                  notes={notes}
                  onDeleted={() =>
                    qc.invalidateQueries({ queryKey: ["notes"] })
                  }
                />
                {totalPages > 1 && (
                  <PaginationComp
                    pageCount={totalPages}
                    forcePage={page - 1}
                    onPageChange={(selected) => setPage(selected + 1)}
                  />
                )}
              </>
            ) : (
              <p className={css.empty}>No notes found.</p>
            )}
          </>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={handleCreated} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
