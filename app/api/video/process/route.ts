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

        console.log(`Processing video: Preserving original dimensions, no transformations`);

        // Upload to Cloudinary with NO transformations (watermark added on canvas)
        const uploadResponse = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'branded-videos',
                    // Auto-delete after 1 day
                    expires_at: Math.floor(Date.now() / 1000) + 86400,
                    transformation: [
                        // No transformations - preserve original video with audio
                        {
                            video_codec: 'h264',
                            audio_codec: 'aac',
                            quality: 'auto:best',
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
