# 13 · SAMAN — 8 Rental Pages LeaseOut Schema (CORRECTED warranty values)
*Replaces file 04. All 8 blocks now carry the confirmed warranty: 5-year structural + 1-year standard (extendable to 2). Hand to developer for Task 12.*

For each rental page, inject the corresponding JSON-LD as `<script type="application/ld+json">`.

---

### 1 · /container-rent-services/40x10-porta-cabin-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/40x10-porta-cabin-rental#product",
  "name": "40x10 Porta Cabin Rental",
  "description": "400 sq ft porta cabin for rent in Bangalore and Delhi NCR. PUF-insulated, pre-wired, ISO-certified. Ideal for 8-10 person site offices and temporary accommodation.",
  "image": ["https://www.samanportable.com/40x10-executive-porta-cabin-office.png"],
  "category": "Porta Cabin Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "35000",
      "maxPrice": "45000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 2 · /container-rent-services/30x10-porta-cabin-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/30x10-porta-cabin-rental#product",
  "name": "30x10 Porta Cabin Rental",
  "description": "300 sq ft porta cabin for rent across Bangalore and Delhi NCR. ISO-certified, weather-resistant, customizable layout for medium-scale site offices.",
  "image": ["https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"],
  "category": "Porta Cabin Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "25000",
      "maxPrice": "35000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 3 · /container-rent-services/20x10-porta-cabin-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/20x10-porta-cabin-rental#product",
  "name": "20x10 Porta Cabin Rental",
  "description": "200 sq ft compact porta cabin for rent in Bangalore and Delhi NCR. Quick positioning with minimal site prep. Ideal for small site offices and consultants.",
  "image": ["https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"],
  "category": "Porta Cabin Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "18000",
      "maxPrice": "25000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 4 · /container-rent-services/10x10-porta-cabin-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/10x10-porta-cabin-rental#product",
  "name": "10x10 Porta Cabin Rental",
  "description": "100 sq ft individual porta cabin for rent in Bangalore and Delhi NCR. Lightweight, crane-free installation. Ideal for site supervisors and security personnel.",
  "image": ["https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"],
  "category": "Porta Cabin Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "12000",
      "maxPrice": "18000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 5 · /container-rent-services/40x8-container-office-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/40x8-container-office-rental#product",
  "name": "40x8 Container Office Rental",
  "description": "320 sq ft container office for rent in Bangalore and Delhi NCR. Galvanized steel, insulated, HVAC-ready. Built for large project offices and corporate site teams.",
  "image": ["https://www.samanportable.com/40x8-container-office-rental-bangalore.png"],
  "category": "Container Office Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "32000",
      "maxPrice": "42000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 6 · /container-rent-services/30x8-container-office-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/30x8-container-office-rental#product",
  "name": "30x8 Container Office Rental",
  "description": "240 sq ft container office for rent in Bangalore and Delhi NCR. Repositionable, configurable interiors for medium teams, workstations and meeting rooms.",
  "image": ["https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"],
  "category": "Container Office Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "22000",
      "maxPrice": "32000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 7 · /container-rent-services/20x8-container-office-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/20x8-container-office-rental#product",
  "name": "20x8 Container Office Rental",
  "description": "160 sq ft container office for rent in Bangalore and Delhi NCR. Efficient layout for small teams and remote work sites with rapid deployment.",
  "image": ["https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"],
  "category": "Container Office Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "16000",
      "maxPrice": "22000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```

### 8 · /container-rent-services/10x8-container-office-rental
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.samanportable.com/container-rent-services/10x8-container-office-rental#product",
  "name": "10x8 Container Office Rental",
  "description": "80 sq ft container office pod for rent in Bangalore and Delhi NCR. Secure, compact, low-maintenance workspace for independent professionals and constrained sites.",
  "image": ["https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"],
  "category": "Container Office Rental",
  "brand": { "@id": "https://www.samanportable.com/#organization" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Structural warranty", "value": "5 years" },
    { "@type": "PropertyValue", "name": "Standard warranty (fittings)", "value": "1 year, extendable to 2 years on request" }
  ],
  "offers": {
    "@type": "Offer",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@id": "https://www.samanportable.com/#organization" },
    "eligibleDuration": { "@type": "QuantitativeValue", "minValue": 6, "unitCode": "MON" },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "10000",
      "maxPrice": "16000",
      "priceCurrency": "INR",
      "unitCode": "MON"
    }
  }
}
```
