import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Tüm botlar için geçerli
      allow: '/', // Tüm siteyi taramaya izin ver
      disallow: '/admin/', // Ancak /admin klasörünü ve altındaki sayfaları tarama
    },
    sitemap: 'https://www.pehli1team.com/sitemap.xml', // Site haritasının konumunu belirt
  }
}
