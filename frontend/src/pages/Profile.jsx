import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/chat-app-assets/assets";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const {authUser,updateProfile} = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSave =async (e) => {
    e.preventDefault();
    // Add backend logic here
   if(!selectedImage){
    await updateProfile({fullName:name,bio});
    navigate("/");
    return;
   }
   const render = new FileReader();
   render.readAsDataURL(selectedImage);
   render.onload =async()=>{
    const base64Image = render.result;
    await updateProfile({profilePic:base64Image,fullName:name,bio})
    navigate("/")
   }
    // Optional: navigate("/home") or show success message
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSave} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}
              alt="avatar"
              className={`w-12 h-12 object-cover ${selectedImage && "rounded-full"}`}
            />
            Upload profile image
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="bg-transparent border-b border-gray-500 outline-none text-base"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your Bio"
            className="bg-transparent border-b border-gray-500 outline-none text-base resize-none"
            rows={3}
          />

          <button
            type="submit"
            className="mt-4  transform bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full cursor-pointer"
          >
            Save Changes
          </button>
        </form>

        <img src={ authUser.profilePic || assets.logo_icon} alt="logo" className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}` }/>
      </div>
    </div>
  );
};

export default Profile;
