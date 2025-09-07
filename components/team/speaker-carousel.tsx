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
  const [selectedSpeaker, setSelectedSpeaker] = useState(1); // Default to first speaker

  return (
    <div className={`speaker-carousel-container ${className}`}>
      <style jsx>{`
        .speaker-carousel-container {
          padding: 2rem 0;
          display: grid;
          place-items: center;
          min-height: 60vh;
          font-family: inherit;
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
          border: 1px solid rgba(0, 255, 170, 0.3);
          box-shadow: 
            0 0 20px rgba(0, 255, 170, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
        }

        .speaker-item:hover {
          border-color: rgba(0, 255, 170, 0.6);
          box-shadow: 
            0 0 30px rgba(0, 255, 170, 0.2),
            0 0 60px rgba(0, 255, 170, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
                --active: 0;
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
                --active: 0;
                width: var(--size-3);
                position: static;
              }
            `;
          } else {
            return `
              .speaker-item:nth-child(${speakerId}) {
                --active: 0;
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
          width: 100%;
          height: 100%;
          max-width: var(--size-1);
          max-height: var(--size-1);
          margin: 0 auto;
          aspect-ratio: 1/1;
        }

        .speaker-title {
          text-transform: uppercase;
          font-weight: bold;
          background: linear-gradient(65deg, #00ffaa, #00ffdd);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          font-size: 0.875rem;
          font-family: sans-serif;
          text-shadow: 0 0 10px rgba(0, 255, 170, 0.3);
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
          transform: translateX(-50%) scale(calc(1 + (var(--active, 0) * 0.25)));
          height: 100%;
          width: 100%;
          max-height: var(--size-1);
          max-width: var(--size-1);
          object-fit: cover;
          object-position: center top;
          border-radius: 50%;
          aspect-ratio: 1/1;
          transition: all var(--transition) ease;
          filter: grayscale(calc((1 - var(--active, 0)) * 100%)) brightness(calc(0.6 + (var(--active, 0) * 0.4)));
        }
      `}</style>

      <ul className="speaker-carousel">
        {speakers.map((speaker, index) => {
          const speakerId = index + 1;
          const isChecked = speakerId === selectedSpeaker;
          const isActive = speakerId === selectedSpeaker;
          
          return (
            <li 
              key={speaker.id} 
              className="speaker-item"
              style={{
                '--active': isActive ? 1 : 0,
                '--content': Math.abs(speakerId - selectedSpeaker) <= 3 ? 1 : 0,
                '--hover': 0
              } as React.CSSProperties}
            >
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
