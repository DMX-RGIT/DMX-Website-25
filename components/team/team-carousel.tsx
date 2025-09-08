"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Speaker {
  id: number;
  name: string;
  title: string;
  image: string;
}

interface TeamCarouselProps {
  speakers: Speaker[];
  className?: string;
}

export function TeamCarousel({ speakers, className = "" }: TeamCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const normalizedIndex = (newIndex + speakers.length) % speakers.length;
    setCurrentIndex(normalizedIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getCardClass = (index: number) => {
    const offset = (index - currentIndex + speakers.length) % speakers.length;

    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === 2) return "right-2";
    if (offset === speakers.length - 1) return "left-1";
    if (offset === speakers.length - 2) return "left-2";
    return "hidden";
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        updateCarousel(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        updateCarousel(currentIndex + 1);
      }
    },
    ["currentIndex", "updateCarousel"]
  );

  // Touch handlers for swipe functionality
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      updateCarousel(currentIndex + 1); // Swipe left = next
    } else if (isRightSwipe) {
      updateCarousel(currentIndex - 1); // Swipe right = previous
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, handleKeyDown]);

  return (
    <div className={`team-carousel-wrapper ${className}`}>
      <style jsx>{`
        .team-carousel-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          padding: 0; /* Removed Y padding */
          position: relative;
        }

        /* Responsive padding - removed for desktop */
        @media (min-width: 640px) {
          .team-carousel-wrapper {
            padding: 0; /* No padding */
          }
        }

        @media (min-width: 1024px) {
          .team-carousel-wrapper {
            padding: 0; /* No padding for desktop */
          }
        }

        .about-title {
          display: none;
        }

        .carousel-container {
          width: 100%;
          max-width: 100%; /* Mobile first - full width */
          height: 300px; /* Mobile first - smaller height */
          position: relative;
          perspective: 1000px;
          margin-top: 40px; /* Mobile first - smaller margin */
        }

        /* Responsive carousel sizing - bigger for desktop cards */
        @media (min-width: 640px) {
          .carousel-container {
            height: 400px;
            margin-top: 40px;
            max-width: 900px;
          }
        }

        @media (min-width: 1024px) {
          .carousel-container {
            height: 520px; /* Much bigger to accommodate larger cards */
            margin-top: 50px;
            max-width: 1200px; /* Bigger max-width for larger cards */
          }
        }

        .carousel-track {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          transform-style: preserve-3d;
        }

        .card {
          position: absolute;
          width: 200px; /* Mobile first - smaller cards */
          height: 260px; /* Mobile first - smaller cards */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(248, 250, 252, 0.9)
          ); /* Light MetaMask-inspired background */
          border: 2px solid rgba(111, 66, 193, 0.2); /* Subtle purple border */
          border-radius: 16px; /* Mobile first - smaller radius */
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(111, 66, 193, 0.1),
            0 5px 15px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          left: 50%;
          top: 50%;
          transform-origin: center center;
          backdrop-filter: blur(10px);
        }

        /* Responsive card sizing */
        @media (min-width: 640px) {
          .card {
            width: 280px;
            height: 360px;
            border-radius: 18px;
          }
        }

        @media (min-width: 1024px) {
          .card {
            width: 350px; /* Much bigger for desktop */
            height: 450px; /* Much bigger for desktop */
            border-radius: 20px;
          }
        }

        .card:hover {
          border-color: rgba(246, 133, 27, 0.4); /* MetaMask orange on hover */
          box-shadow: 0 15px 40px rgba(246, 133, 27, 0.2),
            0 8px 20px rgba(111, 66, 193, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform: translateY(-5px);
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: grayscale(100%); /* Default: all images are grayscale */
        }

        .card:hover img {
          filter: grayscale(0%); /* Remove grayscale on hover */
        }

        .card.center {
          z-index: 10;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .card.center img {
          filter: none; /* Only center image is in full color */
        }

        .card.left-2 {
          z-index: 1;
          transform: translate(-50%, -50%) translateX(-250px) scale(0.7)
            translateZ(-300px); /* Mobile first - smaller transforms */
          opacity: 0.6;
        }

        /* Responsive left-2 positioning */
        @media (min-width: 640px) {
          .card.left-2 {
            transform: translate(-50%, -50%) translateX(-320px) scale(0.75)
              translateZ(-300px);
            opacity: 0.65;
          }
        }

        @media (min-width: 1024px) {
          .card.left-2 {
            transform: translate(-50%, -50%) translateX(-500px) scale(0.8)
              translateZ(-300px); /* Adjusted for bigger cards */
            opacity: 0.7;
          }
        }

        .card.left-2 img {
          filter: grayscale(100%);
        }

        .card.left-1 {
          z-index: 5;
          transform: translate(-50%, -50%) translateX(-120px) scale(0.85)
            translateZ(-100px); /* Mobile first - smaller transforms */
          opacity: 0.85;
        }

        /* Responsive left-1 positioning */
        @media (min-width: 640px) {
          .card.left-1 {
            transform: translate(-50%, -50%) translateX(-160px) scale(0.88)
              translateZ(-100px);
            opacity: 0.88;
          }
        }

        @media (min-width: 1024px) {
          .card.left-1 {
            transform: translate(-50%, -50%) translateX(-250px) scale(0.9)
              translateZ(-100px); /* Adjusted for bigger cards */
            opacity: 0.9;
          }
        }

        .card.left-1 img {
          filter: grayscale(100%);
        }

        .card.right-1 {
          z-index: 5;
          transform: translate(-50%, -50%) translateX(120px) scale(0.85)
            translateZ(-100px); /* Mobile first - smaller transforms */
          opacity: 0.85;
        }

        /* Responsive right-1 positioning */
        @media (min-width: 640px) {
          .card.right-1 {
            transform: translate(-50%, -50%) translateX(160px) scale(0.88)
              translateZ(-100px);
            opacity: 0.88;
          }
        }

        @media (min-width: 1024px) {
          .card.right-1 {
            transform: translate(-50%, -50%) translateX(250px) scale(0.9)
              translateZ(-100px); /* Adjusted for bigger cards */
            opacity: 0.9;
          }
        }

        .card.right-1 img {
          filter: grayscale(100%);
        }

        .card.right-2 {
          z-index: 1;
          transform: translate(-50%, -50%) translateX(250px) scale(0.7)
            translateZ(-300px); /* Mobile first - smaller transforms */
          opacity: 0.6;
        }

        /* Responsive right-2 positioning */
        @media (min-width: 640px) {
          .card.right-2 {
            transform: translate(-50%, -50%) translateX(320px) scale(0.75)
              translateZ(-300px);
            opacity: 0.65;
          }
        }

        @media (min-width: 1024px) {
          .card.right-2 {
            transform: translate(-50%, -50%) translateX(500px) scale(0.8)
              translateZ(-300px); /* Adjusted for bigger cards */
            opacity: 0.7;
          }
        }

        .card.right-2 img {
          filter: grayscale(100%);
        }

        .card.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .member-info {
          text-align: center;
          margin-top: 30px; /* Reduced margin for tighter layout */
          transition: all 0.5s ease-out;
        }

        .member-name {
          color: #24292e;
          font-size: 2rem;
          font-weight: 800; /* MetaMask bold style */
          font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
            sans-serif;
          margin-bottom: 10px;
          position: relative;
          display: inline-block;
          opacity: 1;
          transition: opacity 0.3s ease;
          letter-spacing: -0.02em; /* Tight spacing like MetaMask */
        }

        .member-name::before,
        .member-name::after {
          content: "";
          position: absolute;
          top: 100%;
          width: 60px;
          height: 2px; /* Slightly thicker for MetaMask boldness */
          background: linear-gradient(
            90deg,
            transparent,
            #f6851b 20%,
            #f6851b 80%,
            transparent
          ); /* MetaMask orange */
        }

        .member-name::before {
          left: -80px;
        }

        .member-name::after {
          right: -80px;
        }

        .member-role {
          color: #6f42c1; /* MetaMask purple accent */
          font-size: 1.1rem;
          font-weight: 600; /* Bolder like MetaMask */
          font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
            sans-serif;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.08em; /* Wider spacing for emphasis */
          padding: 10px 0;
          margin-top: -5px;
          position: relative;
          transition: opacity 0.3s ease;
        }

        .dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 40px; /* Reduced margin for tighter layout */
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(111, 66, 193, 0.2); /* MetaMask purple */
          border: 1px solid rgba(111, 66, 193, 0.4); /* MetaMask purple border */
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: rgba(246, 133, 27, 0.8); /* MetaMask orange for active */
          border-color: #f6851b; /* Orange border */
          box-shadow: 0 2px 8px rgba(246, 133, 27, 0.4),
            0 1px 4px rgba(246, 133, 27, 0.2);
          transform: scale(1.2);
        }

        .dot:hover {
          background: rgba(246, 133, 27, 0.4); /* Orange on hover */
          border-color: #f6851b; /* Orange border */
          box-shadow: 0 2px 6px rgba(246, 133, 27, 0.3);
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(248, 250, 252, 0.9)
          ); /* Light MetaMask background */
          border: 2px solid rgba(111, 66, 193, 0.3); /* Purple border */
          color: #6f42c1; /* MetaMask purple */
          width: 35px; /* Mobile first - smaller buttons */
          height: 35px; /* Mobile first - smaller buttons */
          border-radius: 12px; /* Rounded rectangle like MetaMask */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s ease;
          font-size: 1.2rem; /* Mobile first - smaller font */
          font-weight: 700; /* Bold like MetaMask */
          outline: none;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 15px rgba(111, 66, 193, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        /* Responsive nav arrow sizing */
        @media (min-width: 640px) {
          .nav-arrow {
            width: 38px;
            height: 38px;
            font-size: 1.3rem;
          }
        }

        @media (min-width: 1024px) {
          .nav-arrow {
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
          }
        }

        .nav-arrow:hover {
          background: linear-gradient(
            135deg,
            rgba(246, 133, 27, 0.1),
            rgba(246, 133, 27, 0.05)
          ); /* MetaMask orange hover */
          border-color: #f6851b; /* Orange border */
          color: #f6851b; /* Orange text */
          box-shadow: 0 6px 20px rgba(246, 133, 27, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform: translateY(-50%) scale(1.1);
        }

        .nav-arrow.left {
          left: 10px; /* Mobile first - closer to edge */
          padding-right: 3px;
        }

        .nav-arrow.right {
          right: 10px; /* Mobile first - closer to edge */
          padding-left: 3px;
        }

        /* Responsive arrow positioning */
        @media (min-width: 640px) {
          .nav-arrow.left {
            left: 15px;
          }
          .nav-arrow.right {
            right: 15px;
          }
        }

        @media (min-width: 1024px) {
          .nav-arrow.left {
            left: 20px;
          }
          .nav-arrow.right {
            right: 20px;
          }
        }

        /* Swipe indicator for mobile */
        .swipe-indicator {
          display: none;
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          color: #6f42c1;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
            sans-serif;
          letter-spacing: 0.05em;
          opacity: 0.7;
          animation: swipePulse 2s infinite;
        }

        @keyframes swipePulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        /* Touch-friendly features for mobile */
        @media (max-width: 767px) {
          .swipe-indicator {
            display: block;
          }

          .nav-arrow {
            display: none; /* Hide arrows on mobile, use swipe instead */
          }

          .carousel-track {
            touch-action: pan-x;
          }

          .card {
            cursor: default; /* Remove cursor on mobile */
          }

          .nav-arrow {
            /* Larger touch targets on mobile */
            width: 45px;
            height: 45px;
            font-size: 1.4rem;
          }

          /* Responsive typography for mobile */
          .member-name {
            font-size: 1.6rem;
            font-weight: 800;
          }

          .member-role {
            font-size: 0.95rem;
            letter-spacing: 0.06em;
          }

          .member-name::before,
          .member-name::after {
            width: 40px;
          }

          .member-name::before {
            left: -50px;
          }

          .member-name::after {
            right: -50px;
          }
        }

        /* Medium screen responsive */
        @media (min-width: 768px) and (max-width: 1023px) {
          .member-name {
            font-size: 1.8rem;
          }

          .member-role {
            font-size: 1rem;
          }
        }
      `}</style>

      <h1 className="about-title">OUR TEAM</h1>

      <div className="carousel-container">
        <button
          className="nav-arrow left"
          onClick={() => updateCarousel(currentIndex - 1)}
          aria-label="Previous member"
        >
          ‹
        </button>

        <div
          className="carousel-track"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {speakers.map((member, index) => (
            <div
              key={member.id}
              className={`card ${getCardClass(index)}`}
              onClick={() => updateCarousel(index)}
            >
              <Image
                src={member.image}
                alt={`${member.name} - ${member.title}`}
                width={350}
                height={450}
                className="member-image"
                priority={index === currentIndex}
              />
            </div>
          ))}
        </div>

        {/* Swipe indicator for mobile */}
        <div className="swipe-indicator">← swipe →</div>

        <button
          className="nav-arrow right"
          onClick={() => updateCarousel(currentIndex + 1)}
          aria-label="Next member"
        >
          ›
        </button>
      </div>

      <div className="member-info">
        <h2 className="member-name">{speakers[currentIndex]?.name}</h2>
        <p className="member-role">{speakers[currentIndex]?.title}</p>
      </div>

      <div className="dots">
        {speakers.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => updateCarousel(index)}
          />
        ))}
      </div>
    </div>
  );
}
