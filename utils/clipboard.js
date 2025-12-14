/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const copyToClipboard = async (text) => {
  try {
    // Modern clipboard API (preferred method)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-secure contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
