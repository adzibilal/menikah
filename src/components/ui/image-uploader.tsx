'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
    defaultImage?: string;
    className?: string;
}

export function ImageUploader({
    onUploadComplete,
    defaultImage,
    className,
}: ImageUploaderProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            setPreview(defaultImage || null);
        }
    }, [defaultImage, isMounted]);

    const uploadToCloudinary = async (file: File) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'wedding_images'); // Create this preset in your Cloudinary dashboard

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dfzjkdczw/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                setPreview(data.secure_url);
                onUploadComplete(data.secure_url);
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            
            // Upload to Cloudinary
            uploadToCloudinary(file);
            
            // Cleanup
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
        },
        multiple: false,
    });

    if (!isMounted) {
        return null;
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition-colors min-h-[200px] flex flex-col items-center justify-center',
                isDragActive && 'border-primary bg-primary/10',
                className
            )}
        >
            <input {...getInputProps()} />
            
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <LoadingSpinner />
                </div>
            )}

            {preview ? (
                <div className="relative w-full h-full min-h-[200px]">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 300px"
                        priority
                    />
                    <div className="absolute inset-0 hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                        <p className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm">
                            Click or drag to change image
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                    <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                        {isDragActive
                            ? 'Drop the image here'
                            : 'Drag and drop an image, or click to select'}
                    </p>
                </div>
            )}
        </div>
    );
}
