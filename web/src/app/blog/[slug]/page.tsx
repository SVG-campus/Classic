// web/src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = params;

  try {
    const { meta, content } = getPostBySlug(slug);

    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <article>
          <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
          {meta.date && (
            <p className="text-sm text-gray-500 mb-6">{meta.date}</p>
          )}

          <div className="prose prose-slate max-w-none">
            <MDXRemote source={content} />
          </div>
        </article>
      </main>
    );
  } catch (e) {
    return notFound();
  }
}
