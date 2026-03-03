import type { Attachment } from "../types";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export async function filesToAttachments(files: FileList | File[]) {
  const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

  return Promise.all(
    imageFiles.map(async (file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      mimeType: file.type,
      dataUrl: await fileToDataUrl(file),
    })),
  ) as Promise<Attachment[]>;
}
