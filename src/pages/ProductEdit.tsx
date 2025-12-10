import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductForm } from "@/components/products/ProductForm";
import { useParams } from "react-router-dom";

export default function ProductEdit() {
  const { id } = useParams();
  const isNew = id === "new";

  return (
    <AdminLayout title={isNew ? "Add Product" : "Edit Product"}>
      <ProductForm />
    </AdminLayout>
  );
}
