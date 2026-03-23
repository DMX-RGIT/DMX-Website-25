'use client';

import { motion, type Variants } from 'framer-motion';
import { Brain, Code, Users, Trophy, Lightbulb, Rocket, Target, Zap } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const activities = [
  {
    icon: Brain,
    title: 'Hackathons',
    description: 'Intensive coding marathons where students build innovative AI/ML solutions in 24 hours.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  },
  {
    icon: Code,
    title: 'Workshops',
    description: 'Hands-on technical workshops covering machine learning, deep learning, NLP, and more.',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
  {
    icon: Users,
    title: 'Speaker Sessions',
    description: 'Industry experts and alumni share insights on AI trends and career opportunities.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: Rocket,
    title: 'Projects',
    description: 'Collaborative projects where members work on real-world AI applications and research.',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
];

const stats = [
  { value: '400+', label: 'Participants', icon: Users },
  { value: '10+', label: 'Events Held', icon: Trophy },
  { value: '25+', label: 'Team Members', icon: Target },
  { value: '5+', label: 'Projects', icon: Lightbulb },
];

export default function AboutPage() {
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
          .metamask-page { padding: 1.5rem; }
        }

        @media (min-width: 1024px) {
          .metamask-page { padding: 2rem; }
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.9);
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

        @media (min-width: 640px) {
          .glass-container { padding: 2rem; border-radius: 28px; margin-bottom: 2.5rem; }
        }

        @media (min-width: 1024px) {
          .glass-container { padding: 2.5rem; border-radius: 32px; margin-bottom: 3rem; }
        }

        .glass-container:hover {
          transform: translateY(-8px);
          box-shadow:
            0 32px 64px rgba(139, 92, 246, 0.2),
            0 16px 48px rgba(255, 107, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .glass-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, #8b5cf6, #06d6a0, #ff6b35, #ffd60a, #8b5cf6);
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

        @media (min-width: 640px) {
          .page-title { font-size: 4rem; margin-bottom: 2.5rem; }
        }

        @media (min-width: 1024px) {
          .page-title { font-size: 5rem; margin-bottom: 3rem; }
        }

        .section-title {
          color: #6b21a8;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .section-title { font-size: 1.2rem; margin-bottom: 1.75rem; }
        }

        @media (min-width: 1024px) {
          .section-title { font-size: 1.3rem; margin-bottom: 2rem; }
        }

        .about-description {
          color: #4b5563;
          font-size: 1.05rem;
          line-height: 1.8;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .about-description { font-size: 1.1rem; }
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .activity-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        }

        .activity-card {
          background: rgba(255, 255, 255, 0.85);
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid rgba(139, 92, 246, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .activity-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .activity-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .activity-card h3 {
          color: #1f2937;
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .activity-card p {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        }

        .stat-card {
          text-align: center;
          padding: 1.5rem 1rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          border: 1px solid rgba(139, 92, 246, 0.12);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.25);
        }

        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          margin: 0 auto 0.75rem;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 768px) {
          .mission-grid { grid-template-columns: 1fr 1fr; }
        }

        .mission-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          border: 1px solid rgba(139, 92, 246, 0.12);
          transition: all 0.3s ease;
        }

        .mission-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .mission-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #5b21b6;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mission-card p {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.7;
        }
      `}</style>

      {/* Floating Shapes */}
      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Page Title */}
        <h1 className="page-title">
          About Us
        </h1>

        {/* Who We Are */}
        <div className="glass-container">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-description">
            <strong>DataMatrix (DMX)</strong> is the official AI & Machine Learning committee of{' '}
            <strong>MCT&apos;s Rajiv Gandhi Institute of Technology (RGIT), Mumbai</strong>. Founded with
            a passion for technology and innovation, we are a vibrant community of students dedicated
            to exploring the frontiers of artificial intelligence, machine learning, data science,
            and cutting-edge tech.
          </p>
          <br />
          <p className="about-description">
            From organizing large-scale hackathons like <strong>Hack2Infinity</strong> to conducting
            hands-on workshops and speaker sessions, DMX is the go-to platform for students who want
            to learn, build, and innovate in the world of AI/ML. We believe in learning by doing—and
            we make sure every event is an unforgettable experience.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="glass-container">
          <h2 className="section-title">Our Mission &amp; Vision</h2>
          <div className="mission-grid">
            <motion.div className="mission-card" whileHover={{ scale: 1.02 }}>
              <h3><Target size={22} color="#8b5cf6" /> Our Mission</h3>
              <p>
                To empower students with practical AI/ML knowledge through immersive hackathons,
                workshops, and collaborative projects—bridging the gap between theoretical learning
                and real-world application.
              </p>
            </motion.div>
            <motion.div className="mission-card" whileHover={{ scale: 1.02 }}>
              <h3><Zap size={22} color="#f59e0b" /> Our Vision</h3>
              <p>
                To build a thriving ecosystem of student innovators at RGIT who are equipped to solve
                tomorrow&apos;s problems using artificial intelligence and become leaders in the
                global tech community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* What We Do */}
        <div className="glass-container">
          <h2 className="section-title">What We Do</h2>
          <div className="activity-grid">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                className="activity-card"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
              >
                <div
                  className="activity-icon-wrap"
                  style={{ background: activity.gradient }}
                >
                  <activity.icon size={28} color="#fff" />
                </div>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="glass-container">
          <h2 className="section-title">DMX By The Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-icon-wrap">
                  <stat.icon size={24} color="#8b5cf6" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
