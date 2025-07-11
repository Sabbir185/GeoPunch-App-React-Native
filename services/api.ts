import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "@/config";

// Apply base URL for axios
const API_URL = config?.API_URL;

const axiosApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  validateStatus: function (status: number) {
    return status >= 200 && status < 600; // default
  },
});

axiosApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => Promise.reject(error)
);

interface UpdateRequestResult {
  url: string;
  data: any;
}

const updateRequest = async (url: string, data: any): Promise<UpdateRequestResult> => {
  const token = await AsyncStorage.getItem("token");
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;

  let variables = url.match(/:[a-zA-Z]+/g);
  if (variables?.length) {
    variables.forEach((variable: string) => {
      url = url.replace(variable, data[variable.replace(":", "")]);
      delete data[variable.replace(":", "")];
    });
  }
  return { url, data };
};

export const convertObjectToFormData = (object: { [key: string]: any }): FormData => {
  let form_data = new FormData();
  for (let key in object) {
    if (object[key] !== null && object[key] !== undefined) {
      if (Array.isArray(object[key])) {
        object[key].forEach((item: any) => {
          form_data.append(key, item);
        });
      } else {
        form_data.append(key, object[key]);
      }
    }
  }
  return form_data;
};

export async function get(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const { url: newUrl, data: newData } = await updateRequest(url, data);
  return await axiosApi
    .get(newUrl, { ...config, params: newData })
    .then((response: AxiosResponse) => response.data);
}

export async function post(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const token = await AsyncStorage.getItem("token");
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  axiosApi.defaults.headers.common["Content-Type"] = "application/json";

  const { url: newUrl, data: newData } = await updateRequest(url, data);
  return axiosApi
    .post(newUrl, newData, { ...config })
    .then((response: AxiosResponse) => response.data);
}

export async function postForm(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const token = await AsyncStorage.getItem("token");
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data";

  let formData = convertObjectToFormData(data);
  return axiosApi
    .post(url, formData, { ...config })
    .then((response: AxiosResponse) => response.data);
}

export async function patchForm(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const token = await AsyncStorage.getItem("token");
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data";

  let formData = convertObjectToFormData(data);
  return axiosApi
    .patch(url, formData, { ...config })
    .then((response: AxiosResponse) => response.data);
}

export async function put(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const token = await AsyncStorage.getItem("token");
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  axiosApi.defaults.headers.common["Content-Type"] = "application/json";
  
  const { url: newUrl, data: newData } = await updateRequest(url, data);
  return axiosApi
    .put(newUrl, newData, { ...config })
    .then((response: AxiosResponse) => response.data);
}

export async function patch(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const token = await AsyncStorage.getItem("token");
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  axiosApi.defaults.headers.common["Content-Type"] = "application/json";

  const { url: newUrl, data: newData } = await updateRequest(url, data);
  return axiosApi
    .patch(newUrl, newData, { ...config })
    .then((response: AxiosResponse) => response.data);
}

export async function del(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> {
  const { url: newUrl, data: newData } = await updateRequest(url, data);
  return await axiosApi
    .delete(newUrl, { ...config, params: newData })
    .then((response: AxiosResponse) => response.data);
}