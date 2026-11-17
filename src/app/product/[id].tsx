import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import productosData from '../../data/productos.json';
import { localImages } from '../../data/imageMap';
import { useCart } from '../../context/CartContext';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, totalCount } = useCart();

  // Buscar el producto por id
  const product = productosData.find((p) => p.id === id);

  // Tallas disponibles y agotadas para la prenda
  const productTallas: string[] = (product as any)?.tallas || ['S', 'M', 'L', 'XL'];
  const tallasAgotadas: string[] = (product as any)?.tallasAgotadas || [];
  const primeraTallaDisponible =
    productTallas.find((t) => !tallasAgotadas.includes(t)) || productTallas[0];

  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>(primeraTallaDisponible);
  const [agregadoMensaje, setAgregadoMensaje] = useState<boolean>(false);

  // Estado del carrusel de imágenes
  const [activeProductId, setActiveProductId] = useState<string | undefined>(id);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reiniciar el índice de imagen y la talla al cambiar de prenda
  if (activeProductId !== id) {
    setActiveProductId(id);
    setCurrentImageIndex(0);
    setTallaSeleccionada(primeraTallaDisponible);
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Prenda no encontrada</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver al catálogo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Lista de imágenes disponibles de la prenda
  const images: string[] =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageKey];

  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Soporte de deslizamiento táctil (swipe)
  const handleTouchStart = (e: any) => {
    setTouchStartX(e.nativeEvent.pageX);
  };

  const handleTouchEnd = (e: any) => {
    if (touchStartX === null) return;
    const touchEndX = e.nativeEvent.pageX;
    const diffX = touchEndX - touchStartX;
    if (diffX > 45) {
      handlePrevImage();
    } else if (diffX < -45) {
      handleNextImage();
    }
    setTouchStartX(null);
  };

  const isTallaAgotada = tallasAgotadas.includes(tallaSeleccionada);

  const handleAddToCart = () => {
    if (isTallaAgotada) return;
    addToCart(product);
    setAgregadoMensaje(true);
    setTimeout(() => {
      setAgregadoMensaje(false);
    }, 2000);
  };

  const currentImageSource =
    localImages[images[currentImageIndex]] || localImages[product.imageKey];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Cabecera */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.marca.toUpperCase()}
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={20} color="#000" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartText}>{totalCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Contenido con scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Carrusel / Galería de imágenes de la prenda */}
        <View
          style={styles.imageContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Flecha Izquierda */}
          <TouchableOpacity
            style={[
              styles.arrowButton,
              styles.leftArrow,
              !hasMultipleImages && styles.arrowDisabled,
            ]}
            onPress={handlePrevImage}
            disabled={!hasMultipleImages}
            activeOpacity={0.7}
            accessibilityLabel="Foto anterior"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={hasMultipleImages ? '#fff' : 'rgba(255,255,255,0.25)'}
            />
          </TouchableOpacity>

          {/* Imagen central de la prenda */}
          <View
            style={[
              styles.imageWrapper,
              ((product as any).imageResizeMode === 'contain' || product.id === '10') &&
                styles.imageWrapperContain,
            ]}
          >
            <Image
              source={currentImageSource}
              style={[
                styles.productImage,
                ((product as any).imageResizeMode === 'contain' || product.id === '10') &&
                  styles.imageContain,
              ]}
              resizeMode={
                ((product as any).imageResizeMode === 'contain' || product.id === '10')
                  ? 'contain'
                  : 'cover'
              }
            />
          </View>

          {/* Flecha Derecha */}
          <TouchableOpacity
            style={[
              styles.arrowButton,
              styles.rightArrow,
              !hasMultipleImages && styles.arrowDisabled,
            ]}
            onPress={handleNextImage}
            disabled={!hasMultipleImages}
            activeOpacity={0.7}
            accessibilityLabel="Foto siguiente"
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={hasMultipleImages ? '#fff' : 'rgba(255,255,255,0.25)'}
            />
          </TouchableOpacity>

          {/* Indicador de fotos (1 / 2) */}
          {hasMultipleImages && (
            <View style={styles.badgeIndicator}>
              <Ionicons name="images-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>
                {currentImageIndex + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* Puntos de paginación (dots) */}
          {hasMultipleImages && (
            <View style={styles.dotsContainer}>
              {images.map((_, index) => {
                const isActive = index === currentImageIndex;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dot, isActive && styles.activeDot]}
                    onPress={() => setCurrentImageIndex(index)}
                    activeOpacity={0.8}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.detailsCard}>
          <View style={styles.tagRow}>
            <Text style={styles.brand}>{product.marca.toUpperCase()}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.categoria}</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.nombre}</Text>
          <Text style={styles.price}>{product.precio.toFixed(2)} €</Text>

          {/* Selector de tallas */}
          <Text style={styles.sectionSubtitle}>Seleccionar Talla</Text>
          <View style={styles.sizesRow}>
            {productTallas.map((talla) => {
              const isAgotada = tallasAgotadas.includes(talla);
              const isSelected = talla === tallaSeleccionada && !isAgotada;
              return (
                <TouchableOpacity
                  key={talla}
                  style={[
                    styles.sizeOption,
                    isSelected && styles.sizeOptionSelected,
                    isAgotada && styles.sizeOptionAgotada,
                  ]}
                  onPress={() => {
                    if (!isAgotada) {
                      setTallaSeleccionada(talla);
                    }
                  }}
                  disabled={isAgotada}
                  activeOpacity={0.7}
                  accessibilityLabel={isAgotada ? `Talla ${talla} agotada` : `Talla ${talla}`}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      isSelected && styles.sizeTextSelected,
                      isAgotada && styles.sizeTextAgotada,
                    ]}
                  >
                    {talla}
                  </Text>
                  {isAgotada && (
                    <Text style={styles.agotadoLabel}>Agotado</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Descripción */}
          <Text style={styles.sectionSubtitle}>Descripción</Text>
          <Text style={styles.description}>{product.descripcion}</Text>

          {/* Beneficios de compra */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#aaa" />
              <Text style={styles.featureText}>Producto 100% Original</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cube-outline" size={18} color="#aaa" />
              <Text style={styles.featureText}>Envío express 24/48h</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Barra inferior fija para añadir a la cesta */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            agregadoMensaje && styles.addButtonSuccess,
            isTallaAgotada && styles.addButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={isTallaAgotada}
          activeOpacity={0.8}
        >
          <Ionicons
            name={
              isTallaAgotada
                ? 'close-circle-outline'
                : agregadoMensaje
                ? 'checkmark-circle'
                : 'cart'
            }
            size={20}
            color={isTallaAgotada ? '#777' : '#000'}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.addButtonText,
              isTallaAgotada && styles.addButtonTextDisabled,
            ]}
          >
            {isTallaAgotada
              ? `Talla ${tallaSeleccionada} agotada`
              : agregadoMensaje
              ? '¡Añadido a la cesta!'
              : `Añadir a la cesta (${product.precio.toFixed(2)} €)`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  iconButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  cartBadge: {
    backgroundColor: '#000',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  cartText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    width: '100%',
    height: 340,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
    position: 'relative',
  },
  imageWrapper: {
    height: '100%',
    aspectRatio: 765 / 1024,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapperContain: {
    backgroundColor: '#ffffff',
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageContain: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none',
        } as any)
      : {}),
  },
  leftArrow: {
    left: 14,
  },
  rightArrow: {
    right: 14,
  },
  arrowDisabled: {
    opacity: 0.22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'default',
        } as any)
      : {}),
  },
  badgeIndicator: {
    position: 'absolute',
    top: 14,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
  badgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    zIndex: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        } as any)
      : {}),
  },
  activeDot: {
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  detailsCard: {
    padding: 20,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: '#888',
    letterSpacing: 1.5,
  },
  categoryBadge: {
    backgroundColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    color: '#ccc',
  },
  productName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    lineHeight: 26,
  },
  price: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  sizeOption: {
    flex: 1,
    height: 50,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        } as any)
      : {}),
  },
  sizeOptionSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  sizeOptionAgotada: {
    backgroundColor: '#141414',
    borderColor: '#262626',
    opacity: 0.65,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'not-allowed',
        } as any)
      : {}),
  },
  sizeText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  sizeTextSelected: {
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
  },
  sizeTextAgotada: {
    color: '#666',
    textDecorationLine: 'line-through',
    textDecorationColor: '#ef4444',
  },
  agotadoLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 8,
    color: '#ef4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#bbb',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresContainer: {
    backgroundColor: '#181818',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#aaa',
  },
  footer: {
    padding: 16,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  addButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonSuccess: {
    backgroundColor: '#4ade80',
  },
  addButtonDisabled: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'not-allowed',
        } as any)
      : {}),
  },
  addButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 14,
  },
  addButtonTextDisabled: {
    color: '#777',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 13,
  },
});
