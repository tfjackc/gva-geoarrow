"use client";
import {getDataFromS3} from "@/app/lib/data";

export default function GetData() {

    async function buttonClick() {
        console.log("Get Data...")
        const start = new Date().getTime()
        const data = await getDataFromS3()
        const end = new Date().getTime()
        if (data.success) {
            console.log("Data fetched successfully")
            // Assuming 'data' returned is an object with 'data' property being the actual content.
           // console.table(data.data);
        } else {
            console.error("Error fetching data from S3:", data.error)
        }
        console.log(`Data fetched in ${end - start}ms`)
    }
    return (
        <main>
            <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex py-5">
                <button className="text-3xl text-white bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-300" onClick={buttonClick}>Get Data</button>
            </div>
        </main>
    );
}
