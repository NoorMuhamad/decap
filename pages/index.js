import Head from 'next/head'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { format } from 'date-fns'

export default function Home({ posts }) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>My Blog</title>
        <meta name="description" content="A blog built with Next.js and Decap CMS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Posts</h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white p-6 rounded-lg shadow-md">
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500 mt-2 block">
                  {format(new Date(post.date), 'MMMM dd, yyyy')}
                </time>
                <p className="mt-3 text-gray-600">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  let posts = []

  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory)
    posts = fileNames.map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...data,
      }
    })

    posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return {
    props: {
      posts,
    },
  }
}