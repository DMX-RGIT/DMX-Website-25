import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripMarkdown(md: string = ""): string {
  if (!md) return "";
  return md
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove images ![alt](url)
    .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
    // Replace links [text](url) with text
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove headers (# Header)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove blockquotes (> quote)
    .replace(/^\s*>\s+/gm, "")
    // Remove bold and italic (***text***, **text**, *text*, ___text___, __text__, _text_)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove strikethrough (~~text~~)
    .replace(/~~(.*?)~~/g, "$1")
    // Remove inline code (`code`)
    .replace(/`([^`]+)`/g, "$1")
    // Remove list markers (- item, * item, 1. item)
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    // Remove horizontal rules
    .replace(/^(?:---|\*\*\*|___)\s*$/gm, "")
    // Normalize newlines to spaces
    .replace(/\n+/g, " ")
    // Collapse multiple spaces
    .replace(/\s{2,}/g, " ")
    .trim();
}

