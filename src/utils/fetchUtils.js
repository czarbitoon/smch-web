/**
 * Staggered/Sequential Fetch Utilities
 * Prevents overwhelming the ngrok tunnel with simultaneous requests
 */

/**
 * Delay execution by specified milliseconds
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch multiple endpoints sequentially with optional delays
 * @param {Array} requests - Array of {url, params, label} objects
 * @param {Object} axiosInstance - Axios instance to use
 * @param {number} delayMs - Delay between requests in milliseconds (default: 200ms)
 * @returns {Promise<Array>} Results in same order as input
 */
export const sequentialFetch = async (requests, axiosInstance, delayMs = 200) => {
  const results = [];
  
  for (let i = 0; i < requests.length; i++) {
    try {
      const { url, params, label } = requests[i];
      
      // Add delay before each request except the first one
      if (i > 0) {
        await delay(delayMs);
      }
      
      console.log(`[Sequential Fetch] Fetching ${label || url}...`);
      const response = await axiosInstance.get(url, params ? { params } : {});
      results.push({ success: true, data: response.data, label });
    } catch (error) {
      console.error(`[Sequential Fetch] Error fetching ${requests[i].label || requests[i].url}:`, error);
      results.push({ success: false, error, label: requests[i].label });
    }
  }
  
  return results;
};

/**
 * Fetch with exponential backoff for resilience
 */
export const fetchWithBackoff = async (axiosInstance, url, params = {}, maxRetries = 3, initialDelayMs = 200) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axiosInstance.get(url, { params });
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const backoffDelay = initialDelayMs * Math.pow(2, attempt);
      console.warn(`[Fetch Backoff] Attempt ${attempt + 1} failed, retrying in ${backoffDelay}ms...`);
      await delay(backoffDelay);
    }
  }
};

/**
 * Batch fetch with rate limiting
 * Useful for fetching multiple independent resources
 */
export const batchFetch = async (requests, axiosInstance, concurrency = 2, delayMs = 200) => {
  const results = [];
  
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchPromises = batch.map(({ url, params, label }) => 
      axiosInstance.get(url, params ? { params } : {})
        .then(response => ({ success: true, data: response.data, label }))
        .catch(error => ({ success: false, error, label }))
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add delay between batches
    if (i + concurrency < requests.length) {
      await delay(delayMs);
    }
  }
  
  return results;
};
