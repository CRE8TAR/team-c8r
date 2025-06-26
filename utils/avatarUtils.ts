// app/api/news-anchor/utils.js (or .ts)
import {put} from '@vercel/blob';
import fetch from 'node-fetch'; // Required for fetching blob contents

// Upload buffer or file to Vercel Blob
export const uploadAudioToVercelBlob = async (fileBuffer: Buffer, filename: string) => {
    try {
        const blob = await put(`audios/${filename}`, fileBuffer, {
            access: 'public', // or 'private' based on your needs
        });

        return blob.url; // You can store or return this URL
    } catch (error) {
        console.error("Error uploading to Vercel Blob:", error);
        throw error;
    }
};

// Convert a Vercel Blob audio URL to base64
export const fetchAudioBlobToBase64 = async (blobUrl: string) => {
    try {
        const response = await fetch(blobUrl);
        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer).toString("base64");
    } catch (error) {
        console.error(`Error fetching blob to base64 from ${blobUrl}:`, error);
        return null;
    }
};

// Read JSON transcript from a blob (if needed)
export const fetchJsonTranscriptFromBlob = async (blobUrl: string) => {
    try {
        const response = await fetch(blobUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(`Error fetching JSON transcript from ${blobUrl}:`, error);
        return null;
    }
};
