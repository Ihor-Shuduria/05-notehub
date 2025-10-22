import axios, { type AxiosResponse } from "axios";
import type { Note, FetchNotesParams, FetchNotesResponse } from "../types/note";

const API_BASE = "https://notehub-public.goit.study/api";

const tokenFromEnv = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

if (!tokenFromEnv) {
  console.warn();
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: tokenFromEnv ?? "",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  try {
    const { page = 1, perPage = 12, search } = params;

    const res = await api.get("/notes", { params: { page, perPage, search } });

    const {
      notes,
      totalPages,
      total,
      page: currentPage,
      perPage: per_page,
    } = res.data;

    return {
      data: notes,
      totalPages,
      total,
      page: currentPage,
      perPage: per_page,
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes. Please try again later.");
  }
}

export async function createNote(payload: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> {
  try {
    const res: AxiosResponse<Note> = await api.post("/notes", payload);
    return res.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note. Please try again later.");
  }
}

export async function deleteNote(id: string): Promise<{ id: string }> {
  try {
    const res: AxiosResponse<{ id: string }> = await api.delete(`/notes/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note. Please try again later.");
  }
}
