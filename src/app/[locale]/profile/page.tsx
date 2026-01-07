import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata = {
    title: "My Profile - E-commerce",
    description: "Manage your account, view orders, and track your wishlist.",
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/profile");
    }

    await dbConnect();
    const user = await User.findById(session.user.id).lean();

    if (!user) {
        redirect("/login");
    }

    // Convert MongoDB document to plain object for client component
    const userData = {
        name: user.name,
        email: user.email,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
    };

    return <ProfileClient user={userData} />;
}
