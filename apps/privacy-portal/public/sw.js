// Service Worker for CyberCorrect™ Privacy Portal
const CACHE_VERSION = '1.0.0';
const STATIC_CACHE = `cybercorrect-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `cybercorrect-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `cybercorrect-images-${CACHE_VERSION}`;

// Static assets that should be cached immediately
const STATIC_CACHE_URLS = [
  '/',
  '/privacy',
  '/data-rights',
  '/stakeholder-duties',
  '/privacy/dashboard',
  '/manifest.json',
  '/logos/cybercorrect-logo.png'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for API calls
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for dynamic content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets - cache first
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.avif')) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // API calls - network first
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // HTML pages - stale while revalidate
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

// Install event - cache static resources
self.addEventListener('install', (event) => {
  // Use minimal logging for production
  if (self.location.hostname !== 'localhost') {
    console.log('SW installing...');
  }
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_CACHE_URLS)),
      caches.open(DYNAMIC_CACHE),
      caches.open(IMAGE_CACHE)
    ]).then(() => {
      if (self.location.hostname !== 'localhost') {
        console.log('SW installed');
      }
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Use minimal logging for production
  if (self.location.hostname !== 'localhost') {
    console.log('SW activating...');
  }
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.startsWith('cybercorrect-') || 
                (cacheName !== STATIC_CACHE && 
                 cacheName !== DYNAMIC_CACHE && 
                 cacheName !== IMAGE_CACHE)) {
              if (self.location.hostname !== 'localhost') {
                console.log('Deleting old cache:', cacheName);
              }
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        if (self.location.hostname !== 'localhost') {
          console.log('SW activated');
        }
        return self.clients.claim();
      })
  );
});

// Cache strategies implementation
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const strategy = getCacheStrategy(event.request);
  const url = new URL(event.request.url);
  
  // Determine which cache to use
  let cacheName = DYNAMIC_CACHE;
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css')) {
    cacheName = STATIC_CACHE;
  } else if (url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg)$/)) {
    cacheName = IMAGE_CACHE;
  }

  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case CACHE_STRATEGIES.CACHE_FIRST:
            return await cacheFirst(event.request, cacheName);
          case CACHE_STRATEGIES.NETWORK_FIRST:
            return await networkFirst(event.request, cacheName);
          case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            return await staleWhileRevalidate(event.request, cacheName);
          default:
            return await fetch(event.request);
        }
      } catch (error) {
        // Only log errors in development
        if (self.location.hostname === 'localhost') {
          console.log('Service Worker fetch error:', error);
        }
        
        // Return offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match('/');
          if (offlineResponse) {
            return offlineResponse;
          }
        }
        
        // Return a basic offline page
        return new Response('Offline - Please check your connection', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when connection is restored
  if (self.location.hostname === 'localhost') {
    console.log('Background sync triggered');
  }
  // Implementation would depend on specific offline functionality
}