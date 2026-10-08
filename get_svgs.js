// Removed fs

async function getSvgs(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const svgs = [];
    const parts = text.split('"');
    for (const part of parts) {
      if (part.includes('.svg')) {
        svgs.push(part);
      }
    }
    console.log("SVGs for " + url + ":");
    console.log(Array.from(new Set(svgs)));
  } catch (e) {
    console.error(e);
  }
}

getSvgs('https://mintpay.lk');
getSvgs('https://paywithkoko.com');
