'use client';

import { useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  InputAdornment,
  LinearProgress,
  Tooltip,
  IconButton,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

const GENERATE_HOOKS = gql`
  query GenerateHooks($niche: String!, $count: Int) {
    generateHooks(niche: $niche, count: $count) {
      niche
      count
      hooks {
        id
        text
        type
        viralPotential
        category
      }
    }
  }
`;

const TOP_HOOKS = gql`
  query TopHooks($limit: Int) {
    topHooks(limit: $limit) {
      id
      text
      type
      viralPotential
      niche
      category
    }
  }
`;

interface Hook {
  id: string;
  text: string;
  type: string;
  viralPotential: number;
  niche?: string;
  category?: string;
}

const HOOK_TYPE_COLORS: Record<string, string> = {
  question: '#7C3AED',
  shock: '#DC2626',
  promise: '#059669',
  story: '#D97706',
  list: '#2563EB',
  'how-to': '#0891B2',
};

const HOOK_TYPE_LABELS: Record<string, string> = {
  question: '❓ Question',
  shock: '⚡ Shock',
  promise: '🎯 Promise',
  story: '📖 Story',
  list: '📋 List',
  'how-to': '🛠️ How-To',
};

function ViralScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? '#059669' : score >= 6 ? '#D97706' : '#DC2626';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <BoltIcon sx={{ color, fontSize: 18 }} />
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(0,0,0,0.08)',
            '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ color, fontWeight: 700, minWidth: 28 }}>
        {score}/10
      </Typography>
    </Box>
  );
}

function HookCard({ hook, onCopy }: { hook: Hook; onCopy: (text: string) => void }) {
  const typeColor = HOOK_TYPE_COLORS[hook.type] || '#6B7280';
  const typeLabel = HOOK_TYPE_LABELS[hook.type] || hook.type;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `4px solid ${typeColor}`,
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={typeLabel}
            size="small"
            sx={{ bgcolor: typeColor, color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
          />
          <Tooltip title="Copy hook">
            <IconButton size="small" onClick={() => onCopy(hook.text)}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.5, my: 1.5 }}>
          "{hook.text}"
        </Typography>

        <ViralScoreBar score={hook.viralPotential} />
      </CardContent>
    </Card>
  );
}

export default function HooksPage() {
  const [niche, setNiche] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [generateHooks, { data: generated, loading: generating, error: generateError }] =
    useLazyQuery(GENERATE_HOOKS);

  const { data: topData, loading: topLoading } = useLazyQuery(TOP_HOOKS)[0] as any;

  const handleGenerate = () => {
    if (!niche.trim()) return;
    generateHooks({ variables: { niche: niche.trim(), count: 6 } });
    setHasGenerated(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const hooks: Hook[] = generated?.generateHooks?.hooks || [];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 6 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>
            <IconButton color="inherit" size="small">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Viral Hook Generator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Generate Viral Shorts Hooks
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            AI-powered hooks optimized for faceless YouTube Shorts. Enter your niche and get
            ready-to-use hooks with viral potential scores.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              maxWidth: 600,
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="e.g. Ancient History, True Crime, Personal Finance..."
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={generating || !niche.trim()}
              startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{ minWidth: 160, fontWeight: 700 }}
            >
              {generating ? 'Generating...' : 'Generate Hooks'}
            </Button>
          </Box>

          {/* Quick niche chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
            {['Ancient History', 'True Crime', 'Personal Finance', 'Space Science', 'Psychology', 'Stoicism'].map(
              (suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  onClick={() => setNiche(suggestion)}
                  variant="outlined"
                  size="small"
                  clickable
                  sx={{ cursor: 'pointer' }}
                />
              ),
            )}
          </Box>
        </Box>

        {/* Error */}
        {generateError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to generate hooks: {generateError.message}
          </Alert>
        )}

        {/* Generated Hooks */}
        {hasGenerated && hooks.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={700}>
                Hooks for "{generated?.generateHooks?.niche}"
              </Typography>
              <Chip
                label={`${hooks.length} hooks generated`}
                color="primary"
                size="small"
              />
            </Box>

            <Grid container spacing={3}>
              {hooks.map((hook) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={hook.id}>
                  <HookCard hook={hook} onCopy={handleCopy} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Pro tip:</strong> Hooks scoring 8+ are your best bets. Test 2-3 variations
                per video and double down on the format that performs best for your channel.
              </Typography>
            </Box>
          </Box>
        )}

        {/* Empty state */}
        {!hasGenerated && (
          <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
            <AutoAwesomeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" gutterBottom>
              Enter a niche above to generate your first hooks
            </Typography>
            <Typography variant="body2">
              Each hook is scored for viral potential based on format, niche CPM, and trending patterns.
            </Typography>
          </Box>
        )}
      </Container>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Hook copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
