// Next.js API Route - Proxy to bypass CORS in development
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://unops-api-dudw4t-af60f1-31-97-222-225.traefik.me';

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

async function proxyRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const queryString = url.search;

    const targetUrl = `${API_BASE_URL}${path}${queryString}`;

    // Get headers from original request
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      // Skip host and other headers that might cause issues
      if (
        !['host', 'connection', 'content-length'].includes(key.toLowerCase())
      ) {
        headers[key] = value;
      }
    });

    // Get body for POST/PUT requests
    let body = undefined;
    if (['POST', 'PUT'].includes(method)) {
      body = await request.text();
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const responseData = await response.text();

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/json',
        // Add CORS headers
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
