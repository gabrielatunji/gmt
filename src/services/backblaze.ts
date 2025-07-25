import B2 from 'backblaze-b2';

// Initialize B2 with your account ID and application key
const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APPLICATION_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_APPLICATION_KEY!,
});

interface UploadFilePayload {
  bucketId: string;
  fileName: string;
  fileData: Buffer; // or Stream, depending on your needs
  contentType: string; // e.g., 'image/jpeg', 'application/pdf'
}

interface GetUploadUrlResponse {
  bucketId: string;
  uploadUrl: string;
  authorizationToken: string;
}

// Function to get the upload URL and authorization token
const getUploadUrl = async (bucketId: string): Promise<GetUploadUrlResponse> => {
  try {
    await b2.authorize();

    const uploadAuth = await b2.getUploadUrl({
      bucketId: bucketId,
    });

    return {
      bucketId: bucketId,
      uploadUrl: uploadAuth.data.uploadUrl,
      authorizationToken: uploadAuth.data.authorizationToken,
    };
  } catch (error) {
    console.error("Error getting upload URL:", error);
    throw new Error("Failed to get upload URL");
  }
};


// Function to upload a file to Backblaze B2
export const uploadFile = async (payload: UploadFilePayload) => {
  try {
    const { bucketId, fileName, fileData, contentType } = payload;

    const uploadUrlData = await getUploadUrl(bucketId);

    await b2.uploadFile({
      uploadUrl: uploadUrlData.uploadUrl,
      uploadAuthToken: uploadUrlData.authorizationToken,
      fileName: fileName,
      mime: contentType,
      data: fileData, // Pass the file data (Buffer or Stream)
    });

    console.log(`File "${fileName}" uploaded successfully to bucket "${bucketId}"`);

  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

interface DownloadFilePayload {
    bucketName: string;
    fileName: string;
}

// Function to download a file from Backblaze B2
export const downloadFile = async (payload: DownloadFilePayload): Promise<Buffer> => {
    try {
        await b2.authorize();

        // Get the file info
        const fileInfoResponse = await b2.getFileInfo({
            fileId: payload.fileName,
        });

        const response = await b2.downloadFileByName({
            bucketName: payload.bucketName,
            fileName: payload.fileName,
            responseType: 'json'
        });
        if (response.status !== 200) {
            throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
        }

        return Buffer.from(response.data);
    } catch (error) {
        console.error("Error downloading file:", error);
        throw new Error("Failed to download file");
    }
};