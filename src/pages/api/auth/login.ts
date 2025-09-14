import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const wpUrl = process.env.WORDPRESS_URL || 'https://blog.samanportable.com';

    // Attempt to login to WordPress
    const wpResponse = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!wpResponse.ok) {
      let errorData;
      try {
        errorData = await wpResponse.json();
      } catch (parseError) {
        errorData = { message: 'Login failed' };
      }
      
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: errorData.message || 'Authentication failed'
      });
    }

    const wpData = await wpResponse.json();

    // Fetch additional user details
    const userResponse = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${wpData.token}`,
      },
    });

    let userDetails: any = {};
    if (userResponse.ok) {
      userDetails = await userResponse.json();
    }

    // Return success response with token and user details
    res.status(200).json({
      success: true,
      token: wpData.token,
      user: {
        id: userDetails.id || wpData.user_id,
        name: userDetails.name || wpData.user_display_name,
        email: userDetails.email || wpData.user_email,
        roles: userDetails.roles || ['customer'],
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
