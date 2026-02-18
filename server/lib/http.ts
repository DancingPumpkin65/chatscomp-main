const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

export function textResponse(message: string, init: ResponseInit = {}) {
  return new Response(message, {
    ...init,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

export function errorResponse(message: string, status = 500) {
  return json(
    {
      error: message,
    },
    { status },
  );
}

export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function readJson<T>(request: Request) {
  return (await request.json()) as T;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message);
  }
}

export async function fetchJson<T>(
  input: string | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const details = await response.text();
    throw new HttpError(details || `Request failed with ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}
