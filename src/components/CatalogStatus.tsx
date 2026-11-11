import { Button } from "@/components/ui/button";
export default function CatalogStatus({ loading, error, retry }: { loading: boolean; error: boolean; retry: () => void }) {
  if (loading) return <p role="status" className="py-8 text-muted-foreground">Loading games…</p>;
  if (error) return <div role="alert" className="py-8 text-muted-foreground">Games could not load. <Button variant="outline" onClick={retry}>Try again</Button></div>;
  return null;
}