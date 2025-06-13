import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClient extends AxiosInstance {
  upload: (url: string, formData: FormData, onProgress?: (percent: number) => void) => Promise<AxiosResponse>;
  download: (url: string, params?: any, onProgress?: (percent: number) => void) => Promise<AxiosResponse>;
}

declare const apiClient: ApiClient;
export default apiClient; 