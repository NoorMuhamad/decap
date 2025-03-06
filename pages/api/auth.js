import { randomBytes } from 'crypto'

export default async function handler(req, res) {
  const { query } = req


  if (!query.code) {
    // Step 1: Redirect to GitHub OAuth
    const state = randomBytes(16).toString('hex')
    const clientId = process.env.OAUTH_CLIENT_ID
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&state=${state}`
    console.log("url===>", url)

    res.redirect(url)
    return
  }

  // Step 2: Exchange code for token
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code: query.code,
      }),
    })

    const data = await response.json()

    res.redirect(`http://localhost:3000/admin/index.html#/access_token=${data.access_token}`)
  } catch (err) {
    res.status(500).json({ error: 'Error during authentication' })
  }
}