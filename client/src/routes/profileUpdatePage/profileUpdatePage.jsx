import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate, Link } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.target);
    const { username, email, password, phoneNumber } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        phoneNumber,
        avatar: avatar[0] || currentUser.avatar
      });
      updateUser(res.data);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors";
  const labelCls = "w-32 text-sm font-medium text-gray-600 shrink-0";

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Form side */}
      <div className="flex-[3] p-10 bg-white overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-lg">
          <h1 className="text-2xl font-playfair font-bold text-[#040404] mb-8">Update Profile</h1>
          {[{id:'username',label:'Username',type:'text',def:currentUser.username,placeholder:'Enter your username'},
            {id:'email',label:'Email',type:'email',def:currentUser.email,placeholder:'Enter your email'},
            {id:'phoneNumber',label:'Phone',type:'text',def:currentUser.phoneNumber||'',placeholder:'Enter your phone number'},
            {id:'password',label:'Password',type:'password',def:'',placeholder:'Leave blank to keep current password'},
          ].map(f => (
            <div key={f.id} className="flex items-center gap-4 mb-5">
              <label htmlFor={f.id} className={labelCls}>{f.label}</label>
              <input id={f.id} name={f.id} type={f.type} defaultValue={f.def} placeholder={f.placeholder} className={inputCls} />
            </div>
          ))}
          <div className="flex items-center gap-4 mb-8">
            <span className={labelCls}>Account Type</span>
            <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700">
              {currentUser.userType === "seller" ? "Seller Account" : "Buyer Account"}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg border-none cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
          {error && <span className="block text-sm text-red-500 text-center mt-3">{error}</span>}
          {successMessage && <span className="block text-sm text-green-600 text-center mt-3">{successMessage}</span>}
          <div className="text-center mt-5">
            <Link to="/profile" className="text-sm text-blue-500 no-underline font-medium hover:underline">← Back to Profile</Link>
          </div>
        </form>
      </div>
      {/* Side */}
      <div className="flex-[2] bg-gray-50 flex flex-col items-center justify-center gap-6 p-10">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt="Profile Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#fece51]"
        />
        <UploadWidget
          uwConfig={{ cloudName: "lamadev", uploadPreset: "estate", multiple: false, maxImageFileSize: 2000000, folder: "avatars" }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
