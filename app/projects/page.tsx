import { getAllProjects } from '@/lib/projects';
import ProjectsContent from './ProjectsContent';

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return <ProjectsContent projects={projects} />;
}
