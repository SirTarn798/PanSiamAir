import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default async function upload(file, path) {
  let date = new Date();
  let storageRef = ref(storage, `${path}/${date + file.name}`);
  try {
    const snapshot = await uploadBytesResumable(storageRef, file);
    const imageLink = await getDownloadURL(snapshot.ref);
    return imageLink;
  } catch (err) {
    console.log(err);
  }
}
