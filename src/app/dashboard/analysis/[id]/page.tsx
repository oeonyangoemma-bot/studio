import { notFound } from "next/navigation";

export default function AnalysisReportPage({ params }: { params: { id: string } }) {
  // Since we are not saving analyses, this page is no longer reachable directly.
  // We will redirect users from the old paths if they have them bookmarked.
  // In a real app, you might show a message that the link has expired.
  notFound();
  
  return null;
}
