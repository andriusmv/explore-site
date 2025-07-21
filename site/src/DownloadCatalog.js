// URL for the remote manifest file
const MANIFEST_URL = 'https://labs.overturemaps.org/data/explore-site-download-manifest.json';

// Cache the manifest to avoid repeated fetches
let cachedManifest = null;
let manifestFetchPromise = null;

/**
 * Fetches the manifest from the remote URL
 * @returns {Promise<Object>} The manifest object
 */
async function fetchManifest() {
  if (cachedManifest) {
    return cachedManifest;
  }

  if (!manifestFetchPromise) {
    manifestFetchPromise = fetch(MANIFEST_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        cachedManifest = data;
        return data;
      })
      .catch(error => {
        console.error('Error fetching manifest:', error);
        manifestFetchPromise = null; // Allow retry on next call
        throw error;
      });
  }

  return manifestFetchPromise;
}

/**
 * Gets the download catalog based on the current bbox and visible types
 * @param {Array} bbox The bounding box [minx, miny, maxx, maxy]
 * @param {Array} visibleTypes An array of type names that are currently visible on the map
 * @returns {Promise<Object>} A promise that resolves to an object with the 'basePath' and array of 'types'
 */
export async function getDownloadCatalog(bbox, visibleTypes) {
  try {
    const manifest = await fetchManifest();

    let fileCatalog = {};
    let types = [];

    fileCatalog.basePath = 'https://overturemaps-us-west-2.s3.amazonaws.com/release/' + manifest.release_version;

    visibleTypes.forEach(type => {
      if (!manifest.types[type]) {
        console.warn(`Type ${type} not found in manifest`);
        return;
      }

      let typeEntry = {
        name: type,
        files: []
      };

      manifest.types[type].forEach(file => {
        if (intersects(bbox, file.bbox)) {
          typeEntry.files.push(file.path);
        }
      });

      if (typeEntry.files.length > 0) {
        types.push(typeEntry);
      }
    });

    fileCatalog.types = types;
    return fileCatalog;
  } catch (error) {
    console.error('Error getting download catalog:', error);
    throw error;
  }
}


// Calculate intersection given 4-item bbox list of [minx, miny, maxx, maxy]
function intersects(bb1, bb2) {
   return (
      bb1[0] < bb2[2] &&
      bb1[2] > bb2[0] &&
      bb1[1] < bb2[3] &&
      bb1[3] > bb2[1]
   );
}
