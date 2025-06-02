// └─ app
//    └─ auth
//       ├─ auth-code-error
//       │   └─ page.tsx
//       └─ callback
//           └─ route.ts

// app/auth/auth-code-error/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function AuthCodeErrorPage() {
  const params = useSearchParams();
  const msg = params.get('error') ?? 'Unknown error';

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Authentication Error</h1>
      <p>Something went wrong while logging in with Spotify:</p>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{msg}</pre>
      <p>
        <a href="/">Go back home</a>
      </p>
    </div>
  );
}
