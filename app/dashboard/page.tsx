// app/dashboard/page.js
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";
import Navbar from "@/components/Navbar";
import { CloudUpload } from "lucide-react";
import "./dashboard.css"; // 

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className="page-wrapper">
      <Navbar user={serializedUser} />

      <main className="dashboard-main">
        <DashboardContent
          userId={userId}
          userName={
            user?.firstName ||
            user?.fullName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            ""
          }
        />
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <CloudUpload className="footer-icon" />
            <h2 className="footer-title">Droply</h2>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Droply
          </p>
        </div>
      </footer>
    </div>
  );
}
