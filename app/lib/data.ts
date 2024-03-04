"use server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export async function getDataFromS3() {
    const s3Client = new S3Client({region: "us-west-2"});
    const command = new GetObjectCommand({
        Bucket: "gva-data-bucket",
        Key: "movement_wbounds.parquet",
    });

    try {
        const { Body } = await s3Client.send(command);
        if (Body) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error fetching data from S3:", error);
        return { success: false, error };
    }
}
