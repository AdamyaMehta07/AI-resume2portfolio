const fetch = require('node-fetch')
const archiver = require('archiver')
const { PassThrough } = require('stream')

const NETLIFY_API = 'https://api.netlify.com/api/v1'

// Zip index.html + a _headers file (forces correct Content-Type)
function zipHtml(html) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const stream = new PassThrough()
    const chunks = []

    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
    archive.on('error', reject)

    archive.pipe(stream)
    archive.append(html, { name: 'index.html' })
    // Netlify sometimes infers the wrong Content-Type on zip deploys —
    // this _headers file forces every path to be served as real HTML.
    archive.append('/*\n  Content-Type: text/html; charset=utf-8\n', { name: '_headers' })
    archive.finalize()
  })
}

function getToken() {
  const token = process.env.NETLIFY_AUTH_TOKEN
  if (!token) {
    const err = new Error('NETLIFY_AUTH_TOKEN is not configured on the server.')
    err.isDeployFailure = true
    throw err
  }
  return token
}

// Create a brand new Netlify site (random subdomain)
async function createSite() {
  const token = getToken()

  const res = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Netlify create site failed:', data)
    const err = new Error(data.message || 'Failed to create a new Netlify site.')
    err.isDeployFailure = true
    throw err
  }

  return data // { id, name, url, ssl_url, ... }
}

// Push a zip buffer as a new deploy to an existing site
async function deployZipToSite(siteId, zipBuffer) {
  const token = getToken()

  const res = await fetch(`${NETLIFY_API}/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/zip'
    },
    body: zipBuffer
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Netlify deploy failed:', data)
    const err = new Error(data.message || 'Failed to deploy to Netlify.')
    err.isDeployFailure = true
    throw err
  }

  return data
}

// Fetch current site info (to get the latest live URL)
async function getSite(siteId) {
  const token = getToken()
  const res = await fetch(`${NETLIFY_API}/sites/${siteId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// ── Main entrypoint: deploy (or redeploy) a portfolio
// If existingSiteId is passed, redeploys to the SAME site so the live URL stays the same across updates. Falls back to creating a new site if the existing one is missing or deleted
async function deployPortfolio({ html, existingSiteId }) {
  const zipBuffer = await zipHtml(html)

  let site

  if (existingSiteId) {
    try {
      await deployZipToSite(existingSiteId, zipBuffer)
      site = await getSite(existingSiteId)
      if (!site.id) throw new Error('Existing site not found')
    } catch (err) {
      console.warn('Redeploy to existing site failed, creating a new one:', err.message)
      site = await createSite()
      await deployZipToSite(site.id, zipBuffer)
    }
  } else {
    site = await createSite()
    await deployZipToSite(site.id, zipBuffer)
  }

  return {
    siteId: site.id,
    url: site.ssl_url || site.url
  }
}

module.exports = { deployPortfolio }