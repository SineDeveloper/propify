export function PropertyJsonLd({ property }: { property: any }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description,
        url: `https://yourdomain.com/properties/${property.id}`,
        offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "THB",
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: property.district,
            addressRegion: property.province,
            addressCountry: "TH",
        },
        image: property.images,
        numberOfRooms: property.bedrooms,
        floorSize: {
            "@type": "QuantitativeValue",
            value: property.area,
            unitCode: "SQM",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}