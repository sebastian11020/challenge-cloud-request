

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface ApiRequestOptions extends RequestInit {
}

export async function apiGet<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers ?? {}),
        },
        ...options,
    });

    if (!response.ok) {
        const message = `Error en la petición GET ${path} (${response.status})`;
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}
