const MISSING_ATTACHMENT_URL = '/images/missing-icon.svg';

/**
 * Check if attachment has multiple size variants
 * @param {Object} attachment - The attachment object to check
 * @returns {boolean} True if the attachment has multiple sizes
 */
function isSized(attachment) {
  if (!attachment) {
    return false;
  }

  // Check if attachment has _urls object with multiple sizes
  if (attachment._urls && typeof attachment._urls === 'object') {
    // Check if there are actually multiple sizes
    return Object.keys(attachment._urls).length > 1;
  }

  // For nested attachment objects
  if (attachment.attachment && attachment.attachment._urls) {
    return Object.keys(attachment.attachment._urls).length > 1;
  }

  return false;
}

/**
 * Get URL for an attachment with optional size
 * @param {Object} attachment - The attachment object from Apostrophe
 * @param {Object} [options={}] - Options object
 * @param {string} [options.size] - Size variant ('one-sixth', 'one-third', 'one-half', 'two-thirds', 'full', 'max')
 * @param {Object} [options.crop] - Crop configuration object
 * @returns {string} The constructed URL for the attachment
 */
export function getAttachmentUrl(attachment, options = {}) {
  if (!attachment) {
    console.warn('Template warning: Impossible to retrieve the attachment url since it is missing, a default icon has been set. Please fix this ASAP!');
    return MISSING_ATTACHMENT_URL;
  }

  // If it's an image and we're requesting a specific size, try to get from _urls
  if (isSized(attachment) && options.size && options.size !== 'original') {
    // The _urls object contains pre-generated URLs for standard sizes
    if (attachment._urls?.[options.size]) {
      return attachment._urls[options.size];
    }
  }

  // For original files or when _urls doesn't have our size,
  // construct the URL following Apostrophe's pattern
  let path = `/attachments/${attachment._id}-${attachment.name}`;

  // Handle crop if present
  const crop = options.crop !== false && (options.crop || attachment._crop || attachment.crop);
  if (crop?.width) {
    path += `.${crop.left}.${crop.top}.${crop.width}.${crop.height}`;
  }

  // Handle size unless original is requested
  if (isSized(attachment) && options.size !== 'original') {
    const effectiveSize = options.size || 'full';
    path += `.${effectiveSize}`;
  }

  return `${path}.${attachment.extension}`;
}

/**
 * Get the first attachment from an array, with URL processing
 * @param {Array} attachments - Array of attachments
 * @param {Object} [options] - Options to pass to getAttachmentUrl
 * @returns {Object|null} First attachment with processed URL
 */
export function getFirstAttachment(attachments, options = {}) {
  const first = attachments?.[0];
  if (!first) {
    return null;
  }

  return {
    ...first,
    url: getAttachmentUrl(first, options)
  };
}

/**
 * Generate a srcset for an image attachment
 * @param {Object} attachment - The attachment object
 * @returns {string} The srcset string
 */
export function getAttachmentSrcset(attachment) {
  if (!attachment || !isSized(attachment)) {
    return '';
  }

  const sizes = [
    { name: 'one-sixth', width: 190, height: 350 },
    { name: 'one-third', width: 380, height: 700 },
    { name: 'one-half', width: 570, height: 700 },
    { name: 'two-thirds', width: 760, height: 760 },
    { name: 'full', width: 1140, height: 1140 },
    { name: 'max', width: 1600, height: 1600}
  ];

  return sizes
    .map(size => `${getAttachmentUrl(attachment, { size: size.name })} ${size.width}w`)
    .join(', ');
}