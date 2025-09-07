// Example usage of the SpeakerCarousel component
import { SpeakerCarousel } from '@/components/ui/speaker-carousel';

// Sample speaker data - replace with your actual data
const sampleSpeakers = [
  {
    id: 1,
    name: "John Smith",
    title: "President, Product and Business, Stripe",
    image: "/images/speakers/john-smith.jpg"
  },
  {
    id: 2,
    name: "Jane Doe",
    title: "CEO, Tech Innovations",
    image: "/images/speakers/jane-doe.jpg"
  },
  {
    id: 3,
    name: "Mike Johnson",
    title: "CTO, Future Systems",
    image: "/images/speakers/mike-johnson.jpg"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    title: "VP Engineering, CloudTech",
    image: "/images/speakers/sarah-wilson.jpg"
  },
  {
    id: 5,
    name: "David Brown",
    title: "Head of AI Research, DataCorp",
    image: "/images/speakers/david-brown.jpg"
  },
  {
    id: 6,
    name: "Emily Davis",
    title: "Director of Product, InnovateLab",
    image: "/images/speakers/emily-davis.jpg"
  },
  {
    id: 7,
    name: "Robert Miller",
    title: "Senior Architect, BuildSoft",
    image: "/images/speakers/robert-miller.jpg"
  },
  {
    id: 8,
    name: "Lisa Anderson",
    title: "Lead Developer, CodeMasters",
    image: "/images/speakers/lisa-anderson.jpg"
  },
  {
    id: 9,
    name: "James Taylor",
    title: "Principal Engineer, TechFlow",
    image: "/images/speakers/james-taylor.jpg"
  },
  {
    id: 10,
    name: "Maria Garcia",
    title: "Software Architect, DevCorp",
    image: "/images/speakers/maria-garcia.jpg"
  },
  {
    id: 11,
    name: "Christopher Lee",
    title: "Engineering Manager, ScaleTech",
    image: "/images/speakers/christopher-lee.jpg"
  },
  {
    id: 12,
    name: "Amanda White",
    title: "Product Owner, UserFirst",
    image: "/images/speakers/amanda-white.jpg"
  },
  {
    id: 13,
    name: "Daniel Martinez",
    title: "Technical Lead, CodeBase",
    image: "/images/speakers/daniel-martinez.jpg"
  },
  {
    id: 14,
    name: "Jessica Thompson",
    title: "Senior Developer, WebTech",
    image: "/images/speakers/jessica-thompson.jpg"
  },
  {
    id: 15,
    name: "Kevin Rodriguez",
    title: "Platform Engineer, CloudNative",
    image: "/images/speakers/kevin-rodriguez.jpg"
  },
  {
    id: 16,
    name: "Rachel Lewis",
    title: "Data Scientist, Analytics Pro",
    image: "/images/speakers/rachel-lewis.jpg"
  },
  {
    id: 17,
    name: "Brian Walker",
    title: "DevOps Engineer, DeployFast",
    image: "/images/speakers/brian-walker.jpg"
  },
  {
    id: 18,
    name: "Nicole Hall",
    title: "UX Engineer, DesignTech",
    image: "/images/speakers/nicole-hall.jpg"
  },
  {
    id: 19,
    name: "Andrew Young",
    title: "Backend Developer, ServerSide",
    image: "/images/speakers/andrew-young.jpg"
  },
  {
    id: 20,
    name: "Stephanie King",
    title: "Frontend Specialist, UIExpert",
    image: "/images/speakers/stephanie-king.jpg"
  },
  {
    id: 21,
    name: "Mark Wright",
    title: "Security Engineer, SafeCode",
    image: "/images/speakers/mark-wright.jpg"
  },
  {
    id: 22,
    name: "Lauren Green",
    title: "Mobile Developer, AppMakers",
    image: "/images/speakers/lauren-green.jpg"
  },
  {
    id: 23,
    name: "Steven Adams",
    title: "Cloud Architect, SkyTech",
    image: "/images/speakers/steven-adams.jpg"
  },
  {
    id: 24,
    name: "Megan Nelson",
    title: "Full Stack Developer, WebFlow",
    image: "/images/speakers/megan-nelson.jpg"
  }
];

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-black">
      <SpeakerCarousel speakers={sampleSpeakers} />
    </div>
  );
}
