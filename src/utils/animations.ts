import { wait } from "@/utils";

export const writeText = async (options: {
  text: string,
  /** Defaults to 50ms */
  speed?: number,
  /**
   * @example
   * writeText({
   *   speed: 50,
   *   text: "Hello World!",
   *   onTextEdit: (char) => setText(prev => prev + char)
   * });
   */
  onTextEdit: (text: string) => unknown
}) => {
  for (const char of options.text) {
    options.onTextEdit(char);
    await wait(options.speed ?? 50);
  }
}