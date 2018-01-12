export default function RawHtml(value) {
  return document.createRange().createContextualFragment(value);
}