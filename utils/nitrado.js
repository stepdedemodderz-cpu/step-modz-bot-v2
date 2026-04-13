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

async function walkDir(token, serviceId, dir, depth = 0, maxDepth = 12) {
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

function getTimestamp(file) {
  return new Date(file.modified_at || file.modifiedAt || file.created_at || 0).getTime();
}

function isAdmFile(file) {
  const path = String(file?.path || '');
  const name = String(file?.name || '');

  return /\.adm$/i.test(path) || /\.adm$/i.test(name);
}

export async function findAdmLogFile(token, serviceId) {
  // Erst gezielte typische Ordner versuchen
  const preferredDirs = [
    '/games',
    '/games/servers',
    '/games/servers/dayzxb',
    '/games/servers/dayzps',
    '/games/servers/dayzstandalone',
    '/profiles',
    '/profiles/default',
    '/logs',
    '/'
  ];

  let files = [];

  for (const dir of preferredDirs) {
    const partial = await walkDir(token, serviceId, dir, 0, 6).catch(() => []);
    files.push(...partial);
  }

  // Fallback: kompletter tiefer Suchlauf
  if (!files.length) {
    files = await walkDir(token, serviceId, '/', 0, 12);
  }

  // Duplikate raus
  const unique = [];
  const seen = new Set();

  for (const file of files) {
    const key = file.path || file.name;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(file);
  }

  const admFiles = unique
    .filter(isAdmFile)
    .sort((a, b) => getTimestamp(b) - getTimestamp(a));

  if (admFiles.length > 0) {
    console.log(
      `[NITRADO] ADM gefunden: ${admFiles[0].path || admFiles[0].name} (${admFiles.length} Dateien)`
    );
    return admFiles[0];
  }

  console.log(
    `[NITRADO] Keine ADM Datei gefunden. Durchsuchte Dateien: ${unique.length}`
  );

  return null;
}