import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductsTable } from "@/components/products/ProductsTable";

export default function Products() {
  return (
    <AdminLayout title="Products">
      <ProductsTable />
    </AdminLayout>
  );
}
