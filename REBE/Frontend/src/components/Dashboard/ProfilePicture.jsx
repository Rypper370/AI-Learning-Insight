import { useSelector } from "react-redux";
import { useState } from "react";

export default function ProfilePicture({
  size = 128,
  className = "",
  style = {},
  alt = "profile picture",
}) {
  const profile = useSelector((state) => state.profile.data);
  const [error, setError] = useState(false);

  const src =
    (!error && profile?.resolved_profile_picture_url) ||
    `https://placehold.co/${size}`;

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setError(true)}
      className={`profile-picture-image ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        ...style,
      }}
    />
  );
}
