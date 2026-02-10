import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const videoFile = formData.get('video') as File;
        const videoAspectRatio = formData.get('videoAspectRatio') as string;

        if (!videoFile) {
            return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
        }

        // Convert File to buffer
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Calculate dimensions based on aspect ratio
        let width: number;
        const height = 1920;

        switch (videoAspectRatio) {
            case "9:16":
                width = 1080;
                break;
            case "4:5":
                width = 1536;
                break;
            case "1:1":
                width = 1920;
                break;
            default:
                width = 1080;
        }

        const videoSectionHeight = Math.floor(height * 0.8); // Video is 80% of canvas
        const captionHeight = height - videoSectionHeight;   // Caption is 20%

        console.log(`Processing video: ${width}x${height}, video section: ${videoSectionHeight}px`);

        // Upload to Cloudinary with transformations
        const uploadResponse = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'branded-videos',
                    // Auto-delete after 1 day
                    expires_at: Math.floor(Date.now() / 1000) + 86400,
                    transformation: [
                        // Step 1: Resize video to fit video section, preserve audio
                        {
                            width: width,
                            height: videoSectionHeight,
                            crop: 'fill',
                            gravity: 'center',
                            quality: 'auto:good',
                            video_codec: 'h264',
                            audio_codec: 'aac', // Preserve audio
                        },
                        // Step 2: Add black padding at top for caption area
                        {
                            width: width,
                            height: height,
                            background: 'black',
                            crop: 'pad',
                            gravity: 'south', // Video at bottom, padding at top
                            audio_codec: 'aac', // Preserve audio through padding
                        },
                        // Step 3: Add watermark overlay
                        {
                            overlay: `text:Arial_${Math.round(11 * (width / 432))}_bold:www.1010web.studio`,
                            color: 'white',
                            gravity: 'north_east',
                            x: Math.round(18 * (width / 432)),
                            y: Math.round(captionHeight + 18 * (width / 432)),
                        },
                    ],
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        console.log('Video processed successfully:', uploadResponse.secure_url);
        console.log('Video info:', {
            format: uploadResponse.format,
            audio: uploadResponse.audio,
            duration: uploadResponse.duration,
            resource_type: uploadResponse.resource_type
        });

        return NextResponse.json({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        });

    } catch (error) {
        console.error('Video processing error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process video',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
