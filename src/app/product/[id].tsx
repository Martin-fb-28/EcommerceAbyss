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

  // Tallas disponibles para la prenda
  const tallas = ['S', 'M', 'L', 'XL'];
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>('M');
  const [agregadoMensaje, setAgregadoMensaje] = useState<boolean>(false);

  // Buscar el producto por id
  const product = productosData.find((p) => p.id === id);

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

  const handleAddToCart = () => {
    addToCart(product);
    setAgregadoMensaje(true);
    setTimeout(() => {
      setAgregadoMensaje(false);
    }, 2000);
  };

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
        {/* Imagen de la prenda */}
        <View style={styles.imageContainer}>
          <Image
            source={localImages[product.imageKey]}
            style={styles.productImage}
            resizeMode="contain"
          />
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
            {tallas.map((talla) => {
              const isSelected = talla === tallaSeleccionada;
              return (
                <TouchableOpacity
                  key={talla}
                  style={[styles.sizeOption, isSelected && styles.sizeOptionSelected]}
                  onPress={() => setTallaSeleccionada(talla)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
                    {talla}
                  </Text>
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
          style={[styles.addButton, agregadoMensaje && styles.addButtonSuccess]}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons
            name={agregadoMensaje ? 'checkmark-circle' : 'cart'}
            size={20}
            color="#000"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.addButtonText}>
            {agregadoMensaje ? '¡Añadido a la cesta!' : `Añadir a la cesta (${product.precio.toFixed(2)} €)`}
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
    height: 320,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  productImage: {
    width: '100%',
    height: '100%',
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
    height: 44,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeOptionSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  sizeText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  sizeTextSelected: {
    color: '#000',
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
  addButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 14,
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
