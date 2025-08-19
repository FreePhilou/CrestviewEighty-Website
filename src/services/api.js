// Standardized API service layer for consistent data handling
// This provides a mock API interface that can easily be replaced with real API calls

class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
    this.timeout = 5000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Simulate network delay for realistic behavior
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate API response with proper structure
  async mockResponse(data, delay = 500, shouldFail = false) {
    await this.delay(delay);
    
    if (shouldFail) {
      throw new Error('API request failed');
    }
    
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      message: 'Operation completed successfully'
    };
  }

  // Generic request handler (for future real API integration)
  async request(endpoint, options = {}) {
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders },
      ...options
    };

    try {
      // For now, we'll use mock responses
      // In production, this would be: fetch(`${this.baseURL}${endpoint}`, config)
      console.log(`Mock API Request: ${config.method} ${endpoint}`);
      
      // Return mock response based on endpoint
      return this.handleMockRequest(endpoint, config);
    } catch (error) {
      console.error('API Request failed:', error);
      throw new APIError(error.message, endpoint, config.method);
    }
  }

  // Handle mock requests based on endpoint patterns
  async handleMockRequest(endpoint, config) {
    const method = config.method.toUpperCase();
    
    // Simulate different response times and occasional failures
    const delay = Math.random() * 1000 + 200; // 200-1200ms delay
    const shouldFail = Math.random() < 0.05; // 5% chance of failure
    
    switch (true) {
      case endpoint.includes('/auth'):
        return this.mockResponse({ authenticated: true }, delay, shouldFail);
      
      case endpoint.includes('/documents'):
        return this.handleDocumentsMock(endpoint, method, delay, shouldFail);
      
      case endpoint.includes('/notifications'):
        return this.handleNotificationsMock(endpoint, method, delay, shouldFail);
      
      case endpoint.includes('/users'):
        return this.handleUsersMock(endpoint, method, delay, shouldFail);
      
      case endpoint.includes('/payments'):
        return this.handlePaymentsMock(endpoint, method, delay, shouldFail);
      
      default:
        return this.mockResponse({ message: 'Endpoint not implemented' }, delay);
    }
  }

  async handleDocumentsMock(endpoint, method, delay, shouldFail) {
    switch (method) {
      case 'GET':
        return this.mockResponse({ documents: [], total: 0 }, delay, shouldFail);
      case 'POST':
        return this.mockResponse({ id: Date.now().toString() }, delay, shouldFail);
      case 'PUT':
      case 'PATCH':
        return this.mockResponse({ updated: true }, delay, shouldFail);
      case 'DELETE':
        return this.mockResponse({ deleted: true }, delay, shouldFail);
      default:
        throw new Error(`Method ${method} not supported for documents`);
    }
  }

  async handleNotificationsMock(endpoint, method, delay, shouldFail) {
    switch (method) {
      case 'GET':
        return this.mockResponse({ notifications: [], unreadCount: 0 }, delay, shouldFail);
      case 'POST':
        return this.mockResponse({ id: Date.now().toString() }, delay, shouldFail);
      case 'PUT':
      case 'PATCH':
        return this.mockResponse({ updated: true }, delay, shouldFail);
      case 'DELETE':
        return this.mockResponse({ deleted: true }, delay, shouldFail);
      default:
        throw new Error(`Method ${method} not supported for notifications`);
    }
  }

  async handleUsersMock(endpoint, method, delay, shouldFail) {
    switch (method) {
      case 'GET':
        return this.mockResponse({ users: [], total: 0 }, delay, shouldFail);
      case 'POST':
        return this.mockResponse({ id: Date.now().toString() }, delay, shouldFail);
      case 'PUT':
      case 'PATCH':
        return this.mockResponse({ updated: true }, delay, shouldFail);
      case 'DELETE':
        return this.mockResponse({ deleted: true }, delay, shouldFail);
      default:
        throw new Error(`Method ${method} not supported for users`);
    }
  }

  async handlePaymentsMock(endpoint, method, delay, shouldFail) {
    switch (method) {
      case 'GET':
        return this.mockResponse({ payments: [], balance: 0 }, delay, shouldFail);
      case 'POST':
        return this.mockResponse({ transactionId: Date.now().toString() }, delay, shouldFail);
      default:
        throw new Error(`Method ${method} not supported for payments`);
    }
  }

  // Convenience methods for common HTTP verbs
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload simulation
  async uploadFile(endpoint, file, onProgress = null) {
    await this.delay(2000); // Simulate upload time
    
    if (onProgress) {
      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        onProgress(progress);
        await this.delay(200);
      }
    }
    
    return this.mockResponse({
      fileId: Date.now().toString(),
      filename: file.name,
      size: file.size,
      type: file.type,
      url: `mock://files/${Date.now()}`
    });
  }

  // Download simulation
  async downloadFile(fileId, filename) {
    await this.delay(1000);
    
    // In a real implementation, this would trigger a file download
    console.log(`Mock download: ${filename} (ID: ${fileId})`);
    
    return this.mockResponse({
      downloadUrl: `mock://downloads/${fileId}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
    });
  }
}

// Custom error class for API errors
class APIError extends Error {
  constructor(message, endpoint, method, statusCode = null) {
    super(message);
    this.name = 'APIError';
    this.endpoint = endpoint;
    this.method = method;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

// Create singleton instance
const apiService = new APIService();

// Export specific service modules
export const documentsAPI = {
  getAll: (params) => apiService.get('/documents', params),
  getById: (id) => apiService.get(`/documents/${id}`),
  create: (data) => apiService.post('/documents', data),
  update: (id, data) => apiService.put(`/documents/${id}`, data),
  delete: (id) => apiService.delete(`/documents/${id}`),
  upload: (file, onProgress) => apiService.uploadFile('/documents/upload', file, onProgress),
  download: (id, filename) => apiService.downloadFile(id, filename),
  incrementDownload: (id) => apiService.patch(`/documents/${id}/download`)
};

export const notificationsAPI = {
  getAll: (params) => apiService.get('/notifications', params),
  getById: (id) => apiService.get(`/notifications/${id}`),
  create: (data) => apiService.post('/notifications', data),
  update: (id, data) => apiService.put(`/notifications/${id}`, data),
  delete: (id) => apiService.delete(`/notifications/${id}`),
  markAsRead: (id) => apiService.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiService.patch('/notifications/read-all')
};

export const usersAPI = {
  getAll: (params) => apiService.get('/users', params),
  getById: (id) => apiService.get(`/users/${id}`),
  create: (data) => apiService.post('/users', data),
  update: (id, data) => apiService.put(`/users/${id}`, data),
  delete: (id) => apiService.delete(`/users/${id}`),
  updateProfile: (id, data) => apiService.patch(`/users/${id}/profile`, data),
  changePassword: (id, data) => apiService.patch(`/users/${id}/password`, data)
};

export const paymentsAPI = {
  getHistory: (userId, params) => apiService.get(`/users/${userId}/payments`, params),
  getBalance: (userId) => apiService.get(`/users/${userId}/balance`),
  createPayment: (data) => apiService.post('/payments', data),
  getPaymentMethods: (userId) => apiService.get(`/users/${userId}/payment-methods`)
};

export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout'),
  refreshToken: () => apiService.post('/auth/refresh'),
  forgotPassword: (email) => apiService.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiService.post('/auth/reset-password', { token, password })
};

export { APIError };
export default apiService;