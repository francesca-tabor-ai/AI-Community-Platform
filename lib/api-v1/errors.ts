import { NextResponse } from "next/server";

export type ApiError = {
  detail: string;
  code?: string;
  field_errors?: Record<string, string>;
};

export function apiError(
  status: number,
  detail: string,
  options?: { code?: string; field_errors?: Record<string, string> }
): NextResponse {
  const body: ApiError = { detail };
  if (options?.code) body.code = options.code;
  if (options?.field_errors) body.field_errors = options.field_errors;
  return NextResponse.json(body, { status });
}

export function unauthorized(detail = "Authentication required"): NextResponse {
  return apiError(401, detail, { code: "UNAUTHORIZED" });
}

export function forbidden(detail = "Forbidden"): NextResponse {
  return apiError(403, detail, { code: "FORBIDDEN" });
}

export function notFound(detail = "Resource not found"): NextResponse {
  return apiError(404, detail, { code: "NOT_FOUND" });
}

export function badRequest(
  detail: string,
  field_errors?: Record<string, string>
): NextResponse {
  return apiError(400, detail, { code: "BAD_REQUEST", field_errors });
}

export function conflict(detail: string): NextResponse {
  return apiError(409, detail, { code: "CONFLICT" });
}

export function internalError(detail = "Internal server error"): NextResponse {
  return apiError(500, detail, { code: "INTERNAL_ERROR" });
}

/** VibeNet error format: { error: { code, message, details } } */
export function vibenetError(
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status }
  );
}
