export async function nitradoRequest(path, token, options = {}) {
  const res = await fetch(`https://api.nitrado.net${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NITRADO_HTTP_${res.status}: ${text}`);
  }

  return await res.json();
}

export async function getServices(token) {
  const json = await nitradoRequest('/services', token);
  return json?.data?.services || [];
}

export async function getFirstDayZService(token) {
  const services = await getServices(token);

  const dayzService =
    services.find((s) => s?.details?.folder_short === 'dayzstandalone') ||
    services.find((s) => s?.details?.folder_short === 'dayz') ||
    services.find((s) => String(s?.details?.game || '').toLowerCase().includes('dayz')) ||
    null;

  return dayzService;
}

export async function getFileServerList(token, serviceId, dir = '/') {
  const json = await nitradoRequest(
    `/services/${serviceId}/gameservers/file_server/list?dir=${encodeURIComponent(dir)}`,
    token
  );

  return json?.data?.entries || [];
}

export async function getDownloadUrl(token, serviceId, filePath) {
  const json = await nitradoRequest(
    `/services/${serviceId}/gameservers/file_server/download?file=${encodeURIComponent(filePath)}`,
    token
  );

  return json?.data?.token?.url || null;
}

export async function downloadFileText(token, serviceId, filePath) {
  const url = await getDownloadUrl(token, serviceId, filePath);
  if (!url) {
    throw new Error('DOWNLOAD_URL_MISSING');
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`FILE_DOWNLOAD_FAILED_${res.status}`);
  }

  return await res.text();
}

async function walkDir(token, serviceId, dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return [];

  const entries = await getFileServerList(token, serviceId, dir).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const entryPath = entry.path || `${dir.replace(/\/$/, '')}/${entry.name}`;

    if (entry.type === 'dir') {
      const nested = await walkDir(token, serviceId, entryPath, depth + 1, maxDepth);
      files.push(...nested);
      continue;
    }

    files.push({
      ...entry,
      path: entryPath
    });
  }

  return files;
}

export async function findAdmLogFile(token, serviceId) {
  const files = await walkDir(token, serviceId, '/', 0, 5);

  const admFiles = files
    .filter((f) => /\.adm$/i.test(f.path || f.name || ''))
    .sort((a, b) => {
      const aTime = new Date(a.modified_at || a.modifiedAt || 0).getTime();
      const bTime = new Date(b.modified_at || b.modifiedAt || 0).getTime();
      return bTime - aTime;
    });

  return admFiles[0] || null;
}