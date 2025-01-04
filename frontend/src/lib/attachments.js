const MISSING_ATTACHMENT_URL = '/images/missing-icon.svg';

/**
 * Get the actual attachment object from either a full image object or direct attachment
 * @param {Object} attachmentObject - Either a full image object or direct attachment
 * @returns {Object|null} The attachment object
 */
function getAttachment(attachmentObject) {
  if (!attachmentObject) return null;

  // If it's a full image object (has _fields), get its attachment
  if (attachmentObject._fields) {
    return attachmentObject.attachment;
  }

  // If it's already an attachment or has nested attachment
  return attachmentObject.attachment || attachmentObject;
}

/**
 * Check if attachment has multiple size variants
 * @param {Object} attachmentObject - Either a full image object or direct attachment
 * @returns {boolean} True if the attachment has multiple sizes
 */
function isSized(attachmentObject) {
  const attachment = getAttachment(attachmentObject);
  if (!attachment) return false;

  if (attachment._urls && typeof attachment._urls === 'object') {
    return Object.keys(attachment._urls).length > 1;
  }

  return false;
}

/**
 * Get focal point coordinates from attachment or image, or return default value if invalid
 * @param {Object} attachmentObject - Either a full image object or direct attachment
 * @param {string} [defaultValue='center center'] - Default value to return if no valid focal point
 * @returns {string} String with focal point for styling (e.g., "50% 50%") or default value if invalid
 */
function getFocalPoint(attachmentObject, defaultValue = 'center center') {
  if (!attachmentObject) return defaultValue;

  // Check _fields if it's from a relationship
  if (attachmentObject._fields &&
      typeof attachmentObject._fields.x === 'number' &&
      attachmentObject._fields.x !== null &&
      typeof attachmentObject._fields.y === 'number' &&
      attachmentObject._fields.y !== null) {
    return `${attachmentObject._fields.x}% ${attachmentObject._fields.y}%`;
  }

  // Check attachment object directly if it's a direct attachment
  const attachment = getAttachment(attachmentObject);
  if (attachment &&
      typeof attachment.x === 'number' && 
      attachment.x !== null && 
      typeof attachment.y === 'number' && 
      attachment.y !== null) {
    return `${attachment.x}% ${attachment.y}%`;
  }

  return defaultValue;
}

/**
 * Get the width from the image object, using crop dimensions if available,
 * otherwise falling back to original image dimensions
 * @param {object} imageObject - Image object from ApostropheCMS
 * @returns {number|undefined} The width of the image
 */
function getWidth(imageObject) {
  // Use cropped width from _fields if available
  if (imageObject?._fields?.width !== undefined && imageObject._fields.width !== null) {
    return imageObject._fields.width;
  }
  // Fall back to original image width
  return imageObject?.attachment?.width;
}

/**
 * Get the height from the image object, using crop dimensions if available,
 * otherwise falling back to original image dimensions
 * @param {object} imageObject - Image object from ApostropheCMS
 * @returns {number|undefined} The height of the image
 */
function getHeight(imageObject) {
  // Use cropped height from _fields if available
  if (imageObject?._fields?.height !== undefined && imageObject._fields.height !== null) {
    return imageObject._fields.height;
  }
  // Fall back to original image height
  return imageObject?.attachment?.height;
}

/**
 * Get URL for an attachment with optional size
 * @param {Object} attachmentObject - Either a full image object or direct attachment
 * @param {Object} [options={}] - Options object
 * @param {string} [options.size] - Size variant ('one-sixth', 'one-third', 'one-half', 'two-thirds', 'full', 'max', 'original')
 * @returns {string} The URL for the attachment
 */
export function getAttachmentUrl(attachmentObject, options = {}) {
  const attachment = attachmentObject?.attachment || attachmentObject;

  if (!attachment?._urls) {
    console.warn('Template warning: Missing attachment or _urls, using fallback icon');
    return MISSING_ATTACHMENT_URL;
  }

  // Return the requested size URL or original if size not found
  const size = options.size || 'full';
  return attachment._urls[size] || attachment._urls.original;
}

/**
 * Generate a srcset for an image attachment
 * @param {Object} attachmentObject - Either a full image object or direct attachment
 * @param {Object} [options] - Options for generating the srcset
 * @param {Array} [options.sizes] - Array of custom size objects to override the default sizes
 * @param {string} options.sizes[].name - The name of the size (e.g., 'small', 'medium')
 * @param {number} options.sizes[].width - The width of the image for this size
 * @param {number} [options.sizes[].height] - The height of the image for this size (optional)
 * @returns {string} The srcset string
 */
export function getAttachmentSrcset(attachmentObject, options = {}) {
  if (!attachmentObject || !isSized(attachmentObject)) {
    return '';
  }

  const defaultSizes = [
    { name: 'one-sixth', width: 190, height: 350 },
    { name: 'one-third', width: 380, height: 700 },
    { name: 'one-half', width: 570, height: 700 },
    { name: 'two-thirds', width: 760, height: 760 },
    { name: 'full', width: 1140, height: 1140 },
    { name: 'max', width: 1600, height: 1600}
  ];

  const sizes = options.sizes || defaultSizes;

  return sizes
    .map(size => `${getAttachmentUrl(attachmentObject, { ...options, size: size.name })} ${size.width}w`)
    .join(', ');
}

// Export the helper functions for use in components
export {
  getFocalPoint,
  getWidth,
  getHeight
};