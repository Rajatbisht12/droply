"use client";

import { useState, useCallback, useEffect } from "react";
import { FileUp, FileText, User } from "lucide-react";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import UserProfile from "@/components/UserProfile";
import { useSearchParams } from "next/navigation";
import styles from "./Dashboard.module.css";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>("files");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("files");
    }
  }, [tabParam]);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Hi, <span className={styles.highlight}>
            {userName?.length > 10
              ? `${userName?.substring(0, 10)}...`
              : userName?.split(" ")[0] || "there"}
          </span>
          !
        </h2>
        <p className={styles.subtitle}>Your images are waiting for you.</p>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${activeTab === "files" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("files")}
          >
            <FileText className={styles.tabIcon} />
            <span>My Files</span>
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className={styles.tabIcon} />
            <span>Profile</span>
          </button>
          <div className={styles.tabIndicator} data-active-tab={activeTab} />
        </div>

        <div className={styles.tabContent}>
          {activeTab === "files" ? (
            <div className={styles.filesGrid}>
              <div className={styles.uploadSection}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <FileUp className={styles.cardIcon} />
                    <h3>Upload</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <FileUploadForm
                      userId={userId}
                      onUploadSuccess={handleFileUploadSuccess}
                      currentFolder={currentFolder}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fileListSection}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <FileText className={styles.cardIcon} />
                    <h3>Your Files</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <FileList
                      userId={userId}
                      refreshTrigger={refreshTrigger}
                      onFolderChange={handleFolderChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.profileSection}>
              <UserProfile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}