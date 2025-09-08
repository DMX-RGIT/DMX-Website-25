'use client';

import { ImageGallery } from '@/components/events/image-gallery';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface EventDetailContentProps {
  title: string;
  date: string;
  venue?: string;
  description?: string;
  speakers?: string[];
  registrationLink?: string;
  htmlContent: string;
  galleryImages: string[];
}

export default function EventDetailContent({
  title,
  date,
  venue,
  description,
  speakers,
  registrationLink,
  htmlContent,
  galleryImages
}: EventDetailContentProps) {
  return (
    <div className="min-h-screen metamask-page">
      <style jsx>{`
        .metamask-page {
          background: linear-gradient(135deg, #fef7f4 0%, #fff5f0 50%, #f9f4ff 100%);
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Floating geometric shapes animation */
        .metamask-page::before {
          content: '';
          position: absolute;
          top: 10%;
          left: -5%;
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ff6b35, #f7931e);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float1 12s ease-in-out infinite;
          z-index: 1;
        }

        .metamask-page::after {
          content: '';
          position: absolute;
          top: 60%;
          right: -3%;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 50% 20% 50% 20%;
          animation: float2 15s ease-in-out infinite reverse;
          z-index: 1;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-180deg); }
        }

        /* Add more floating shapes */
        .floating-shape-1 {
          position: absolute;
          top: 30%;
          right: 10%;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #06d6a0, #118ab2);
          border-radius: 20px;
          animation: float3 10s ease-in-out infinite;
          z-index: 1;
          transform-origin: center;
        }

        .floating-shape-2 {
          position: absolute;
          bottom: 20%;
          left: 8%;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ffd60a, #ff8500);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: float4 14s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
        }

        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-35px) rotate(120deg); }
        }

        /* Mobile responsive: Hide floating shapes on small screens */
        @media (max-width: 767px) {
          .metamask-page::before,
          .metamask-page::after,
          .floating-shape-1,
          .floating-shape-2 {
            display: none;
          }
        }

        /* Mobile first responsive padding */
        @media (min-width: 640px) {
          .metamask-page {
            padding: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .metamask-page {
            padding: 2rem;
          }
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow:
            0 20px 40px rgba(139, 92, 246, 0.1),
            0 8px 32px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        /* Responsive design for larger screens */
        @media (min-width: 640px) {
          .glass-container {
            padding: 2rem;
            border-radius: 28px;
            margin-bottom: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .glass-container {
            padding: 2.5rem;
            border-radius: 32px;
            margin-bottom: 3rem;
          }
        }

        .glass-container:hover {
          transform: translateY(-8px);
          box-shadow:
            0 32px 64px rgba(139, 92, 246, 0.2),
            0 16px 48px rgba(255, 107, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.4);
        }

        /* Animated gradient border effect */
        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg,
            #8b5cf6, #06d6a0, #ff6b35, #ffd60a, #8b5cf6);
          background-size: 300% 300%;
          animation: gradientShift 6s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glass-container:hover::before {
          opacity: 1;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .page-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #8b5cf6, #5b21b6, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #5b21b6;
          line-height: 0.9;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
          animation: titlePulse 4s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Responsive title sizing */
        @media (min-width: 640px) {
          .page-title {
            font-size: 4rem;
            margin-bottom: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .page-title {
            font-size: 5rem;
            margin-bottom: 3rem;
          }
        }

        .event-description {
          color: #374151;
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 2rem;
          text-align: center;
        }

        .event-meta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .event-content {
          color: #111827;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .event-content h1,
        .event-content h2,
        .event-content h3 {
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .event-content p {
          margin-bottom: 1rem;
          color: #374151;
        }

        .event-content code {
          background: rgba(139, 92, 246, 0.1);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #7c3aed;
        }

        .speakers-section {
          margin-bottom: 2rem;
        }

        .speakers-title {
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .speakers-list {
          color: #374151;
          list-style: none;
          padding: 0;
        }

        .speakers-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .speakers-list li:last-child {
          border-bottom: none;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
        }

        .gallery-section {
          margin-top: 3rem;
        }
      `}</style>

      {/* Floating Shapes */}
      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      {/* Page Title */}
      <h1 className="page-title">
        {title}
      </h1>

      {/* Event Content */}
      <div className="glass-container">
        <div className="max-w-4xl mx-auto">
          {description && (
            <p className="event-description">{description}</p>
          )}

          <div className="event-meta">
            <div className="meta-item">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
            {venue && (
              <div className="meta-item">
                <MapPin className="w-4 h-4" />
                {venue}
              </div>
            )}
          </div>

          <div className="event-content prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          {speakers && speakers.length > 0 && (
            <div className="speakers-section">
              <h3 className="speakers-title">Speakers</h3>
              <ul className="speakers-list">
                {speakers.map((speaker: string, index: number) => (
                  <li key={index}>{speaker}</li>
                ))}
              </ul>
            </div>
          )}

          {registrationLink && (
            <div className="action-buttons">
              <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink className="w-5 h-5" />
                Register for Event
              </a>
            </div>
          )}

          {galleryImages && galleryImages.length > 0 && (
            <div className="gallery-section">
              <ImageGallery images={galleryImages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
