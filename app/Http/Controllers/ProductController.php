<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['images' => function ($query) {
            $query->where('is_primary', true);
        }])->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'product_name' => $product->name,
                'product_price' => $product->price,
                'product_description' => $product->description,
                'primary_image' => $product->images->first()
                    ? asset('storage/' . $product->images->first()->image_path)
                    : 'https://via.placeholder.com/150',
            ];
        });

        return Inertia::render('product/List', [
            'products' => $products
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('product/CreateUpdate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'product_description' => 'nullable|string',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $product = Product::create([
            'name' => $request->input('product_name'),
            'price' => $request->input('product_price'),
            'description' => $request->input('product_description'),
        ]);

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('product_images', 'public');
            $isPrimary = ($index == $request->input('primary_image_index'));

            $product->images()->create([
                'image_path' => $path,
                'is_primary' => $isPrimary,
            ]);
        }

        return redirect()->route('products.index')->with('success', 'Product created successfully');
    }

    public function edit(Request $request)
    {
        $product = Product::with('images')->findOrFail($request->route('product'));
        return Inertia::render('product/CreateUpdate', [
            'product' => $product
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Product::with('images')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'product_description' => 'nullable|string',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'primary_image_index' => 'required|integer|min:0',
        ]);
        $product->update([
            'product_name' => $request->input('product_name'),
            'product_price' => $request->input('product_price'),
            'product_description' => $request->input('product_description'),
        ]);

        $product->images()->delete();

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('product_images', 'public');
            $isPrimary = ($index == $request->input('primary_image_index'));

            $product->images()->create([
                'image_path' => $path,
                'is_primary' => $isPrimary,
            ]);
        }
        return redirect()->route('products.index')->with('success', 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        $product->images()->delete();

        return redirect()->back()->with('success', 'Product deleted successfully');
    }
}
