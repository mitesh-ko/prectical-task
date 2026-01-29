<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {    
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('products/listing', [\App\Http\Controllers\ProductController::class, 'listingData'])->name('products.listing');
    Route::resource('products', \App\Http\Controllers\ProductController::class);
});

require __DIR__.'/settings.php';
