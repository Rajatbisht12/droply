"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import {
  Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
} from "lucide-react";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import axios from "axios";
import styles from "./FileUploadForm.module.css";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder creation state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      addToast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`,
        color: "success",
      });

      clearFile();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      addToast({
        title: "Upload Failed",
        description: "We couldn't upload your file. Please try again.",
        color: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      addToast({
        title: "Invalid Folder Name",
        description: "Please enter a valid folder name.",
        color: "danger",
      });
      return;
    }
  
    setCreatingFolder(true);
  
    try {
      const response = await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });
  
      if (response.data.success) {
        addToast({
          title: "Folder Created",
          description: `Folder "${folderName}" has been created successfully.`,
          color: "success",
        });
  
        setFolderName("");
        setFolderModalOpen(false);
  
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        throw new Error(response.data.error || "Failed to create folder");
      }
    } catch (error: any) {
      console.error("Error creating folder:", error);
      addToast({
        title: "Folder Creation Failed",
        description: error.response?.data?.error || error.message || "We couldn't create the folder. Please try again.",
        color: "danger",
      });
    } finally {
      setCreatingFolder(false);
    }
  };
  
  return (
    <div className={styles.container}>
      {/* Action buttons */}
      <div className={styles.actionButtons}>
        <Button
          color="primary"
          variant="flat"
          startContent={<FolderPlus className={styles.fileIconSmall} />}
          onClick={() => setFolderModalOpen(true)}
          className={styles.actionButton}
        >
          New Folder
        </Button>
        <Button
          color="primary"
          variant="flat"
          startContent={<FileUp className={styles.fileIconSmall} />}
          onClick={() => fileInputRef.current?.click()}
          className={styles.actionButton}
        >
          Add Image
        </Button>
      </div>

      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`${styles.fileDropArea} ${
          error
            ? styles.error
            : file
              ? styles.hasFile
              : ""
        }`}
      >
        {!file ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <FileUp className={styles.fileIcon} />
            <div>
              <p className={styles.fileInfo}>
                Drag and drop your image here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.browseButton}
                >
                  browse
                </button>
              </p>
              <p className={styles.fileSizeInfo}>Images up to 5MB</p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={styles.fileInput}
              accept="image/*"
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div className={styles.filePreview}>
              <div className={styles.filePreviewInfo}>
                <div className={styles.fileIconContainer}>
                  <FileUp className={styles.fileIconSmall} />
                </div>
                <div>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={clearFile}
                style={{ color: "#6b7280" }}
              >
                <X className={styles.fileIconSmall} />
              </Button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <AlertTriangle className={styles.errorIcon} />
                <span className={styles.errorText}>{error}</span>
              </div>
            )}

            {uploading && (
              <Progress
                value={progress}
                color="primary"
                size="sm"
                showValueLabel={true}
                style={{ maxWidth: "100%" }}
              />
            )}

            <Button
              color="primary"
              startContent={<Upload className={styles.fileIconSmall} />}
              endContent={!uploading && <ArrowRight className={styles.fileIconSmall} />}
              onClick={handleUpload}
              isLoading={uploading}
              className={styles.uploadButton}
              isDisabled={!!error}
            >
              {uploading ? `Uploading... ${progress}%` : "Upload Image"}
            </Button>
          </div>
        )}
      </div>

      {/* Upload tips */}
      <div className={styles.tipsContainer}>
        <h4 className={styles.tipsTitle}>Tips</h4>
        <ul className={styles.tipsList}>
          <li>• Images are private and only visible to you</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
          <li>• Maximum file size: 5MB</li>
        </ul>
      </div>

      {/* Create Folder Modal */}
      {/* <Modal
        isOpen={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        backdrop="blur"
        classNames={{
          base: styles.modalBase,
          header: styles.modalHeader,
          footer: styles.modalFooter,
        }}
      >
        <ModalContent>
          <ModalHeader style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <FolderPlus className={styles.fileIconSmall} />
            <span>New Folder</span>
          </ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                Enter a name for your folder:
              </p>
              <Input
                type="text"
                label="Folder Name"
                placeholder="My Images"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="default"
              onClick={() => setFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCreateFolder}
              isLoading={creatingFolder}
              isDisabled={!folderName.trim()}
              endContent={!creatingFolder && <ArrowRight className={styles.fileIconSmall} />}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      {/* Create Folder Modal */}
<Modal
  isOpen={folderModalOpen}
  onOpenChange={setFolderModalOpen}
  backdrop="blur"
  placement="center" // This is the key prop for centering
  classNames={{
    backdrop: styles.modalOverlay,
    wrapper: styles.modalWrapper,
    base: "max-w-[420px]",
  }}
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FolderPlus className={styles.fileIconSmall} />
            <span>New Folder</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-default-500">
              Enter a name for your folder:
            </p>
            <Input
              autoFocus
              label="Folder Name"
              placeholder="My Images"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleCreateFolder}
            isLoading={creatingFolder}
            isDisabled={!folderName.trim()}
            endContent={!creatingFolder && <ArrowRight size={18} />}
          >
            Create
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>
    </div>
  );
}