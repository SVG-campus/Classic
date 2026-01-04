// web/src/app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "SEO Blog - Classic",
  description: "AI-generated SEO and automation guides.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Blog</h1>
      <p className="mb-8 text-gray-600">
        Guides on AI, SEO, automation, and marketing. New articles generated daily.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-1">
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {post.date}
            </p>
            <p className="text-gray-700">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
