import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Layers,
  Star,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Tag,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { buttonTapVariants, cardInteractiveVariants } from '../../utils/animations';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct, deleteProduct } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <AnimatedPage className="text-center py-12">
        <h2 className="text-lg font-bold text-[#172033]">Product Not Found</h2>
        <Link to="/vendor/products" className="wn-btn-primary text-xs mt-3 inline-flex">
          Back to Products
        </Link>
      </AnimatedPage>
    );
  }

  const activeImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <AnimatedPage className="space-y-6 pb-20 md:pb-6">
      <PageHeader
        title={product.name}
        subtitle={`SKU: ${product.sku} • Listed under ${product.category}`}
        breadcrumbs={[
          { label: 'Products', path: '/vendor/products' },
          { label: product.name }
        ]}
        badge={<StatusBadge status={product.status} size="md" />}
        actions={
          <div className="flex items-center gap-2">
            <motion.div variants={buttonTapVariants} whileTap="tap">
              <Link
                to={`/vendor/products/${product.id}/variants`}
                className="wn-btn-secondary text-xs flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-[#172B82]" />
                <span>Variants Matrix</span>
              </Link>
            </motion.div>
            <motion.button
              variants={buttonTapVariants}
              whileTap="tap"
              onClick={() => {
                if (window.confirm('Delete this garment from store catalog?')) {
                  deleteProduct(product.id);
                  success('Product deleted', `${product.name} removed.`);
                  navigate('/vendor/products');
                }
              }}
              className="p-2 rounded-xl border border-[#DDD7CA] text-[#DC2626] hover:bg-rose-50"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gallery / Images (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="aspect-square bg-white rounded-3xl border border-[#DDD7CA] overflow-hidden p-2.5 shadow-xs relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover rounded-2xl"
              />
            </AnimatePresence>
            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
              {product.brand}
            </span>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === i ? 'border-[#172B82] shadow-xs' : 'border-[#DDD7CA] opacity-70'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Price & Stock Card */}
          <motion.div
            variants={cardInteractiveVariants}
            className="bg-white p-5 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              <span className="line-through text-sm text-[#687085]">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {product.discountPercent}% OFF MRP
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-[#DDD7CA] grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA]">
                <span className="text-[#687085] block text-[11px] font-medium">Physical Stock</span>
                <span className="text-base font-bold text-[#172033]">{product.stock} Units</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA]">
                <span className="text-[#687085] block text-[11px] font-medium">Low Stock Alert</span>
                <span className="text-base font-bold text-[#F59E0B]">
                  &lt; {product.lowStockThreshold} Units
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] col-span-2 sm:col-span-1">
                <span className="text-[#687085] block text-[11px] font-medium">Total Sold</span>
                <span className="text-base font-bold text-[#172B82]">{product.salesCount} Delivered</span>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-[#172033]">Description & Details</h4>
            <p className="text-xs text-[#687085] leading-relaxed">{product.description}</p>

            <div className="pt-3 border-t border-[#DDD7CA] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#687085]">Brand:</span>{' '}
                <strong className="text-[#172033]">{product.brand}</strong>
              </div>
              <div>
                <span className="text-[#687085]">Rating:</span>{' '}
                <strong className="text-[#172033] text-amber-600">★ {product.rating} / 5.0</strong>
              </div>
            </div>
          </div>

          {/* Available Sizes & Variants */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#172033]">Size Matrix & Sizing</h4>
              <Link
                to={`/vendor/products/${product.id}/variants`}
                className="text-xs font-bold text-[#172B82] hover:underline"
              >
                Configure Matrix →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <motion.span
                  key={s}
                  whileTap={{ scale: 0.95 }}
                  className="px-3.5 py-1.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] font-bold text-xs text-[#172033]"
                >
                  Size {s}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

