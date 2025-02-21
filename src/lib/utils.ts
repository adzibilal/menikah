import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseAlredyExist(error: string) {
    const [key, value] = error.match(/\(([^)]+)\)/g) || [];
    if (key && value) {
        return `User with ${key.replace(/[()]/g, '')} "${value.replace(/[()]/g, '')}" already exists.`;
    }
    return error;
}