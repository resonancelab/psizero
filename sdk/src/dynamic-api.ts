/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { RateLimiter } from 'limiter';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface EndpointConfig<T extends Record<string, any> = Record<string, any>> {
 method: HttpMethod;
 path: string;
 params?: (keyof T)[];
 headers?: Record<string, string>;
 responseType?: AxiosRequestConfig['responseType'];
 rateLimitPerSecond?: number;
 retryConfig?: RetryConfig;
}

interface RetryConfig {
 maxRetries: number;
 retryDelay: number;
 retryCondition?: (error: AxiosError) => boolean;
}

interface ApiConfig {
 baseUrl: string;
 endpoints: Record<string, EndpointConfig>;
 globalHeaders?: Record<string, string>;
 timeout?: number;
 responseInterceptor?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
 errorInterceptor?: (error: any) => any;
 globalRetryConfig?: RetryConfig;
 queueConcurrency?: number;
}

type ApiResponse<T> = Promise<T>;

class RequestQueue {
 private queue: (() => Promise<any>)[] = [];
 private running = 0;

 constructor(private concurrency: number) {}

 enqueue<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
   this.queue.push(() => task().then(resolve).catch(reject));
   this.runNext();
  });
 }

 private runNext() {
  if (this.running >= this.concurrency || this.queue.length === 0) return;
  this.running++;
  const task = this.queue.shift();
  if (task) {
   task().finally(() => {
    this.running--;
    this.runNext();
   });
  }
 }
}

class DynamicApi {
 private axiosInstance: AxiosInstance;
 private config: ApiConfig;
 private rateLimiters: Map<string, RateLimiter> = new Map();
 private requestQueue: RequestQueue;

 constructor(config: ApiConfig) {
  this.config = config;
  this.axiosInstance = axios.create({
   baseURL: config.baseUrl,
   timeout: config.timeout || 10000,
   headers: config.globalHeaders || {},
  });

  if (config.responseInterceptor) {
   this.axiosInstance.interceptors.response.use(config.responseInterceptor);
  }

  if (config.errorInterceptor) {
   this.axiosInstance.interceptors.response.use(undefined, config.errorInterceptor);
  }

  this.requestQueue = new RequestQueue(config.queueConcurrency || 5);
 }

 createApiMethods<T extends Record<string, EndpointConfig>>() {
  const api: Record<string, Function> = {};

  for (const [name, endpoint] of Object.entries(this.config.endpoints)) {
   api[name] = this.createMethod(name, endpoint);
   if (endpoint.rateLimitPerSecond) {
    this.rateLimiters.set(name, new RateLimiter({ tokensPerInterval: endpoint.rateLimitPerSecond, interval: 'second' }));
   }
  }

  return api as {
   [K in keyof T]: (
    data?: { [P in T[K]['params'][any]]?: any } & Record<string, any>,
    config?: AxiosRequestConfig
   ) => ApiResponse<any>
  };
 }

 private createMethod<T extends Record<string, any>>(name: string, endpoint: EndpointConfig<T>) {
  return async (data: T = {} as T, config: AxiosRequestConfig = {}): ApiResponse<any> => {
   const rateLimiter = this.rateLimiters.get(name);
   if (rateLimiter) {
    await rateLimiter.removeTokens(1);
   }

   return this.requestQueue.enqueue(() => this.makeRequest(endpoint, data, config));
  };
 }

 private async makeRequest<T extends Record<string, any>>(
  endpoint: EndpointConfig<T>,
  data: T,
  config: AxiosRequestConfig
 ): Promise<any> {
  const { method, path, params = [], headers = {}, responseType, retryConfig } = endpoint;
  let url = path;

  // Replace path parameters
  for (const param of params) {
   if (data[param as string] !== undefined) {
    url = url.replace(`:${String(param)}`, encodeURIComponent(data[param as string]));
    delete data[param as string];
   }
  }

  const axiosConfig: AxiosRequestConfig = {
   ...config,
   method,
   url,
   headers: { ...headers, ...config.headers },
   responseType,
  };

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
   axiosConfig.data = data;
  } else {
   axiosConfig.params = data;
  }

  const finalRetryConfig = { ...this.config.globalRetryConfig, ...retryConfig };

  return this.retryRequest(axiosConfig, finalRetryConfig as any);
 }

 private async retryRequest(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig
 ): Promise<any> {
  const { maxRetries, retryDelay, retryCondition } = retryConfig;
  let retries = 0;

  while (true) {
   try {
    const response = await this.axiosInstance.request(config);
    return response.data;
   } catch (error) {
    if (
     axios.isAxiosError(error) &&
     retries < maxRetries &&
     (!retryCondition || retryCondition(error))
    ) {
     retries++;
     await new Promise(resolve => setTimeout(resolve, retryDelay));
     continue;
    }
    throw error;
   }
  }
 }

 updateGlobalHeaders(headers: Record<string, string>) {
  this.axiosInstance.defaults.headers.common = {
   ...this.axiosInstance.defaults.headers.common,
   ...headers,
  };
 }

 setAuthToken(token: string) {
  this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 }
}

// // Usage example
// interface User {
//  id: number;
//  name: string;
//  email: string;
// }

// const apiConfig: ApiConfig = {
//  baseUrl: 'https://api.example.com',
//  endpoints: {
//   getUsers: { 
//    method: 'GET', 
//    path: '/users',
//    rateLimitPerSecond: 5,
//    retryConfig: { maxRetries: 3, retryDelay: 1000 }
//   },
//   getUser: { 
//    method: 'GET', 
//    path: '/users/:id', 
//    params: ['id'],
//    retryConfig: { maxRetries: 2, retryDelay: 500 }
//   },
//   createUser: { method: 'POST', path: '/users' },
//   updateUser: { method: 'PUT', path: '/users/:id', params: ['id'] },
//   deleteUser: { method: 'DELETE', path: '/users/:id', params: ['id'] },
//  },
//  globalHeaders: {
//   'Content-Type': 'application/json',
//  },
//  timeout: 5000,
//  responseInterceptor: (response) => {
//   console.log('Response:', response.data);
//   return response;
//  },
//  errorInterceptor: (error) => {
//   console.error('Request failed:', error);
//   return Promise.reject(error);
//  },
//  globalRetryConfig: {
//   maxRetries: 3,
//   retryDelay: 1000,
//   retryCondition: (error: AxiosError) => error.response?.status === 429
//  },
//  queueConcurrency: 3
// };

// const dynamicApi = new DynamicApi(apiConfig);
// const api = dynamicApi.createApiMethods<typeof apiConfig.endpoints>();

// // Example usage
// (async () => {
//  try {
//   const users = await api.getUsers();
//   console.log('Users:', users);

//   const user = await api.getUser({ id: 1 });
//   console.log('User:', user);

//   const newUser = await api.createUser({ name: 'John Doe', email: 'john@example.com' });
//   console.log('New user:', newUser);

//   const updatedUser = await api.updateUser({ id: 1, name: 'Jane Doe' });
//   console.log('Updated user:', updatedUser);

//   await api.deleteUser({ id: 1 });
//   console.log('User deleted');

//   dynamicApi.updateGlobalHeaders({ 'X-Custom-Header': 'value' });
//   dynamicApi.setAuthToken('your-auth-token');

//  } catch (error) {
//   console.error('Error:', error);
//  }
// })();