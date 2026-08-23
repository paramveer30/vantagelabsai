import { site } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{site.tagline}</h1>
      <p className="mt-4 max-w-xl text-muted">{site.description}</p>
    </div>
  );
}
