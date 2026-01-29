<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Product::with('images')->get();
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
            'primary_image_index' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'product_name' => $request->input('product_name'),
            'product_price' => $request->input('product_price'),
            'product_description' => $request->input('product_description'),
        ]);

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('product_images', 'public');
            $isPrimary = ($index == $request->input('primary_image_index'));

            $product->images()->create([
                'image_path' => $path,
                'is_primary' => $isPrimary,
            ]);
        }

        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
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
        return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        $product->images()->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
