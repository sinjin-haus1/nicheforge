'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
  },
});

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql';

/**
 * Inner provider — has access to NextAuth session.
 * Attaches the JWT as a Bearer token on every Apollo request.
 */
function ApolloAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: GRAPHQL_URL });

    const authLink = setContext((_, { headers }) => {
      // NextAuth exposes the raw JWT via session.accessToken (set in jwt callback)
      const token = (session as any)?.accessToken;
      return {
        headers: {
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };
    });

    return new ApolloClient({
      link: ApolloLink.from([authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [session]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ApolloAuthProvider>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ApolloAuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
