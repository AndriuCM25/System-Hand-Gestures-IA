/**
 * api.js — Servicios conectados a Supabase
 * Auth, historial de gestos y estadísticas.
 */
import { supabase } from '../lib/supabase';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  /** Registrar nuevo usuario */
  register: async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    return data;
  },

  /** Login con email y contraseña */
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  /** Cerrar sesión */
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('hc_token');
  },

  /** Obtener usuario actual */
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /** Escuchar cambios de sesión */
  onAuthChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ─── Gestos ───────────────────────────────────────────────────────────────────
export const gesturesAPI = {
  /** Guardar gesto detectado en Supabase */
  save: async (gesture, action, confidence) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('gestures')
      .insert({
        user_id:    user.id,
        gesture,
        action:     action || '',
        confidence: confidence || 0,
      });
    if (error) { console.warn('Supabase gestures save:', error.message); return null; }
    return data;
  },

  /** Historial de gestos del usuario autenticado */
  getHistory: async (limit = 50) => {
    const { data, error } = await supabase
      .from('gestures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) { console.warn('Supabase gestures get:', error.message); return []; }
    return data || [];
  },

  /** Limpiar historial */
  clearHistory: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('gestures').delete().eq('user_id', user.id);
  }
};

// ─── Estadísticas ─────────────────────────────────────────────────────────────
export const statsAPI = {
  get: async () => {
    const { data: gestures, error } = await supabase
      .from('gestures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !gestures) {
      return { totalGestures: 0, todayGestures: 0, gesturesByType: [], recentGestures: [] };
    }

    const today     = new Date().toISOString().slice(0, 10);
    const todayList = gestures.filter(g => g.created_at?.startsWith(today));

    // Agrupar por tipo de gesto
    const byType = {};
    gestures.forEach(g => {
      if (!byType[g.gesture]) byType[g.gesture] = { gesture: g.gesture, count: 0, total: 0 };
      byType[g.gesture].count++;
      byType[g.gesture].total += g.confidence || 0;
    });

    const gesturesByType = Object.values(byType)
      .map(g => ({
        gesture:        g.gesture,
        count:          g.count,
        avg_confidence: +((g.total / g.count) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalGestures:  gestures.length,
      todayGestures:  todayList.length,
      gesturesByType,
      recentGestures: gestures.slice(0, 10),
      accuracy:       98.5,
      activeSessions: 1,
    };
  }
};

// ─── Health check ─────────────────────────────────────────────────────────────
export const checkBackend = async () => {
  try {
    const { error } = await supabase.from('gestures').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

export default supabase;
