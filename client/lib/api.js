
const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.code = data?.code;
    err.payload = data;
    throw err;
  }
  return data;
}

// ---------- Medication ----------

export const medicationApi = {
  list: () => request(`/medication/list`),
  get: (id) => request(`/medication/get?id=${encodeURIComponent(id)}`),
  create: (data) =>
    request(`/medication/create`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    request(`/medication/update`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/medication/delete`, {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};

// ---------- UsageRecord ----------

export const usageRecordApi = {
  list: (filter = {}) => {
    const qs = filter.medicationId
      ? `?medicationId=${encodeURIComponent(filter.medicationId)}`
      : "";
    return request(`/usageRecord/list${qs}`);
  },
  get: (id) => request(`/usageRecord/get?id=${encodeURIComponent(id)}`),
  create: (data) =>
    request(`/usageRecord/create`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    request(`/usageRecord/update`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/usageRecord/delete`, {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
