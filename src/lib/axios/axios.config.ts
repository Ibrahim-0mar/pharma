/**
 * @file Axios Configuration
 * @module lib/axios
 * @description Configures and exports a custom Axios instance with base URL from environment variables
 */

import axios from 'axios';

/**
 * Custom Axios instance with base URL configuration
 * @constant
 * @description Creates an Axios instance with baseURL set from environment variables
 * @example
 * ```ts
 * // Usage in components/pages
 * import customAxios from '@/lib/axios/axios.config';
 *
 * const response = await customAxios.get('/endpoint');
 * ```
 */
const customAxios = axios.create({
  baseURL: 'http://localhost:7000',
});

export default customAxios;
