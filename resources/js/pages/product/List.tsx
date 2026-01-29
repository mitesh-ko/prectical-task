import React, { useEffect, useMemo, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
    MaterialReactTable,
    MRT_ColumnDef,
    MRT_Row,
} from 'material-react-table'
import { Box, IconButton, Tooltip } from '@mui/material'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Button } from '@/components/ui/button'
import { create, destroy, edit, listing } from '@/routes/products'
import { Product } from '@/types/product'
import { dashboard } from '@/routes'
import { Delete, Edit } from 'lucide-react'

type Props = {
    products: Product[]
}

const ProductListTable: React.FC<Props> = ({ products }) => {
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [sorting, setSorting] = useState<any[]>([])
    const [rowCount, setRowCount] = useState(0)


    const columns = useMemo<MRT_ColumnDef<Product>[]>(
        () => [
            {
                enableSorting: false,
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
                enableSorting: false,
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
        router.visit(edit.url(row.original.id))
    }

    const handleDelete = (row: MRT_Row<Product>) => {
        router.delete(destroy.url(row.original.id), {
            preserveScroll: true,
        })
    }

    const fetchProducts = async () => {
        setIsLoading(true)

        const sort = sorting[0]

        const params = new URLSearchParams({
            page: String(pagination.pageIndex + 1),
            per_page: String(pagination.pageSize),
            sort_by: sort?.id ?? 'created_at',
            sort_order: sort?.desc ? 'desc' : 'asc',
        })

        const response = await fetch(`${listing.url()}?${params}`)
        const result = await response.json()

        console.log('Fetched products:', result)
        setData(result.data)
        setRowCount(result.total)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [pagination.pageIndex, pagination.pageSize, sorting])

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
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
                    data={data}
                    manualPagination
                    manualSorting
                    rowCount={rowCount}
                    state={{
                        isLoading,
                        pagination,
                        sorting,
                    }}
                    positionActionsColumn="last"
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    enableRowActions
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Tooltip title="Edit">
                                <IconButton
                                    onClick={() =>
                                        router.visit(`/products/${row.original.id}/edit`)
                                    }
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                                <IconButton
                                    onClick={() =>{
                                        router.delete(`/products/${row.original.id}`)
                                        fetchProducts()
                                    }}
                                >
                                    <Delete fontSize="small" />
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
