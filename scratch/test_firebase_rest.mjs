const apiKey = "AIzaSyAAvUsgdse3WNq_6kf0A3Jr-a6hyWRUUVo";
const buckets = [
  "valknut-c8268.firebasestorage.app",
  "valknut-c8268.appspot.com"
];

for (const b of buckets) {
  const url = `https://firebasestorage.googleapis.com/v0/b/${b}/o?key=${apiKey}`;
  console.log(`\nGET ${url}`);
  try {
    const res = await fetch(url);
    console.log(`HTTP Status:`, res.status, res.statusText);
    const body = await res.text();
    console.log(`Response Body:`, body);
  } catch (e) {
    console.error(`Fetch error:`, e);
  }
}
