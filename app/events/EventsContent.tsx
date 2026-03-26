'use client';

import { EventCard } from '@/components/events/event-card';
import { Event } from '@/types';

interface EventsContentProps {
  events: Event[];
}

export default function EventsContent({ events }: EventsContentProps) {
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

        @media (max-width: 767px) {
          .metamask-page::before,
          .metamask-page::after,
          .floating-shape-1,
          .floating-shape-2 {
            display: none;
          }
        }

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

        .hero {
          max-width: 80rem;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow:
            0 20px 40px rgba(139, 92, 246, 0.1),
            0 8px 32px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        @media (min-width: 640px) {
          .glass-container {
            padding: 2rem;
            border-radius: 28px;
          }
        }

        .page-title {
          text-align: center;
          margin-bottom: 0.25rem;
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #8b5cf6, #5b21b6, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #5b21b6;
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .subtitle {
          text-align: center;
          color: #6b7280;
          max-width: 56rem;
          margin: 0 auto;
          font-size: 1.02rem;
        }

        @media (min-width: 640px) {
          .page-title {
            font-size: 4rem;
          }
        }

        @media (min-width: 1024px) {
          .page-title {
            font-size: 5rem;
          }
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
      `}</style>

      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      <div className="hero">
        <h1 className="page-title">Events</h1>
        <p className="subtitle">
          Browse all past DMX events in one place, ordered from newest to oldest.
        </p>

        <div className="glass-container mt-8">
          <h2 className="section-title">Past Events</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No past events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}