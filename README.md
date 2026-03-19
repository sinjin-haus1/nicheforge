# NicheForge - Faceless YouTube Niche Research Tool

AI-powered tool that helps creators find profitable, underserved faceless YouTube niches. Analyze competition, trending topics, and revenue potential.

## Features

- **Niche Search** - Find niches by keyword
- **Category Filters** - Browse by category (History, Science, Facts, True Crime, Kids, Gaming)
- **Competition Analysis** - Low/Medium/High competition indicators
- **Trend Scoring** - AI-generated trend scores (0-100)
- **Revenue Estimates** - Potential monetization insight
- **Content Ideas** - Generated content ideas within each niche
- **Difficulty Rating** - Beginner/Intermediate/Advanced

## Tech Stack

- **Backend:** NestJS, MongoDB, GraphQL
- **Frontend:** Next.js 14 (to be added), Material UI, TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run in development
npm run start:dev
```

## GraphQL API

Access the GraphQL playground at `http://localhost:3000/graphql`

### Queries

```graphql
# Get all niches
query {
  niches {
    name
    category
    competition
    trendScore
    difficulty
  }
}

# Search niches
query {
  searchNiches(keyword: "history") {
    name
    trendScore
  }
}

# Get trending for faceless content
query {
  trendingFaceless {
    name
    category
    trendScore
    monetizationPotential
  }
}
```

## Trends This App Capitalizes On

- Faceless YouTube channels exploding (100K subs in 13 days)
- History channels making $16K/month
- Kids animation = "silent money machine" (721K subs)
- AI-generated content dominating
- Mass UGC marketing going mainstream

## Target Audience

- Aspiring faceless YouTubers
- Content creators looking for underserved niches
- Faceless channel operators seeking growth
- Marketing agencies exploring niche opportunities
