import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const locales = ['en', 'tr']
    const routes = ['', '/blog'] // Add more routes as needed

    const entries: MetadataRoute.Sitemap = []

    locales.forEach((locale) => {
        routes.forEach((route) => {
            entries.push({
                url: `https://quizyen.com/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            })
        })
    })

    return entries
}
