import { auth } from '@/auth';

const baseUrl = process.env.API_URL;

async function get(url: string) {
  const response = await fetch(new URL(url, baseUrl).toString(), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

async function put(url: string, body: unknown) {
  const response = await fetch(new URL(url, baseUrl).toString(), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

async function post(url: string, body: unknown) {
  const response = await fetch(new URL(url, baseUrl).toString(), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

async function del(url: string) {
  const response = await fetch(new URL(url, baseUrl).toString(), {
    method: 'DELETE',
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

async function handleResponse(response: Response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (response.ok) {
    return data || response.statusText;
  } else {
    const error = {
      status: response.status,
      message: typeof data === 'string' ? data : response.statusText,
    };
    return { error };
  }
}

async function getHeaders(): Promise<Headers> {
  const session = await auth();
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (session) {
    headers.set('Authorization', 'Bearer ' + session.accessToken);
  }
  return headers;
}

export const fetchWrapper = {
  get,
  post,
  put,
  del,
};
