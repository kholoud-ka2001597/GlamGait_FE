// helpers/imageUploader.js


export async function uploadImage(file) {
  try {
    if (!file) {
      throw new Error("No image file uploaded.");
    }
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "bookImg");
    data.append("cloud_name", "qthrift");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/qthrift/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const img = await res.json();
    return img.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed.");
  }
}
