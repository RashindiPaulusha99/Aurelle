import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const POSTS = Array.from({ length: 6 }, (_, i) => ({
  id: `post-${i}`,
  handle: `@aurelle.island_${i + 1}`,
}));

export function CommunityGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="mb-6 font-display text-2xl sm:text-3xl">#WearVALESTRA</h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {POSTS.map((post) => (
          <div key={post.id} className="group relative overflow-hidden">
            <PlaceholderImage seed={post.id} aspect="square" className="transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute bottom-2 left-2 text-[10px] text-ivory/90 drop-shadow">{post.handle}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
