"""
Seed the database with realistic sample data for DMX.
Run: python -m app.seed
"""
import asyncio
from datetime import datetime, timezone, timedelta

from app.database import engine, async_session, Base
from app.models import (
    Event, EventCategory,
    Project, ProjectDomain,
    TeamMember, TeamTier,
    GalleryImage, GalleryCategory,
    Sponsor, SponsorTier,
)


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # --- Events ---
        now = datetime.now(timezone.utc)

        events = [
            Event(
                title="Hack2Infinity 2026",
                description="36-hour AI/ML hackathon bringing together 500+ developers, researchers, and designers to build the future of intelligent systems. Cash prizes, mentorship from industry leaders, and recruitment opportunities.",
                category=EventCategory.hackathon,
                date=now + timedelta(days=45),
                end_date=now + timedelta(days=47),
                venue="RGIT Main Auditorium & CS Labs",
                registration_url="https://hack2infinity.dmxrgit.com",
                is_flagship=True,
                is_upcoming=True,
            ),
            Event(
                title="Deep Learning from Scratch",
                description="Build neural networks from numpy to PyTorch. Cover backpropagation, CNNs, RNNs, and attention mechanisms with hands-on coding exercises.",
                category=EventCategory.workshop,
                date=now + timedelta(days=14),
                venue="CS Lab 301, RGIT",
                registration_url="https://forms.google.com/dmx-dl",
                is_upcoming=True,
            ),
            Event(
                title="NLP in Production",
                description="Industry speaker session on deploying NLP models at scale. Covers tokenization pipelines, model serving, A/B testing, and monitoring in production environments.",
                category=EventCategory.speaker_session,
                date=now + timedelta(days=21),
                venue="Seminar Hall, RGIT",
                is_upcoming=True,
            ),
            Event(
                title="Computer Vision Bootcamp",
                description="Two-day intensive bootcamp covering image classification, object detection with YOLO, semantic segmentation, and real-time video processing.",
                category=EventCategory.workshop,
                date=now + timedelta(days=30),
                end_date=now + timedelta(days=31),
                venue="AI Lab, RGIT",
                is_upcoming=True,
            ),
            Event(
                title="GenAI Prompt Engineering Lab",
                description="Hands-on workshop on advanced prompting techniques, chain-of-thought reasoning, RAG pipelines, and building AI agents with LangChain.",
                category=EventCategory.workshop,
                date=now + timedelta(days=7),
                venue="CS Lab 204, RGIT",
                is_upcoming=True,
            ),
            Event(
                title="AI Ethics Panel Discussion",
                description="Panel with faculty and industry professionals on responsible AI development, bias in ML systems, and the societal impact of generative AI.",
                category=EventCategory.speaker_session,
                date=now - timedelta(days=30),
                venue="Auditorium, RGIT",
                is_upcoming=False,
            ),
            Event(
                title="Hack2Infinity 2025",
                description="Our flagship hackathon's previous edition. 400+ participants, 80+ projects submitted, partnerships with Google, Microsoft, and AWS.",
                category=EventCategory.hackathon,
                date=now - timedelta(days=365),
                end_date=now - timedelta(days=363),
                venue="RGIT Campus",
                is_flagship=True,
                is_upcoming=False,
            ),
            Event(
                title="Intro to Transformers",
                description="From attention is all you need to GPT-4. Understand the architecture that powers modern AI, with a hands-on implementation in PyTorch.",
                category=EventCategory.workshop,
                date=now - timedelta(days=60),
                venue="CS Lab 301, RGIT",
                is_upcoming=False,
            ),
            Event(
                title="Reinforcement Learning Workshop",
                description="Learn RL fundamentals through game-playing agents. Cover Q-learning, policy gradients, and PPO with OpenAI Gym environments.",
                category=EventCategory.workshop,
                date=now - timedelta(days=90),
                venue="CS Lab 204, RGIT",
                is_upcoming=False,
            ),
        ]
        db.add_all(events)

        # --- Projects ---
        projects = [
            Project(
                title="Autonomous Drone Navigation",
                description="Vision-based autonomous navigation system for indoor drones using depth estimation and SLAM.",
                long_description="A research project developing a vision-based autonomous navigation system for indoor drones. Uses monocular depth estimation with MiDaS, visual SLAM for mapping, and a custom path planning algorithm. The drone can navigate through unknown indoor environments, avoid obstacles, and reach specified waypoints without GPS.",
                domain=ProjectDomain.cv,
                tech_stack=["Python", "PyTorch", "OpenCV", "ROS2", "MiDaS", "ORB-SLAM3"],
                github_url="https://github.com/dmx-rgit/drone-nav",
                contributors=[
                    {"name": "Arjun Mehta", "role": "Lead"},
                    {"name": "Priya Sharma", "role": "CV Engineer"},
                    {"name": "Rohan Desai", "role": "Robotics"},
                ],
                is_featured=True,
            ),
            Project(
                title="Sentiment Analysis Engine",
                description="Real-time multilingual sentiment analysis API supporting Hindi, Marathi, and English text.",
                long_description="A production-grade sentiment analysis system that processes text in Hindi, Marathi, and English. Built on fine-tuned multilingual BERT (mBERT) with custom tokenization for code-mixed text. Includes a FastAPI backend, Redis caching, and a React dashboard for monitoring sentiment trends.",
                domain=ProjectDomain.nlp,
                tech_stack=["Python", "Transformers", "FastAPI", "Redis", "React", "mBERT"],
                github_url="https://github.com/dmx-rgit/sentiment-engine",
                demo_url="https://sentiment.dmxrgit.com",
                contributors=[
                    {"name": "Sneha Patil", "role": "Lead"},
                    {"name": "Vikram Joshi", "role": "NLP Engineer"},
                ],
                is_featured=True,
            ),
            Project(
                title="Medical Image Segmentation",
                description="U-Net based segmentation model for detecting tumors in brain MRI scans with 94% dice score.",
                domain=ProjectDomain.cv,
                tech_stack=["Python", "PyTorch", "U-Net", "MONAI", "Streamlit"],
                github_url="https://github.com/dmx-rgit/med-seg",
                contributors=[
                    {"name": "Ananya Kulkarni", "role": "Lead"},
                    {"name": "Rahul Nair", "role": "ML Engineer"},
                    {"name": "Diya Patel", "role": "Data"},
                ],
                is_featured=False,
            ),
            Project(
                title="AI Study Buddy",
                description="RAG-powered study assistant that answers questions from uploaded lecture notes and textbooks.",
                domain=ProjectDomain.genai,
                tech_stack=["Python", "LangChain", "ChromaDB", "OpenAI", "Next.js", "FastAPI"],
                github_url="https://github.com/dmx-rgit/study-buddy",
                demo_url="https://studybuddy.dmxrgit.com",
                contributors=[
                    {"name": "Karan Shah", "role": "Lead"},
                    {"name": "Meera Iyer", "role": "Full Stack"},
                ],
                is_featured=True,
            ),
            Project(
                title="Real-time Object Detection",
                description="Edge-optimized YOLOv8 model running on Jetson Nano for campus security and attendance tracking.",
                domain=ProjectDomain.cv,
                tech_stack=["Python", "YOLOv8", "TensorRT", "Jetson Nano", "FastAPI"],
                github_url="https://github.com/dmx-rgit/edge-detect",
                contributors=[
                    {"name": "Aditya Rao", "role": "Lead"},
                    {"name": "Pooja Gupta", "role": "Edge ML"},
                ],
            ),
            Project(
                title="Speech-to-Text Pipeline",
                description="Whisper-based transcription service with speaker diarization for lecture recordings.",
                domain=ProjectDomain.nlp,
                tech_stack=["Python", "Whisper", "pyannote", "FastAPI", "PostgreSQL"],
                github_url="https://github.com/dmx-rgit/speech-pipeline",
                contributors=[
                    {"name": "Ishaan Kumar", "role": "Lead"},
                    {"name": "Tanya Verma", "role": "Audio ML"},
                ],
            ),
            Project(
                title="Stock Prediction Dashboard",
                description="LSTM and transformer-based stock price prediction with interactive Streamlit dashboard.",
                domain=ProjectDomain.data_science,
                tech_stack=["Python", "PyTorch", "Streamlit", "yfinance", "Plotly"],
                github_url="https://github.com/dmx-rgit/stock-predict",
                contributors=[
                    {"name": "Nikhil Bhatt", "role": "Lead"},
                    {"name": "Sakshi Jain", "role": "Data Scientist"},
                ],
            ),
            Project(
                title="Gesture-Controlled Robot Arm",
                description="MediaPipe hand tracking to control a 6-DOF robot arm for pick-and-place tasks.",
                domain=ProjectDomain.robotics,
                tech_stack=["Python", "MediaPipe", "Arduino", "ROS2", "OpenCV"],
                github_url="https://github.com/dmx-rgit/gesture-arm",
                contributors=[
                    {"name": "Sahil Dongre", "role": "Lead"},
                    {"name": "Riya Sawant", "role": "Robotics"},
                    {"name": "Harsh Pandey", "role": "CV"},
                ],
            ),
        ]
        db.add_all(projects)

        # --- Team Members ---
        team = [
            TeamMember(name="Arjun Mehta", role="President", tier=TeamTier.core, display_order=1, year="Fourth",
                       fun_fact="Built his first neural network at 15",
                       social_links={"github": "https://github.com/arjunm", "linkedin": "https://linkedin.com/in/arjunm"}),
            TeamMember(name="Sneha Patil", role="Vice President", tier=TeamTier.core, display_order=2, year="Fourth",
                       fun_fact="Published 3 NLP papers before graduating",
                       social_links={"github": "https://github.com/snehap", "linkedin": "https://linkedin.com/in/snehap"}),
            TeamMember(name="Karan Shah", role="Technical Lead", tier=TeamTier.core, display_order=3, year="Third",
                       fun_fact="Kaggle Grandmaster with 4 gold medals",
                       social_links={"github": "https://github.com/karans", "linkedin": "https://linkedin.com/in/karans"}),
            TeamMember(name="Priya Sharma", role="Events Head", tier=TeamTier.core, display_order=4, year="Third",
                       fun_fact="Organized 3 hackathons with 1500+ total participants",
                       social_links={"github": "https://github.com/priyas", "linkedin": "https://linkedin.com/in/priyas"}),
            TeamMember(name="Rohan Desai", role="Computer Vision Lead", tier=TeamTier.lead, display_order=1, year="Third",
                       fun_fact="Interned at ISRO's satellite imagery team",
                       social_links={"github": "https://github.com/rohand"}),
            TeamMember(name="Ananya Kulkarni", role="NLP Lead", tier=TeamTier.lead, display_order=2, year="Third",
                       fun_fact="Fluent in 5 programming languages and 4 human ones",
                       social_links={"github": "https://github.com/ananyak"}),
            TeamMember(name="Vikram Joshi", role="GenAI Lead", tier=TeamTier.lead, display_order=3, year="Second",
                       fun_fact="Fine-tuned his first LLM during a power outage using a laptop",
                       social_links={"github": "https://github.com/vikramj"}),
            TeamMember(name="Diya Patel", role="Data Science Lead", tier=TeamTier.lead, display_order=4, year="Second",
                       fun_fact="Won Smart India Hackathon 2025",
                       social_links={"github": "https://github.com/diyap"}),
            TeamMember(name="Aditya Rao", role="Robotics Lead", tier=TeamTier.lead, display_order=5, year="Second",
                       fun_fact="Built a self-driving RC car that navigates RGIT corridors",
                       social_links={"github": "https://github.com/adityar"}),
            TeamMember(name="Meera Iyer", role="Design Lead", tier=TeamTier.lead, display_order=6, year="Third",
                       fun_fact="Designed DMX's brand identity in one caffeine-fueled weekend",
                       social_links={"github": "https://github.com/meerai", "linkedin": "https://linkedin.com/in/meerai"}),
            TeamMember(name="Rahul Nair", role="Member", tier=TeamTier.member, display_order=1, year="First",
                       fun_fact="Runs a tech blog with 10K monthly readers"),
            TeamMember(name="Pooja Gupta", role="Member", tier=TeamTier.member, display_order=2, year="First",
                       fun_fact="Competitive programmer with a 2100 Codeforces rating"),
            TeamMember(name="Ishaan Kumar", role="Member", tier=TeamTier.member, display_order=3, year="First",
                       fun_fact="Built a voice assistant in Marathi for his grandmother"),
            TeamMember(name="Sakshi Jain", role="Member", tier=TeamTier.member, display_order=4, year="Second",
                       fun_fact="Visualized Mumbai's entire public transport network in D3.js"),
            TeamMember(name="Sahil Dongre", role="Member", tier=TeamTier.member, display_order=5, year="Second",
                       fun_fact="3D prints custom drone frames in the college makerspace"),
        ]
        db.add_all(team)

        # --- Gallery Images (placeholder URLs) ---
        gallery = [
            GalleryImage(image_url="/images/gallery/hack2infinity-1.jpg", caption="Hack2Infinity 2025 opening ceremony", category=GalleryCategory.hackathon),
            GalleryImage(image_url="/images/gallery/hack2infinity-2.jpg", caption="Teams hacking through the night", category=GalleryCategory.hackathon),
            GalleryImage(image_url="/images/gallery/hack2infinity-3.jpg", caption="Final presentations and demos", category=GalleryCategory.hackathon),
            GalleryImage(image_url="/images/gallery/hack2infinity-4.jpg", caption="Winners with their trophies", category=GalleryCategory.hackathon),
            GalleryImage(image_url="/images/gallery/workshop-dl-1.jpg", caption="Deep learning workshop in action", category=GalleryCategory.workshop),
            GalleryImage(image_url="/images/gallery/workshop-dl-2.jpg", caption="Hands-on neural network coding session", category=GalleryCategory.workshop),
            GalleryImage(image_url="/images/gallery/workshop-cv-1.jpg", caption="Computer vision bootcamp demo", category=GalleryCategory.workshop),
            GalleryImage(image_url="/images/gallery/workshop-nlp-1.jpg", caption="NLP workshop with industry mentor", category=GalleryCategory.workshop),
            GalleryImage(image_url="/images/gallery/speaker-1.jpg", caption="Industry speaker on AI at scale", category=GalleryCategory.workshop),
            GalleryImage(image_url="/images/gallery/social-1.jpg", caption="DMX team outing", category=GalleryCategory.social),
            GalleryImage(image_url="/images/gallery/social-2.jpg", caption="Annual DMX meetup", category=GalleryCategory.social),
            GalleryImage(image_url="/images/gallery/social-3.jpg", caption="Committee bonding session", category=GalleryCategory.social),
        ]
        db.add_all(gallery)

        # --- Sponsors ---
        sponsors = [
            Sponsor(name="Google Cloud", logo_url="/images/sponsors/google-cloud.svg", website_url="https://cloud.google.com", tier=SponsorTier.title, display_order=1),
            Sponsor(name="Microsoft Azure", logo_url="/images/sponsors/microsoft-azure.svg", website_url="https://azure.microsoft.com", tier=SponsorTier.title, display_order=2),
            Sponsor(name="AWS", logo_url="/images/sponsors/aws.svg", website_url="https://aws.amazon.com", tier=SponsorTier.gold, display_order=1),
            Sponsor(name="NVIDIA", logo_url="/images/sponsors/nvidia.svg", website_url="https://nvidia.com", tier=SponsorTier.gold, display_order=2),
            Sponsor(name="GitHub", logo_url="/images/sponsors/github.svg", website_url="https://github.com", tier=SponsorTier.silver, display_order=1),
            Sponsor(name="Hugging Face", logo_url="/images/sponsors/huggingface.svg", website_url="https://huggingface.co", tier=SponsorTier.community, display_order=1),
        ]
        db.add_all(sponsors)

        await db.commit()
        print("Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
