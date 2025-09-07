'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Speaker {
  id: number;
  name: string;
  title: string;
  image: string;
}

interface SpeakerCarouselProps {
  speakers: Speaker[];
  className?: string;
}

export function SpeakerCarousel({ speakers, className = "" }: SpeakerCarouselProps) {
  const [selectedSpeaker, setSelectedSpeaker] = useState(18); // Default to speaker 18 like in the original

  return (
    <div className={`speaker-carousel-container ${className}`}>
      <style jsx>{`
        .speaker-carousel-container {
          padding: 4rem 0;
          display: grid;
          place-items: center;
          min-height: 100vh;
          font-family: 'Google Sans', sans-serif, system-ui;
        }

        .speaker-carousel {
          --transition: 0.5s;
          --container-width: clamp(300px, 80vw, 960px);
          --brand-hue: 230;
          --size-1: calc(var(--container-width) * 0.48);
          --size-2: 0.10;
          --size-3: calc(var(--container-width) * 0.04);
          
          aspect-ratio: 16 / 9;
          width: var(--container-width);
          overflow: hidden;
          display: flex;
          gap: 0.5rem;
          padding: 0;
          margin: 0;
          position: relative;
          list-style-type: none;
          justify-content: center;
        }

        .speaker-item {
          border-radius: 1rem;
          transition: all var(--transition) ease;
          position: relative;
          clip-path: inset(0 0 0 0);
          z-index: 1;
          overflow: hidden;
          width: 0;
          position: absolute;
          flex-shrink: 1;
        }

        .speaker-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .speaker-label {
          cursor: pointer;
          display: block;
          height: 100%;
          width: 100%;
        }

        /* Visibility logic for adjacent items */
        ${speakers.map((_, index) => {
          const speakerId = index + 1;
          const isVisible = Math.abs(speakerId - selectedSpeaker) <= 4;
          const isActive = speakerId === selectedSpeaker;
          const isAdjacent = Math.abs(speakerId - selectedSpeaker) <= 3 && Math.abs(speakerId - selectedSpeaker) > 0;
          
          if (isActive) {
            return `
              .speaker-item:nth-child(${speakerId}) {
                --active: 1;
                --content: 1;
                --width: var(--size-1);
                width: var(--width);
                z-index: 3;
                flex: 1 0 var(--size-1);
                position: static;
              }
            `;
          } else if (isVisible && isAdjacent) {
            return `
              .speaker-item:nth-child(${speakerId}) {
                --content: 1;
                --width: calc(var(--container-width) * (var(--size-2) + (var(--hover, 0) * (var(--size-2) * 1.5))));
                width: var(--width);
                z-index: 2;
                translate: 0 0;
                position: static;
              }
            `;
          } else if (isVisible) {
            return `
              .speaker-item:nth-child(${speakerId}) {
                width: var(--size-3);
                position: static;
              }
            `;
          } else {
            return `
              .speaker-item:nth-child(${speakerId}) {
                width: 0;
                position: static;
              }
            `;
          }
        }).join('')}

        .speaker-item:hover {
          --hover: 1;
        }

        .slide-wrapper {
          display: block;
          position: relative;
          height: 100%;
          width: 100%;
          transition: background var(--transition) ease;
          background: radial-gradient(circle at center, hsl(var(--brand-hue, 210) 80% 70% / calc(var(--active, 0) * 0.75)), transparent 75%),
                      hsl(0 0% calc((66 + (var(--active, 0) * 12)) * 1%));
        }

        .speaker {
          position: absolute;
          inset: 0;
        }

        .speaker-info {
          position: absolute;
          left: 1.5rem;
          top: 1.5rem;
          display: grid;
          gap: 0.5rem;
          width: var(--size-1);
          max-width: calc(var(--size-1) - 3rem);
          opacity: var(--active, 0);
          transition: opacity var(--transition) ease-out;
        }

        .speaker-image {
          position: relative;
        }

        .speaker-image::after {
          content: "";
          position: absolute;
          inset: 0;
          transition: opacity var(--transition) ease;
          opacity: var(--active, 0);
          background: radial-gradient(circle at 35% 0%, hsl(0 0% 100% / 0.65) 25%, hsl(var(--brand-hue) 80% 80% / 0.35) 50% 75%, hsl(0 0% 100% / 0.25));
        }

        .speaker-title {
          text-transform: uppercase;
          font-weight: bold;
          color: hsl(var(--brand-hue) 80% 70%);
          background: linear-gradient(65deg, hsl(var(--brand-hue) 80% 80%), hsl(var(--brand-hue) 80% 70%));
          background-clip: text;
          color: transparent;
          font-size: 0.875rem;
          font-family: sans-serif;
        }

        .speaker-name {
          font-size: 1.75rem;
          font-family: sans-serif;
          color: white;
        }

        .slide-content {
          transition: width var(--transition) ease;
          opacity: var(--content, 0);
          position: absolute;
          top: 50%;
          left: 50%;
          height: 100%;
          width: var(--size-1);
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%);
          transition: opacity var(--transition) ease;
        }

        .speaker-img {
          position: absolute;
          bottom: 0;
          left: 50%;
          translate: -50% 0%;
          height: var(--size-1);
          width: var(--size-1);
          scale: calc(1 + (var(--active, 0) * 0.25));
          transform-origin: 50% 25%;
          object-fit: cover;
          transition: filter var(--transition) ease, width var(--transition) ease, scale var(--transition) ease;
          filter: grayscale(calc(2 - var(--active, 0)));
        }
      `}</style>

      <ul className="speaker-carousel">
        {speakers.map((speaker, index) => {
          const speakerId = index + 1;
          const isChecked = speakerId === selectedSpeaker;
          
          return (
            <li key={speaker.id} className="speaker-item">
              <span className="sr-only"></span>
              <label 
                className="speaker-label"
                htmlFor={`speaker--${speakerId}`}
                aria-hidden="true"
              >
                <input
                  type="radio"
                  className="speaker-input"
                  name="speakers"
                  id={`speaker--${speakerId}`}
                  checked={isChecked}
                  onChange={() => setSelectedSpeaker(speakerId)}
                  aria-hidden="true"
                />
                <span className="slide-wrapper">
                  <span className="slide-content">
                    <span className="speaker">
                      <span className="speaker-image">
                        <Image
                          src={speaker.image}
                          alt=""
                          width={720}
                          height={720}
                          className="speaker-img"
                        />
                      </span>
                      <span className="speaker-info">
                        <span className="speaker-title">{speaker.title}</span>
                        <span className="speaker-name">{speaker.name}</span>
                      </span>
                    </span>
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
