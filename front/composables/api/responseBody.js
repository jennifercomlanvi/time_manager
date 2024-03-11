/**
 * Retourne le body d'une réponse à partir du headers Content-type
 * @param {Response} response
 * @returns {Promise<any>|ReadableStream<Uint8Array>|null}
 */
export default async (response) => {
  const type = response.headers.get("Content-Type");
  if (type) {
    if (type.match(/.*application\/json.*/g)) {
      return response.json();
    }
    if (type.match(/.*application\/pdf.*/g)) {
      return response.blob();
    }
    if (type.match(/.*image\/.*/g)) {
      return response.blob();
    }
    if (type.match(/.*text\/.*/g)) {
      return response.text();
    }
  }
  return response.body();
};
