import { initializeApp, deleteApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

async function testBucket(bucketName) {
  console.log(`\n========================================`);
  console.log(`Testing bucket: ${bucketName}`);
  console.log(`========================================`);
  const app = initializeApp({
    apiKey: "AIzaSyAAvUsgdse3WNq_6kf0A3Jr-a6hyWRUUVo",
    authDomain: "valknut-c8268.firebaseapp.com",
    projectId: "valknut-c8268",
    storageBucket: bucketName,
    appId: "1:29984285586:web:9914a45af65ffa9308974b"
  }, `app-${bucketName}`);

  const storage = getStorage(app);
  const testRef = ref(storage, `test-valknut-${Date.now()}.txt`);

  try {
    const snap = await uploadString(testRef, "VALKNUT TEST CONTENT", "raw");
    console.log(` SUCCESS with bucket: ${bucketName}! FullPath: ${snap.metadata.fullPath}`);
    const url = await getDownloadURL(snap.ref);
    console.log(` Public URL: ${url}`);
    return true;
  } catch (err) {
    console.log(` FAILED with bucket: ${bucketName}`);
    console.log(`Code:`, err.code);
    console.log(`Message:`, err.message);
    if (err.customData) console.log(`customData:`, JSON.stringify(err.customData));
    if (err.serverResponse) console.log(`serverResponse:`, err.serverResponse);
    return false;
  } finally {
    await deleteApp(app);
  }
}

async function run() {
  const b1 = await testBucket("valknut-c8268.firebasestorage.app");
  const b2 = await testBucket("valknut-c8268.appspot.com");
  console.log(`\nResults: firebasestorage.app: ${b1}, appspot.com: ${b2}`);
}

run();
