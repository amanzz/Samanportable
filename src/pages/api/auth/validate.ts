import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Validate token with WordPress
    const wpResponse = await fetch(`https://blog.samanportable.com/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!wpResponse.ok) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userData = await wpResponse.json();

    // Transform user data to match our interface
    const user = {
      id: userData.id,
      username: userData.slug,
      email: userData.email,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      roles: userData.roles || [],
    };

    res.status(200).json(user);
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
}
