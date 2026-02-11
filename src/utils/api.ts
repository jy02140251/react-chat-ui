/**
 * API client for the chat backend service.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

class ChatApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, signal } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };
    if (this.token) {
      requestHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  async getConversations() {
    return this.request<any[]>("/conversations");
  }

  async getMessages(conversationId: string, page = 1, limit = 50) {
    return this.request<any[]>(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
  }

  async sendMessage(conversationId: string, content: string, type = "text") {
    return this.request<any>(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: { content, type },
    });
  }

  async createConversation(participants: string[], name?: string) {
    return this.request<any>("/conversations", {
      method: "POST",
      body: { participants, name },
    });
  }

  async markAsRead(conversationId: string) {
    return this.request<void>(`/conversations/${conversationId}/read`, { method: "PUT" });
  }

  async uploadFile(conversationId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const url = `${this.baseUrl}/conversations/${conversationId}/upload`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    });
    return response.json();
  }

  async searchMessages(query: string) {
    return this.request<any[]>(`/messages/search?q=${encodeURIComponent(query)}`);
  }
}

export const chatApi = new ChatApiClient(API_BASE_URL);
export default chatApi;