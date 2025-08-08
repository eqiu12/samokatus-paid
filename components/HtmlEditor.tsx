"use client";
import { useEffect, useRef, useState } from "react";

type HtmlEditorProps = {
  name?: string;
  initialHtml?: string;
  label?: string;
};

export default function HtmlEditor({ name = "content", initialHtml = "", label = "Content" }: HtmlEditorProps) {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const [html, setHtml] = useState<string>(initialHtml);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "visual" && editorRef.current) {
      editorRef.current.innerHTML = html || "";
    }
  }, [mode, html]);

  const applyCommand = (command: string, value?: string) => {
    if (mode !== "visual") return;
    document.execCommand(command, false, value);
    // Sync back to state
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  };

  const onInput = () => {
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  };

  return (
    <div className="space-y-2">
      {label && <label className="font-medium">{label}</label>}

      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("visual")}
          className={`px-2 py-1 rounded border ${mode === "visual" ? "bg-zinc-100 dark:bg-zinc-800" : "bg-transparent"}`}
        >
          Visual
        </button>
        <button
          type="button"
          onClick={() => setMode("code")}
          className={`px-2 py-1 rounded border ${mode === "code" ? "bg-zinc-100 dark:bg-zinc-800" : "bg-transparent"}`}
        >
          Code
        </button>
      </div>

      {mode === "visual" && (
        <>
          <div className="flex flex-wrap gap-1 text-sm">
            <button type="button" className="px-2 py-1 rounded border" onClick={() => applyCommand("bold")}>B</button>
            <button type="button" className="px-2 py-1 rounded border italic" onClick={() => applyCommand("italic")}>I</button>
            <button type="button" className="px-2 py-1 rounded border" onClick={() => applyCommand("formatBlock", "<h1>")}>H1</button>
            <button type="button" className="px-2 py-1 rounded border" onClick={() => applyCommand("formatBlock", "<h2>")}>H2</button>
            <button type="button" className="px-2 py-1 rounded border" onClick={() => applyCommand("insertUnorderedList")}>• List</button>
            <button type="button" className="px-2 py-1 rounded border" onClick={() => applyCommand("insertOrderedList")}>1. List</button>
            <button
              type="button"
              className="px-2 py-1 rounded border"
              onClick={() => {
                const url = prompt("Link URL:");
                if (url) applyCommand("createLink", url);
              }}
            >
              Link
            </button>
            <button type="button" className="px-2 py-1 rounded border" onClick={() => setHtml("")}>Clear</button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={onInput}
            className="min-h-[240px] rounded-lg border p-3 bg-white/70 dark:bg-zinc-900/50 backdrop-blur prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </>
      )}

      {mode === "code" && (
        <textarea
          className="w-full min-h-[240px] rounded-lg border p-3 font-mono text-sm bg-white/70 dark:bg-zinc-900/50 backdrop-blur"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />
      )}

      <input type="hidden" name={name} value={html} />
    </div>
  );
}


