const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message = data?.error || data?.Error || `Request failed (${res.status})`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}
