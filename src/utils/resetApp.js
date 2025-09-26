// src/utils/resetApp.js

/**
 * Vacía todas las bases de datos IndexedDB del origen.
 */
export async function clearIndexedDB() {
  const dbInfos = (await indexedDB.databases?.()) ?? [];
  for (const { name } of dbInfos) {
    indexedDB.deleteDatabase(name);
  }
}

/**
 * Vacía la Cache API.
 */
export async function clearCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

/**
 * Vacía localStorage y sessionStorage.
 */
export function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

/**
 * Desregistra cualquier Service Worker activo (opcional).
 */
export async function unregisterServiceWorkers() {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(reg => reg.unregister()));
}

/**
 * Función pública que ejecuta todo y recarga la página.
 */
export async function resetApp() {
  if (!confirm('¿Seguro que deseas borrar TODOS los datos de la aplicación?')) return;

  await Promise.all([
    clearIndexedDB(),
    clearCaches(),
    clearStorage(),
    unregisterServiceWorkers()
  ]);

  // Recargamos la página en estado “nuevo”.
  location.reload();
}