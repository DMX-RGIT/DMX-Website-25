import { notFound } from 'next/navigation';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { getProjectBySlug, getProjectDocumentBySlug } from '@/lib/projects';
import ProjectDetailContent from "./ProjectDetailContent";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const [project, projectDoc] = await Promise.all([
      getProjectBySlug(slug),
      getProjectDocumentBySlug(slug),
    ]);

    if (!project || !projectDoc) {
      notFound();
    }

    // Convert markdown to HTML
    const html = await remark().use(remarkHtml).process(projectDoc.content);
    const htmlString = html.toString();

    return <ProjectDetailContent project={project} htmlContent={htmlString} />;
  } catch (error) {
    console.error('Error reading project:', error);
    notFound();
  }
}
