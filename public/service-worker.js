
// Service Worker for PWA functionality
const CACHE_NAME = 'study-helper-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  // Take control of clients immediately
  self.clients.claim();
});

// Fetch event strategy - Network first with cache fallback for GET requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Supabase API and storage requests - these should always go to network
  if (event.request.url.includes('supabase.co')) {
    // For storage requests, we might need special handling
    if (event.request.url.includes('/storage/v1/object/')) {
      try {
        // Try to handle storage URLs specially
        event.respondWith(
          fetch(event.request)
            .catch(() => {
              // If network fetch fails, try accessing using sign URL
              if (event.request.url.includes('/public/')) {
                const signUrl = event.request.url.replace('/public/', '/sign/');
                return fetch(signUrl)
                  .catch(() => {
                    return caches.match(event.request);
                  });
              }
              return caches.match(event.request);
            })
        );
        return;
      } catch (error) {
        console.error("Error in storage request handling:", error);
        // Continue with normal handling if our special handling fails
      }
    }
    return; // Skip other supabase requests
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response to store in cache and return the original
        const responseClone = response.clone();
        
        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Return from cache if network fails
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return default offline page if nothing in cache
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            return new Response('Network error occurred', { 
              status: 408, 
              headers: { 'Content-Type': 'text/plain' } 
            });
          });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
