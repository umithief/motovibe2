
// Bu dosya gerçek bir veritabanını simüle eder.
// Verileri LocalStorage'da tutar.

const DB_KEYS = {
  USERS: 'mv_users',
  ORDERS: 'mv_orders',
  SESSION: 'mv_session',
  FORUM_TOPICS: 'mv_forum_topics',
  PRODUCTS: 'mv_products',
  SLIDES: 'mv_slides',
  CATEGORIES: 'mv_categories',
  ROUTES: 'mv_routes',
  MUSIC: 'mv_music',
  MODELS: 'mv_3d_models', // Yeni
  LOGS: 'mv_system_logs',
  VISITOR_STATS: 'mv_visitor_stats',
  ANALYTICS: 'mv_analytics_events',
  RECORDINGS: 'mv_session_recordings', // RRWeb recordings
  NEGOTIATIONS: 'mv_negotiations' // Offers sent to admin
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage read error', e);
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (e: any) {
    // Handle Storage Quota Exceeded
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22) {
        console.warn(`Storage quota exceeded while saving ${key}. Initiating cleanup protocol...`);
        
        // Waterfall cleanup strategy: Try deleting non-essential large data one by one
        // Order: Heaviest/Least Critical -> More Critical
        const cleanupTargets = [
            DB_KEYS.RECORDINGS, // RRWeb sessions (Heaviest, ~2-3MB)
            DB_KEYS.ANALYTICS,  // Event logs
            DB_KEYS.LOGS,       // System logs
            DB_KEYS.VISITOR_STATS, // Visitor counts
            DB_KEYS.NEGOTIATIONS // Negotiation history (often contains images)
        ];

        let recovered = false;

        for (const target of cleanupTargets) {
            // Don't delete the key we are actively trying to save unless it's self-clearing
            if (key === target) continue;

            // Check if key exists before trying to remove
            if (localStorage.getItem(target)) {
                console.log(`Attempting to recover space by deleting: ${target}`);
                localStorage.removeItem(target);
                
                try {
                    const serializedRetry = JSON.stringify(value);
                    localStorage.setItem(key, serializedRetry);
                    console.log(`✅ Storage recovered. Saved ${key} successfully.`);
                    recovered = true;
                    break; // Stop cleaning if successful
                } catch (retryErr) {
                    console.warn(`⚠️ Clearing ${target} was not enough. Moving to next target...`);
                }
            }
        }
        
        if (!recovered) {
            console.error(`CRITICAL: Storage is full. Data lost for key: ${key}`);
            // Fallback: If we can't save new data, we might need to alert the user or fail gracefully.
            // For now, we log the critical error.
        }
    } else {
        console.error('Storage write error', e);
    }
  }
};

export const DB = {
  USERS: DB_KEYS.USERS,
  ORDERS: DB_KEYS.ORDERS,
  SESSION: DB_KEYS.SESSION,
  FORUM_TOPICS: DB_KEYS.FORUM_TOPICS,
  PRODUCTS: DB_KEYS.PRODUCTS,
  SLIDES: DB_KEYS.SLIDES,
  CATEGORIES: DB_KEYS.CATEGORIES,
  ROUTES: DB_KEYS.ROUTES,
  MUSIC: DB_KEYS.MUSIC,
  MODELS: DB_KEYS.MODELS,
  LOGS: DB_KEYS.LOGS,
  VISITOR_STATS: DB_KEYS.VISITOR_STATS,
  ANALYTICS: DB_KEYS.ANALYTICS,
  RECORDINGS: DB_KEYS.RECORDINGS,
  NEGOTIATIONS: DB_KEYS.NEGOTIATIONS
};
