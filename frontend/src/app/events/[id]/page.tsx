"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, ArrowUpRight, Copy, Check } from "lucide-react";
import { Event } from "@/types";
import { api } from "@/lib/api";
import { SectionDivider } from "@/components/shared/SectionDivider";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border-default shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border-default">
        <div className="flex items-center gap-2">
          {/* Mac-style window controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs font-mono font-medium text-text-secondary uppercase tracking-widest">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-brand-teal" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? <span className="text-brand-teal">Copied!</span> : <span>Copy</span>}
        </button>
      </div>
      
      {/* Code Area */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "#07090D",
          fontSize: "0.875rem",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await api.events.get(id);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <button onClick={() => router.back()} className="text-brand-teal hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const isHackathon = event.category === "hackathon";
  const isVideo = event.image_url?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="min-h-screen pt-4 pb-20">
      {/* Fullscreen Media Modal */}
      {isMediaOpen && event.image_url && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsMediaOpen(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            {isVideo ? (
              <video 
                src={event.image_url} 
                autoPlay loop muted playsInline 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
              />
            ) : (
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
              />
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </button>

        <div className="overflow-hidden">
          {event.image_url && (
            <div 
              className="w-full h-64 md:h-96 lg:h-[500px] relative bg-bg-surface border-b border-border-default rounded-xl mb-8 overflow-hidden cursor-pointer group"
              onClick={() => setIsMediaOpen(true)}
            >
              {isVideo ? (
                <video 
                  src={event.image_url} 
                  autoPlay loop muted playsInline 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <img 
                  src={event.image_url} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  Click to view
                </span>
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
                    isHackathon 
                      ? "bg-brand-teal text-bg-primary border-brand-teal" 
                      : "bg-bg-primary text-text-secondary border-border-default"
                  }`}>
                    {event.category.replace("_", " ")}
                  </span>
                  {event.is_flagship && (
                    <span className="px-3 py-1 bg-brand-navy/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/30">
                      Flagship Event
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary">
                  {event.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a 
                  href={`/gallery?event_id=${event.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-bg-surface border border-border-default text-text-primary font-bold hover:bg-bg-secondary transition-all"
                >
                  View Photos
                </a>
                
                {event.registration_url && (
                  <a 
                    href={event.registration_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-teal text-bg-primary font-bold hover:bg-brand-teal-light transition-all shadow-[0_0_15px_rgba(52,217,166,0.3)] hover:-translate-y-1"
                  >
                    {event.is_upcoming ? "Register Now" : "View Event Site"}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <SectionDivider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 my-12">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">About the Event</h2>
                <div className="text-text-secondary leading-relaxed max-w-none space-y-2">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold text-text-primary mt-5 mb-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold text-text-primary mt-5 mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold text-text-primary mt-4 mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li {...props} />,
                      a: ({node, ...props}) => <a className="text-brand-teal hover:underline font-semibold" target="_blank" rel="noopener noreferrer" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-text-primary" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-teal pl-4 italic my-4 text-text-muted bg-brand-teal/5 py-2 rounded-r-lg" {...props} />,
                      pre: ({node, ...props}) => <>{props.children}</>,
                      code: ({node, className, children, ...props}: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        return isInline ? (
                          <code className="bg-bg-primary border border-border-subtle px-1.5 py-0.5 rounded text-sm font-mono text-brand-teal" {...props}>
                            {children}
                          </code>
                        ) : (
                          <CodeBlock language={match?.[1] || "text"} value={String(children).replace(/\n$/, "")} />
                        );
                      },
                    }}
                  >
                    {event.description}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="space-y-8 bg-bg-surface p-6 rounded-xl border border-border-subtle h-fit">
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-teal" />
                    Date & Time
                  </h3>
                  <div className="text-text-secondary text-sm">
                    <p className="font-semibold text-text-primary mb-1">
                      {new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p>
                      {new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-teal" />
                    Location
                  </h3>
                  <div className="text-text-secondary text-sm">
                    <p className="font-semibold text-text-primary mb-1">{event.venue}</p>
                    <p>RGIT Campus, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
