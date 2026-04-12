export async function getServices(token) {
  const res = await fetch('https://api.nitrado.net/services', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data.data.services;
}

export async function getFirstDayZService(token) {
  const services = await getServices(token);

  const dayz = services.find(s =>
    s.details?.folder_short === 'dayz' ||
    s.details?.game === 'dayz'
  );

  return dayz || null;
}

export async function getLogFiles(token, serviceId) {
  const res = await fetch(
    `https://api.nitrado.net/services/${serviceId}/gameservers/file_server/list`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  return data.data.entries;
}

export async function getDownloadUrl(token, serviceId, path) {
  const res = await fetch(
    `https://api.nitrado.net/services/${serviceId}/gameservers/file_server/download?file=${encodeURIComponent(path)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  return data.data.token.url;
}