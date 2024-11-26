export default function cleanJsonString(str: string): string {
  str = str.replace(/```json\n?|```\n?/g, "");
  str = str.trim();
  return str;
}
