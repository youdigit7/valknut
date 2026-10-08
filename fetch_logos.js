async function fetchLogos(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const html = await res.text();
    const imgs = html.match(/<img[^>]+src="([^">]+logo[^">]+)"/gi) || [];
    console.log(`\n=== Images from ${url} ===\n`);
    imgs.forEach(img => {
      console.log(img);
    });
  } catch (e) {
    console.error(`Error fetching ${url}:`, e.message);
  }
}

fetchLogos('https://mintpay.lk');
fetchLogos('https://koko.lk');
