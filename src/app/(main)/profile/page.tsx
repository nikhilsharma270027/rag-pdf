"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { AvatarGenerator } from "../../../components/avatar-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProfilePage() {
  const session = useSession();
  const router = useRouter();
  const [avatarImage, setAvatarImage] = useState("");
  const user = session?.data?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
  });

  // Initialize form data when session is available
  useEffect(() => {
    if (user) {
      setFormdata({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!session?.data && !user) {
      // router.push("/sign-in");
    }

    // Set current user's image if it exists
    if (user?.image) {
      setAvatarImage(user.image);
    } else if (user && !user.image) {
      // Generate initial avatar if user has no image
      generateDefaultAvatar();
    }
  }, [session, user, router]);

  const generateDefaultAvatar = () => {
    const profile_imgs_name_list = [
      "Garfield",
      "Tinkerbell",
      "Annie",
      "Loki",
      "Cleo",
      "Angel",
      "Bob",
      "Mia",
      "Coco",
      "Gracie",
      "Bear",
      "Bella",
      "Abby",
      "Harley",
      "Cali",
      "Leo",
      "Luna",
      "Jack",
      "Felix",
      "Kiki",
    ];
    const profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

    const randomName = profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)];
    const randomCollection = profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)];

    const defaultImage = `https://api.dicebear.com/6.x/${randomCollection}/svg?seed=${randomName}`;
    setAvatarImage(defaultImage);
  };

  const handleImageChange = (newImageUrl: string) => {
    setAvatarImage(newImageUrl);
  };

  const saveAvatar = async () => {
    if (!avatarImage || !user) return;

    try {
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          image: avatarImage,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Avatar saved successfully!", result);
        toast.success("Avatar saved successfully!");
        // Refresh session to show updated avatar
        // if (session?.update) {
        //   await session.update();
        // }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save avatar!");
      }
    } catch (error) {
      toast.error("Failed to save avatar!");
      console.error("Failed to save avatar:", error);
    }
  };

  if (!user) {
    return null;
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formdata, name: e.target.value });
  };

  const updateUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't make API call if name hasn't changed
    if (formdata.name === user.name) {
      toast.info("No changes detected");
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch("/api/user/changeusername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: formdata.name,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Username updated successfully!", result);
        toast.success("Username updated successfully!");

        // Refresh session to get updated user data
        // if (session?.update) {
        //   await session.update();
        // }

        setIsEditing(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update username!");
      }
    } catch (error) {
      toast.error("Failed to update username!");
      console.error("Failed to update username:", error);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    setFormdata({
      name: user.name || "",
      email: user.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="mx-auto w-full max-w-6xl mt-10 px-4 py-8 bg-[#EFE9D5] border-2 border-black rounded-lg">
      <Card className="p-6">
        <CardHeader className="text-2xl font-bold mb-4">
          <CardTitle className="text-center">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <AvatarGenerator currentImage={avatarImage} size={140} onImageChange={handleImageChange} />

            {avatarImage && (
              <button
                onClick={saveAvatar}
                className="px-6 py-2 bg-green-600 text-white border-2 border-black rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                💾 Save Avatar
              </button>
            )}
          </div>

          {/* User Info Section */}
          <div className="flex-1">
            <div className="space-y-4">
              <div className="p-4 border-2 border-black rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg mb-2">User Information</h3>
                  <Button
                    variant="default"
                    className="border-2 border-black bg-green-400 text-white font-medium hover:bg-green-500 transition-all duration-100"
                    onClick={() => setIsEditing((prev) => !prev)}>
                    Edit
                  </Button>
                </div>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role || "User"}
                </p>
                <p>
                  <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Avatar Info */}
              {avatarImage && (
                <div className="p-4 border-2 border-black rounded-lg bg-white">
                  <h3 className="font-semibold text-lg mb-2">Avatar</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Click the buttons to generate a new random avatar, then save to update your profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {isEditing && (
          <CardContent>
            <div className="flex-1">
              <div className="space-y-4">
                <form onSubmit={updateUsername}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      value={formdata.name}
                      onChange={handleNameChange}
                      className="w-full border-2 border-black rounded-lg px-3 py-2 bg-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <Input
                      type="text"
                      id="email"
                      value={formdata.email}
                      className="w-full border-2 border-black rounded-lg px-3 py-2 bg-white text-gray-600"
                      disabled
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="border-2 border-black bg-green-600 text-white font-medium hover:bg-green-700 transition-all duration-100">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      className="border-2 border-black bg-gray-500 text-white font-medium hover:bg-gray-600 transition-all duration-100">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
