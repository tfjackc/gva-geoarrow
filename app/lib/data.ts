// "use server";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
//
// export async function getDataFromS3() {
//     const s3Client = new S3Client({region: "us-west-2"});
//     const command = new GetObjectCommand({
//         Bucket: "gva-data-bucket",
//         Key: "month-arrow/movement_wbounds_1.feather",
//     });
//
//     try {
//         const { Body } = await s3Client.send(command);
//         if (Body) {
//             return { success: true };
//         } else {
//             return { success: false };
//         }
//     } catch (error) {
//         console.error("Error fetching data from S3:", error);
//         return { success: false, error };
//     }
// }
"use server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { tableFromIPC } from 'apache-arrow';
import stream from 'stream';

export async function getDataFromS3() {
    const s3Client = new S3Client({ region: "us-west-2" });
    const command = new GetObjectCommand({
        Bucket: "gva-data-bucket",
        Key: "month-arrow/movement_wbounds_1.feather",
    });

    try {
        const { Body } = await s3Client.send(command);
        if (Body) {
            //@ts-ignore
            const arrowStream = Body instanceof stream.Readable ? Body : stream.Readable.from(Body);
            const table = await tableFromIPC(arrowStream);
            //const serializedData = table.toArray().map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Float32Array || value instanceof Int32Array ? Array.from(value) : value])));
            //console.table(serializedData);
            return { success: true, data: table };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error fetching data from S3:", error);
        return { success: false, error };
    }
}
