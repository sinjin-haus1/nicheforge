'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const GET_NICHES = gql`
  query GetNiches {
    niches {
      id
      name
      category
      competition
      trendScore
      estimatedRevenue
      difficulty
      monetizationPotential
    }
  }
`;

const GET_TRENDING = gql`
  query GetTrending {
    trendingFaceless {
      id
      name
      category
      competition
      trendScore
      estimatedRevenue
    }
  }
`;

const GET_ANALYSIS = gql`
  query AnalyzeCompetition($nicheId: ID!) {
    analyzeCompetition(nicheId: $nicheId) {
      competitionLevel
      competitorCount
      avgChannelAge
      avgSubscribers
      saturationLevel
      opportunityScore
      recommendations
    }
  }
`;

const GET_REVENUE = gql`
  query EstimateRevenue($nicheId: ID!) {
    estimateRevenue(nicheId: $nicheId) {
      estimatedMonthlyViews
      estimatedCPM
      estimatedMonthlyRevenue
      revenueRange
      monetizationMethods
    }
  }
`;

interface Niche {
  id: string;
  name: string;
  category: string;
  competition: string;
  trendScore: number;
  estimatedRevenue: string;
  difficulty: string;
  monetizationPotential: string;
}

function getCompetitionColor(competition: string) {
  switch (competition?.toLowerCase()) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    default:
      return 'default';
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'success';
    case 'intermediate':
      return 'warning';
    case 'advanced':
      return 'error';
    default:
      return 'default';
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [showTrending, setShowTrending] = useState(false);

  const { data: nichesData, loading: nichesLoading, error: nichesError } = useQuery(GET_NICHES, {
    skip: showTrending,
  });

  const { data: trendingData, loading: trendingLoading } = useQuery(GET_TRENDING, {
    skip: !showTrending,
  });

  const { data: analysisData, loading: analysisLoading } = useQuery(GET_ANALYSIS, {
    skip: !selectedNiche,
    variables: { nicheId: selectedNiche?.id },
  });

  const { data: revenueData, loading: revenueLoading } = useQuery(GET_REVENUE, {
    skip: !selectedNiche,
    variables: { nicheId: selectedNiche?.id },
  });

  const niches = showTrending ? trendingData?.trendingFaceless || [] : nichesData?.niches || [];
  const filteredNiches = niches.filter((niche: Niche) =>
    niche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    niche.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 4 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🔨 NicheForge
          </Typography>
          <Button
            color="inherit"
            startIcon={<TrendingUpIcon />}
            onClick={() => setShowTrending(!showTrending)}
          >
            {showTrending ? 'All Niches' : 'Trending'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Find Your Perfect Faceless YouTube Niche
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Analyze competition, trends, and revenue potential for your next viral channel
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search niches by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 3, maxWidth: 600 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {nichesLoading || trendingLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : nichesError ? (
          <Alert severity="error">
            Error loading niches: {nichesError.message}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredNiches.map((niche: Niche) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={niche.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="h2">
                        {niche.name}
                      </Typography>
                      <Chip
                        label={niche.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={`Competition: ${niche.competition || 'N/A'}`}
                        size="small"
                        color={getCompetitionColor(niche.competition) as any}
                      />
                      <Chip
                        label={`Difficulty: ${niche.difficulty || 'N/A'}`}
                        size="small"
                        color={getDifficultyColor(niche.difficulty) as any}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon color="primary" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          Trend: {niche.trendScore || 0}/100
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon color="success" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {niche.estimatedRevenue || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<AnalyticsIcon />}
                      onClick={() => setSelectedNiche(niche)}
                      fullWidth
                    >
                      Analyze
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedNiche && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Analysis: {selectedNiche.name}
            </Typography>

            {analysisLoading || revenueLoading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        📊 Competition Analysis
                      </Typography>
                      {analysisData?.analyzeCompetition && (
                        <>
                          <Typography>
                            Competition Level: <strong>{analysisData.analyzeCompetition.competitionLevel}</strong>
                          </Typography>
                          <Typography>
                            Competitor Count: <strong>{analysisData.analyzeCompetition.competitorCount}</strong>
                          </Typography>
                          <Typography>
                            Avg Channel Age: <strong>{analysisData.analyzeCompetition.avgChannelAge} months</strong>
                          </Typography>
                          <Typography>
                            Avg Subscribers: <strong>{analysisData.analyzeCompetition.avgSubscribers.toLocaleString()}</strong>
                          </Typography>
                          <Typography>
                            Saturation: <strong>{analysisData.analyzeCompetition.saturationLevel}</strong>
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                            Opportunity Score: {analysisData.analyzeCompetition.opportunityScore}/100
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Recommendations:</Typography>
                            <ul>
                              {analysisData.analyzeCompetition.recommendations.map((rec: string, i: number) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        💰 Revenue Estimation
                      </Typography>
                      {revenueData?.estimateRevenue && (
                        <>
                          <Typography>
                            Monthly Views: <strong>{revenueData.estimateRevenue.estimatedMonthlyViews}</strong>
                          </Typography>
                          <Typography>
                            CPM: <strong>{revenueData.estimateRevenue.estimatedCPM}</strong>
                          </Typography>
                          <Typography variant="h5" color="success.main" sx={{ my: 2 }}>
                            {revenueData.estimateRevenue.estimatedMonthlyRevenue}
                          </Typography>
                          <Typography>
                            Revenue Range: <strong>{revenueData.estimateRevenue.revenueRange}</strong>
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Monetization Methods:</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {revenueData.estimateRevenue.monetizationMethods.map((method: string) => (
                                <Chip key={method} label={method} size="small" />
                              ))}
                            </Box>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
