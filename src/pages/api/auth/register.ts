import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Create user in WordPress
    const wpResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        roles: ['customer'],
      }),
    });

    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();
      return res.status(400).json({ 
        message: errorData.message || 'Failed to create user' 
      });
    }

    const userData = await wpResponse.json();

    // Now login the user to get JWT token
    const loginResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!loginResponse.ok) {
      return res.status(500).json({ message: 'User created but login failed' });
    }

    const loginData = await loginResponse.json();

    // Transform user data to match our interface
    const user = {
      id: userData.id,
      username: userData.slug,
      email: userData.email,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      roles: userData.roles || [],
    };

    res.status(201).json({
      token: loginData.token,
      user,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration API Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
}
