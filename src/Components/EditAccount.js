import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/user";
import { logout } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "../utils/util";
import { processImage } from "../utils/imageUtils";
import Avatar from "react-avatar-edit";
import { Modal, ModalHeader, ModalActions } from "./ui/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAccount = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const el = useRef();

  const [email, setEmail] = useState(auth.email ?? "");
  const [avatar, setAvatar] = useState(auth.avatar ?? "");
  const [username, setUsername] = useState(auth.username ?? "");
  const [password, setPassword] = useState("");
  const [passwordChange, setPasswordChange] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (preview) => {
    setPreview(preview);
  };

  const onSelectFile = (event) => {
    setSelectedFile(URL.createObjectURL(event.target.files[0]));
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    // toast.success("Username updated successfully!"); // Show success toast
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // toast.success("Password updated successfully!"); // Show success toast
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // toast.success("Email updated successfully!"); // Show success toast
  };

  const handleSaveAvatar = async () => {
    try {
      const processedAvatar = await processImage(preview);
      if (!processedAvatar) {
        toast.error("Failed to process avatar image");
        return;
      }
      
      setAvatar(processedAvatar);
      setPreview(null);
      closeModal();
      
      const updatedAuth = { ...auth, avatar: processedAvatar };
      await dispatch(updateUser({ data: updatedAuth, id: auth.id }));
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar update failed:", error);
      toast.error("Failed to update avatar");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!auth.id) {
      alert("You Are Not Logged In!");
      return;
    }
    const id = auth.id;
    const data = {
      username,
      password,
      email,
      avatar,
    };
    if (passwordChange) {
      dispatch(updateUser({ data, id }));
      toast.success("Password updated successfully!"); // Show success toast
    } else {
      delete data.password;
      dispatch(updateUser({ data, id }));
      toast.success("Account info updated successfully!"); // Show success toast
    }
  };

  const isEmailValid = emailValidator(email);
  const isPasswordValid = passwordValidator(password);
  const isUsernameValid = usernameValidator(username);

  useEffect(() => {
    if (!auth.id) {
      navigate("/");
    }
  }, [auth.id, navigate]);

  const openModal = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center text-slate-300">
      {auth.avatar && (
        <img
          src={avatar || auth.avatar}
          alt={auth.username}
          className="mx-1 my-1 h-14 w-14 rounded-full"
        />
      )}
      <h1 className="text-2xl my-4">Edit Account Info</h1>
      <div className="border border-white rounded-lg flex items-center justify-center">
        <form onSubmit={handleSubmit} className="max-w-xs">
          <div className="mb-4">
            <label className="mr-3">Avatar</label>
            {selectedFile ? (
              <div>
                <Avatar
                  width={150}
                  height={150}
                  onCrop={onCrop}
                  onClose={onClose}
                  src={selectedFile}
                />
                <button
                  type="button"
                  className="text-sm my-2 mx-15 border border-white text-white rounded flex items-center text-black justify-center"
                  onClick={handleSaveAvatar}
                >
                  Set Avatar
                </button>
              </div>
            ) : (
              <button
                className="px-4 py-2 leading-none inline-block text-sm hover:border-teal-200 hover:text-teal-200 border rounded border-gray-300 my-4 mx-3"
                type="button"
                onClick={openModal}
              >
                Edit Avatar
              </button>
            )}
            {preview && <img src={preview} alt="Preview" />}
          </div>
          <div className="mb-4">
            <label>Username</label>
            <input
              className="w-full p-2 text-black border border-gray-300 bg-white text-sm"
              placeholder="Edit Username"
              value={username}
              onChange={handleUsernameChange}
            />
            {!isUsernameValid && (
              <div className="error-message text-orange-300">
                Must Contain 2-15 Alphanumeric Characters or Underscores
              </div>
            )}
          </div>
          {passwordChange ? (
            <div className="mb-4">
              <label>Password</label>
              <input
                className="w-full p-2 border border-gray-300 bg-white text-black"
                type="password"
                placeholder="Enter New Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {!isPasswordValid && (
                <div className="error-message text-orange-300">
                  Must Start w/Letter & Contain 2-14 Alphanumeric Characters or
                  Underscores
                </div>
              )}

              <div className="flex justify-center">
                <button
                  className="mt-4 border hover:text-teal-200 hover:border-teal-200 border-gray-300 text-white rounded flex items-center text-black min w-96 justify-center"
                  onClick={() => {
                    setPasswordChange(false);
                    setPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                className="mx-2 border border-gray-300 text-white opacity-100 ml-3 hover:border-teal-200 hover:text-teal-200 rounded flex items-center text-black min w-96 justify-center mb-2"
                onClick={() => setPasswordChange(true)}
              >
                Change Password
              </button>
            </div>
          )}
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 border border-gray-300 bg-white text-black"
            />
            {!isEmailValid && (
              <div className="error-message text-orange-300">
                Invalid Email Format
              </div>
            )}
          </div>
          <button
            disabled={
              (passwordChange && !isPasswordValid) ||
              !isUsernameValid ||
              !isEmailValid
            }
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-gray-300 hover:border-teal-200 hover:text-teal-200 mt-2 mx-4 lg:mt-0"
          >
            Submit
          </button>
        </form>
      </div>
      <Modal open={isModalOpen} onClickBackdrop={closeModal}>
        <div className="my-3 border rounded hover:border-teal-200 border-gray-300">
          <ModalHeader className={"my-2 flex justify-center items-center"}>
            Edit Avatar
          </ModalHeader>
          <div className="hover:text-teal-200 flex justify-center items-center">
            <Avatar
              className="hover:text-teal-200 text-white bg-white"
              width={150}
              height={150}
              onCrop={onCrop}
              onClose={onClose}
              src={selectedFile}
            />
          </div>
          <ModalActions className={"flex justify-center items-center"}>
            <button
              className="px-4 py-2 leading-none inline-block text-sm hover:border-teal-200 hover:text-teal-200 border rounded border-gray-300 my-4 ml-3"
              onClick={handleSaveAvatar}
            >
              Set Avatar
            </button>
            <button
              className="px-4 py-2 leading-none inline-block text-sm hover:border-teal-200 hover:text-teal-200 border rounded border-gray-300 my-4 mx-3"
              onClick={closeModal}
            >
              Cancel
            </button>
          </ModalActions>
        </div>
      </Modal>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default EditAccount;
