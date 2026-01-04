import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  console.log("Static params posts:", posts.map((p) => p.slug));
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // NOTE: await params

  console.log("BlogPostPage slug:", slug);

  try {
    const { meta, content } = getPostBySlug(slug);
    console.log("Loaded post meta:", meta);

    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <article>
          <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
          {meta.date && (
            <p className="text-sm text-gray-500 mb-6">{meta.date}</p>
          )}
          <div className="prose prose-invert max-w-none">
            <MDXRemote source={content} />
          </div>
        </article>
      </main>
    );
  } catch (e) {
    console.error("getPostBySlug error:", e);
    return notFound();
  }
}
