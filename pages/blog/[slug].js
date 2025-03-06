import Head from 'next/head'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { format } from 'date-fns'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export default function BlogPost({ frontmatter, content }) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
      </Head>

      <main className="max-w-3xl mx-auto">
        <article className="prose lg:prose-xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1>{frontmatter.title}</h1>
          <time className="text-gray-500 block mb-8">
            {format(new Date(frontmatter.date), 'MMMM dd, yyyy')}
          </time>
          {frontmatter.thumbnail && (
            <img
              src={frontmatter.thumbnail}
              alt={frontmatter.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
        </article>
      </main>
    </div>
  )
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  let paths = []

  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory)
    paths = fileNames.map((fileName) => ({
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }))
  }

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const fullPath = path.join(process.cwd(), 'content/blog', `${params.slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    props: {
      frontmatter: data,
      content,
    },
  }
}