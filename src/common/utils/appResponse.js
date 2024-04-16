export function AppResponse(res, statusCode = 200, data, message) {
  res.status(statusCode).json({
    status: "success",
    message: message ?? "Success",
    data: data ?? null,
  });
}
