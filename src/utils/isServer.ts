export default function isServer(): boolean {
  return typeof window === "undefined";
}
