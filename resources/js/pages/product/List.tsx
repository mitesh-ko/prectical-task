import React, { useMemo } from 'react'
import { Head, router } from '@inertiajs/react'
import {
    MaterialReactTable,
    MRT_ColumnDef,
    MRT_Row,
} from 'material-react-table'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Button } from '@/components/ui/button'
import { create } from '@/routes/products'
import { Product } from '@/types/product'

type Props = {
    products: Product[]
}

const ProductListTable: React.FC<Props> = ({ products }) => {
    const columns = useMemo<MRT_ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: 'primary_image',
                header: 'Image',
                size: 80,
                Cell: ({ cell }) => (
                    <img
                        src={cell.getValue<string>()}
                        alt="Product"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                    />
                ),
            },
            {
                accessorKey: 'product_name',
                header: 'Name',
                size: 200,
                Cell: ({ cell }) => (
                    <span className="font-medium text-slate-700">
                        {cell.getValue<string>()}
                    </span>
                ),
            },
            {
                accessorKey: 'product_description',
                header: 'Desc',
                size: 200,
                Cell: ({ cell }) => (
                    <span className="font-medium text-slate-700">
                        {cell.getValue<string>()}
                    </span>
                ),
            },
            {
                accessorKey: 'product_price',
                header: 'Price',
                size: 120,
                Cell: ({ cell }) => {
                    const value = Number(cell.getValue<number>())
                    return (
                        <span className="text-emerald-600 font-semibold">
                            ₹{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    )
                },
            },
        ],
        []
    )

    const handleEdit = (row: MRT_Row<Product>) => {
        router.visit(`/products/${row.original.id}/edit`)
    }

    const handleDelete = (row: MRT_Row<Product>) => {
        router.delete(`/products/${row.original.id}`, {
            preserveScroll: true,
        })
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="m-2">
                <Button onClick={() => router.visit(create.url())}>
                    Add Product
                </Button>
            </div>

            <div className="m-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 bg-white">
                    <h2 className="text-xl font-bold text-slate-800">
                        Product Inventory
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage your store products and pricing
                    </p>
                </div>

                <MaterialReactTable
                    columns={columns}
                    data={products}
                    enableRowActions
                    positionActionsColumn="last"
                    muiTablePaperProps={{ elevation: 0 }}
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Tooltip title="Edit">
                                <IconButton
                                    onClick={() => handleEdit(row)}
                                    className="text-blue-600 hover:bg-blue-50"
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                                <IconButton
                                    onClick={() => handleDelete(row)}
                                    className="text-red-600 hover:bg-red-50"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                />
            </div>
        </AppLayout>
    )
}

export default ProductListTable
