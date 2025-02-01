class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.statusCode = statusCode; // Use statusCode here
    this.message = message;
    this.data = data;
    this.success = statusCode < 400; // Mark success based on statusCode
  }

  // A method to format the response (optional)

  static formatResponse(res, statusCode, message, data) {
    const response = new ApiResponse(statusCode, message, data);
    return res.status(statusCode).json(response);
  }
}

export { ApiResponse };
