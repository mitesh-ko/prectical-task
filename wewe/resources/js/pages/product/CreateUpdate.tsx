import { Form, Head } from '@inertiajs/react'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import AppLayout from '@/layouts/app-layout'

import { index, store, update } from '@/routes/products'
import { dashboard } from '@/routes'
import { BreadcrumbItem } from '@/types'
import { Product } from '@/types/product'
import { useEffect, useState } from 'react'

type Props = {
    product?: Product | null
}

export default function CreateProduct({ product }: Props) {

    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        )

        setImagePreviews(previews)
    }

    useEffect(() => {
        return () => {
            imagePreviews.forEach((src) =>
                URL.revokeObjectURL(src)
            )
        }
    }, [imagePreviews])

    const isEdit = Boolean(product?.id)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Products',
            href: index.url(),
        },
        {
            title: isEdit ? 'Update Product' : 'Create Product',
            href: isEdit ? update.url(product!.id!) : store.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Update Product' : 'Create Product'} />

            <div className="m-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-4">
                <Form
                    {...(isEdit
                        ? update.form(product!.id!)
                        : store.form())}
                    defaults={{
                        product_name: product?.product_name ?? '',
                        product_price: product?.product_price ?? '',
                        product_description: product?.product_description ?? '',
                    }}
                    encType="multipart/form-data"
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-6">
                            {/* Product Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="product_name">
                                    Product Name
                                </Label>
                                <Input
                                    id="product_name"
                                    name="product_name"
                                    required
                                    autoFocus
                                    placeholder="e.g. Mechanical Keyboard"
                                />
                                <InputError
                                    message={errors.product_name}
                                />
                            </div>

                            {/* Product Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="product_price">Price</Label>
                                <Input
                                    id="product_price"
                                    name="product_price"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                />
                                <InputError
                                    message={errors.product_price}
                                />
                            </div>

                            {/* Product Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="product_description">
                                    Description
                                </Label>
                                <Textarea
                                    id="product_description"
                                    name="product_description"
                                    placeholder="Describe your product..."
                                    className="min-h-[100px]"
                                />
                                <InputError
                                    message={errors.product_description}
                                />
                            </div>

                            {/* Product Images */}
                            <div className="grid gap-2">
                                <Label htmlFor="images">
                                    Product Images{' '}
                                    {isEdit && '(Please upload again)'}
                                </Label>
                                <Input
                                    id="images"
                                    name="images[]"
                                    type="file"
                                    multiple
                                    className="cursor-pointer file:text-foreground"
                                    onChange={handleImageChange}
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    You can select multiple images. The first one
                                    will be primary.
                                </p>
                                <InputError message={errors.images} />

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                                        {imagePreviews.map((src, index) => (
                                            <div
                                                key={index}
                                                className="relative border rounded-xl overflow-hidden shadow-sm"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-32 w-full object-cover"
                                                />
                                                {index === 0 && (
                                                    <span className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {isEdit ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}
