/**
 * supabase.js — Cliente de Supabase para HandControl AI
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mcjvkolwcchwagmordwt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UN9vTvbhD8-999aqvUpdzw_4aDka57N';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
