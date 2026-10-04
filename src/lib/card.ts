import { Contact } from "@/data/profile";

export function saveContactCard(): Contact {
  return {
    id: "save-contact",
    label: "Share contact",
    hint: "Scan to add me to your phone",
    type: "vcard",
    modes: ["business", "personal", "hobby"],
    value: "",
  };
}

const MAX_PHOTO_BYTES = 1024 * 1024;

function isJpegOrPng(bytes: Uint8Array): boolean {
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  return jpeg || png;
}

/** Square portrait. Only a real JPEG or PNG, at most 1 MB. */
export async function readProfilePhoto(file: File): Promise<string> {
  const type = file.type.toLowerCase();
  if (type !== "image/jpeg" && type !== "image/png") {
    throw new Error("type");
  }
  if (file.size <= 0 || file.size > MAX_PHOTO_BYTES) {
    throw new Error("size");
  }
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!isJpegOrPng(header)) throw new Error("type");

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("image"));
      el.src = url;
    });
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}
