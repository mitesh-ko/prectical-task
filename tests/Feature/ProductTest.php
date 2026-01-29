<?php

use Illuminate\Support\Facades\Storage;


it('can create a product with image', function () {

    Storage::fake('public');

    $response = $this->post('/products', [
        'name'  => 'Test Product',
        'price' => 100,
        'image' => Storage::fake()->image('product.jpg'),
    ]);

    $response->assertRedirect('/products');

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'price' => 100,
    ]);

    Storage::disk('public')->assertExists('products/product.jpg');
});

it('fails validation when name is missing', function () {

    $response = $this->post('/products', [
        'price' => 100,
    ]);

    $response->assertSessionHasErrors('name');
});

it('can view products list', function () {

    \App\Models\Product::factory()->count(2)->create();

    $response = $this->get('/products');

    $response->assertOk()
             ->assertSeeText('Products');
});

it('can update a product', function () {

    Storage::fake('public');

    $product = \App\Models\Product::factory()->create();

    $response = $this->put("/products/{$product->id}", [
        'name'  => 'Updated Product',
        'price' => 200,
        'image' => Storage::fake()->image('updated.jpg'),
    ]);

    $response->assertRedirect('/products');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Product',
    ]);

    Storage::disk('public')->assertExists('products/updated.jpg');
});

it('can delete a product', function () {

    $product = \App\Models\Product::factory()->create();

    $response = $this->delete("/products/{$product->id}");

    $response->assertRedirect('/products');
});

