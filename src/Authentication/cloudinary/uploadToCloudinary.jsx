const uploadToCloudinary = async (imageFile) => {
  const data = new FormData();
  data.append("file", imageFile);
  data.append("upload_preset", "manzoor_upload"); 
  data.append("cloud_name", "dpygiayf2");

  const res = await fetch("https://api.cloudinary.com/v1_1/dpygiayf2/image/upload", {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  return result.secure_url; // this is the image URL
};

export default uploadToCloudinary;