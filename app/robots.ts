import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/profile/',
        '/settings/',
        '/battle/',
        '/study/',
        '/revision/',
        '/test/',
        '/timetable/',
      ],
    },
    sitemap: 'https://hellobhaiya.app/sitemap.xml',
  }
}
