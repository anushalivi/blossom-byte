import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { MOCK_PRODUCTS } from '@/lib/data';
import { filterProductsWithValidImages } from '@/lib/validImages';

export async function GET() {
  try {
    await connectDB();
    // Populate category so frontend gets category name
    const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
    
    // Format for frontend compatibility
    const formatted = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      discount: p.discount,
      category: p.category ? p.category.slug : 'uncategorized',
      categoryId: p.category ? p.category._id.toString() : null,
      stock: p.stock,
      image: p.image,
      features: p.features,
      isFeatured: p.isFeatured,
      sku: p.sku
    }));

    const validOnly = filterProductsWithValidImages(formatted);
    return NextResponse.json({ success: true, products: validOnly });
  } catch (error) {
    const mockWithFeatured = filterProductsWithValidImages(
      MOCK_PRODUCTS.map(p => ({ ...p, isFeatured: p.featured }))
    );
    return NextResponse.json({ success: true, isOffline: true, products: mockWithFeatured, error: error.message });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const newProduct = await Product.create(data);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, error: error.message });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, ...updates } = data;
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, error: error.message });
  }
}
