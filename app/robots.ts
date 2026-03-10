import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/private/',
            },
            {
                userAgent: 'Mediapartners-Google',
                allow: '/',
            }
        ],
        sitemap: 'https://quizyen.com/sitemap.xml',
    }
}
