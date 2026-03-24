import { XMLValidator } from 'fast-xml-parser';

const MAX_FILE_SIZE = 1024 * 1024 * 4;

export function isAllowedSize(size) {
  return size <= MAX_FILE_SIZE;
}

export async function downloadAttachmentContent(attachmentUrl) {
  const response = await fetch(attachmentUrl);

  if (!response.ok) {
    throw new Error('DOWNLOAD_FAILED');
  }

  return await response.text();
}

export function getExtension(filename = '') {
  const lower = filename.toLowerCase();

  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.xml')) return 'xml';

  return 'unknown';
}

function extractJsonPosition(message = '') {
  const lineColumnMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  const positionMatch = message.match(/position\s+(\d+)/i);

  return {
    line: lineColumnMatch ? Number(lineColumnMatch[1]) : null,
    column: lineColumnMatch ? Number(lineColumnMatch[2]) : null,
    position: positionMatch ? Number(positionMatch[1]) : null
  };
}

export function validateJson(content) {
  try {
    JSON.parse(content);

    return {
      valid: true,
      type: 'json',
      error: null
    };
  } catch (error) {
    const extracted = extractJsonPosition(error.message);

    return {
      valid: false,
      type: 'json',
      error: {
        message: error.message,
        line: extracted.line,
        column: extracted.column,
        position: extracted.position
      }
    };
  }
}

export function validateXml(content) {
  const result = XMLValidator.validate(content);

  if (result === true) {
    return {
      valid: true,
      type: 'xml',
      error: null
    };
  }

  return {
    valid: false,
    type: 'xml',
    error: {
      message: result.err?.msg || 'Invalid XML',
      line: result.err?.line ?? null,
      column: result.err?.col ?? null,
      position: null
    }
  };
}

export function validateByExtension(filename, content) {
  const ext = getExtension(filename);

  if (ext === 'json') return validateJson(content);
  if (ext === 'xml') return validateXml(content);

  return {
    valid: false,
    type: 'unknown',
    error: {
      message: 'UNSUPPORTED_EXTENSION',
      line: null,
      column: null,
      position: null
    }
  };
}