import type { APIEvent } from "solid-start";
import { json } from "solid-start";

export const createApiHandler = <T extends { request: unknown, response: unknown }>(
  callback: (
    req: {
      params: APIEvent["params"],
      headers: Headers,
      body: () => Promise<T["request"]>
    },
    res: {
      success: (data: T["response"], headers?: HeadersInit) => Response,
      error: (message: string, options?: { status?: number, debug?: unknown }) => Response
    }
  ) => Promise<Response>
) => (event: APIEvent) => {
  return callback (
    { // `req`
      params: event.params,
      headers: event.request.headers,
      body: () => event.request.json() as Promise<T["request"]>
    },
    { // `res`
      success: (data, headers) => json({
        success: true,
        data
      }, { headers }),
      error: (message, options) => json({
        success: false,
        message,
        debug: options?.debug
      }, { status: options?.status ?? 500 })
    }
  );
};