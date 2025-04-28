export function decodeHtml(html: string) {
  if (!html) return "";
  const txt =
    typeof window !== "undefined"
      ? document.createElement("textarea")
      : { innerHTML: "", value: "" };
  txt.innerHTML = html;
  return txt.value;
}