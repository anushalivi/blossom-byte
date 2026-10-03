import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'blossom_secret_key_123';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Direct master admin check
    const isMasterAdmin = (normalizedEmail === 'anusha6363@gmail.com' || normalizedEmail === 'admin') && password === '@Anusha2026';

    try {
      await connectDB();
    } catch (e) {
      if (isMasterAdmin) {
        const token = jwt.sign({ userId: 'admin-anusha-01', isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
        const userData = { id: 'admin-anusha-01', name: 'Anusha', email: 'anusha6363@gmail.com', isAdmin: true, tier: 'Platinum' };
        return NextResponse.json({ success: true, token, user: userData });
      }
      return NextResponse.json({ success: false, error: 'Database connecting. Admin credentials: anusha6363@gmail.com / @Anusha2026' }, { status: 401 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      if (isMasterAdmin) {
        const token = jwt.sign({ userId: 'admin-anusha-01', isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
        const userData = { id: 'admin-anusha-01', name: 'Anusha', email: 'anusha6363@gmail.com', isAdmin: true, tier: 'Platinum' };
        return NextResponse.json({ success: true, token, user: userData });
      }
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    let isMatch = false;
    if (user.password === password) {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch && isMasterAdmin) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id || user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });

    const userData = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      tier: user.tier,
      addresses: user.addresses
    };

    return NextResponse.json({ success: true, token, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
