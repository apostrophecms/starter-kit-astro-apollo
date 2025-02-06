/**
* @namespace ImageUtils
* @description Utilities for handling ApostropheCMS image attachments and their properties.
* Includes functions for URL generation, attachment processing, and image dimension calculations.
*/

/**
* Default fallback URL for missing image attachments
* @constant {string}
* @memberof ImageUtils
*/

const MISSING_ATTACHMENT_URL = '/images/missing-icon.svg';

/**
* Extracts attachment object from ApostropheCMS image data structure
* @memberof ImageUtils
* @param {Object} attachmentObject - Either a full image object or direct attachment
* @returns {Object|null} The attachment object or null if invalid
* @description Handles both full image objects with _fields and direct attachments,
* normalizing the data structure for other utility functions
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
* Checks if an attachment has multiple size variants available
* @memberof ImageUtils
* @param {Object} attachmentObject - Either a full image object or direct attachment
* @returns {boolean} True if the attachment has multiple size variants
* @description Verifies if the attachment includes multiple pre-generated size variants
* through the _urls property
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
* Retrieves image focal point coordinates
* @memberof ImageUtils
* @param {Object} attachmentObject - Either a full image object or direct attachment
* @param {string} [defaultValue='center center'] - Default focal point value
* @returns {string} CSS-compatible focal point string (e.g., "50% 50%")
* @description Extracts focal point data from either _fields or direct attachment,
* handling both relationship-based and direct attachment cases
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
* Gets image width, prioritizing crop dimensions
* @memberof ImageUtils
* @param {Object} imageObject - Image object from ApostropheCMS
* @returns {number|undefined} Image width in pixels
* @description Returns cropped width if available, falls back to original width
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
* Gets image height, prioritizing crop dimensions
* @memberof ImageUtils
* @param {Object} imageObject - Image object from ApostropheCMS
* @returns {number|undefined} Image height in pixels
* @description Returns cropped height if available, falls back to original height
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
* Extracts crop parameters from image object
* @memberof ImageUtils
* @param {Object} imageObject - The full image object from ApostropheCMS
* @returns {Object|null} Crop parameters object or null if no crop exists
* @description Returns object with left, top, width, and height if crop is defined
*/
function getCrop(imageObject) {
  // Check for crop parameters in _fields
  if (imageObject?._fields &&
      typeof imageObject._fields.left === 'number' &&
      typeof imageObject._fields.top === 'number' &&
      typeof imageObject._fields.width === 'number' &&
      typeof imageObject._fields.height === 'number') {
    return {
      left: imageObject._fields.left,
      top: imageObject._fields.top,
      width: imageObject._fields.width,
      height: imageObject._fields.height
    };
  }

  return null;
}

/**
* Constructs attachment URL with crop parameters and size
* @memberof ImageUtils
* @param {string} baseUrl - Base URL for the attachment
* @param {Object} crop - Crop parameters object
* @param {string} [size] - Size variant name
* @param {string} extension - File extension
* @returns {string} Complete URL with crop parameters
* @description Builds complete image URL following ApostropheCMS URL structure
*/
function buildAttachmentUrl(baseUrl, crop, size, extension) {
  let url = baseUrl;

  // Add crop parameters if they exist
  if (crop) {
    url += `.${crop.left}.${crop.top}.${crop.width}.${crop.height}`;
  }

  // Add size if specified
  if (size && size !== 'original') {
    url += `.${size}`;
  }

  // Add extension
  url += `.${extension}`;

  return url;
}

/**
* Generates complete URL for an image attachment
* @memberof ImageUtils
* @param {Object} imageObject - The full image object from ApostropheCMS
* @param {Object} [options={}] - Configuration options
* @param {string} [options.size] - Size variant name
* @returns {string} Complete image URL
* @description Handles various image states including just-edited, cropped, and
* pre-generated URLs
*/
export function getAttachmentUrl(imageObject, options = {}) {
  const attachment = getAttachment(imageObject);

  if (!attachment) {
    console.warn('Template warning: Missing attachment, using fallback icon');
    return MISSING_ATTACHMENT_URL;
  }

  // Get the requested size or default to 'full'
  const size = options.size || 'two-thirds';

  // Check if we're in the just-edited state (has uncropped URLs)
  if (attachment._urls?.uncropped) {
    // During the just-edited state, the main _urls already contain the crop parameters
    return attachment._urls[size] || attachment._urls.original;
  }

  // Get crop parameters from the image object's _fields
  const crop = getCrop(imageObject);

  // If we have _urls and no crop, use the pre-generated URL
  if (attachment._urls && !crop) {
    return attachment._urls[size] || attachment._urls.original;
  }

  // Derive the base URL path from _urls if available
  let baseUrl;
  if (attachment._urls?.original) {
    // Remove the extension from the original URL to get the base path
    baseUrl = attachment._urls.original.replace(`.${attachment.extension}`, '');
  }

  // Build the complete URL with crop parameters and size
  return buildAttachmentUrl(baseUrl, crop, size, attachment.extension);
}

/**
* Generates srcset string for responsive images
* @memberof ImageUtils
* @param {Object} attachmentObject - Either a full image object or direct attachment
* @param {Object} [options] - Configuration options
* @param {Array} [options.sizes] - Custom size definitions
* @returns {string} Complete srcset string
* @description Creates srcset string with all available size variants for
* responsive image loading
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